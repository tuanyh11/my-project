import xml.etree.ElementTree as ET
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_wtf import FlaskForm
from UserRepo import UserRepo
from CartRePo import CartRepo
from ProductRepo import ProductRepo


# FILE_PATH = "/data/shop.xml"
FILE_PATH = "../data/shop.xml"
tree = ET.parse(FILE_PATH)

root = tree.getroot()

productRepo = ProductRepo(root, tree, FILE_PATH)
userRepo = UserRepo(root, tree, FILE_PATH)
cartRepo = CartRepo(root, tree, FILE_PATH)
    
     

app = Flask(__name__)
CORS(app)

@app.route("/products")
def getProduct():
    search = request.args.get("search")
    if(search == None):
        return jsonify(productRepo.getProducts())
    else: 
        return jsonify(productRepo.findProductByQuery(str(search)))
    
@app.route("/products", methods=['POST'])
def createProduct():
   try:
    newProduct = request.get_json()
    newProduct['totalCartQuantity'] = '0'
    newProduct['price'] = str(newProduct['price'])
    productRepo.newProduct(newProduct)
    print(newProduct)
    return jsonify({"message": "Product created successfully"})
   except Exception as e:
       return jsonify({"message": "Failed to create product"}), 404
  
@app.route("/products/<id>", methods=['DELETE'])
def deleteProduct(id):
    try:
        productRepo.deleteProduct(id)
        return jsonify({"message": "Product deleted successfully"})
    except Exception as e:
       print(e)
       return jsonify({"message": "Failed to deleted product"}), 404

@app.route("/products/<id>", methods=['PUT'])
def updateProduct(id):
    try:
        newProduct = request.get_json()
        del newProduct['id']
        productRepo.updateProduct(id, newProduct)
        return jsonify({"message": "Product updated successfully"})
    except Exception as e:
       print(e)
       return jsonify({"message": "Failed to update product"}), 404

# Định tuyến người dùng
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    authenticated = userRepo.login(email, password)

    print(authenticated)
    if len(authenticated) != 0:
        return jsonify({'message': 'Login successful', "data": authenticated}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401




@app.route("/users")
def getUsers():
    search = request.args.get("search")
    if search is None:
        return jsonify(userRepo.getUsers())
    else:
        return jsonify(userRepo.findUserByEmail(str(search)))

@app.route("/users/", methods=['POST'])
def createUser():
    try:
        newUser = request.get_json()
        userRepo.newUser(newUser)
        return jsonify({"message": "User created successfully"})
    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to create user"}), 404

@app.route('/users/<email>', methods=['DELETE'])
def delete_user(email):
    if email is None:
        return jsonify({'error': 'Email parameter is missing'}), 400
    element_removed = userRepo.deleteUserByEmail(email)
    if element_removed is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'message': 'User deleted successfully', 'deleted_user': element_removed}), 200

@app.route("/users/<email>", methods=['PUT'])
def updateUser(email):
    try:
        userData = request.get_json()
        del userData['email']
        print(userData)
        userRepo.updateUser(email, userData)
        return jsonify({"message": "User updated successfully"})
    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to update user"}), 404



# Định tuyến giỏ hàng
@app.route("/cart/<email>/<product_id>", methods=['POST'])
def addToCart(email, product_id): 
    success, message = cartRepo.addProductToCart(email, product_id)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"message": message}), 400


# @app.route("/cart/update", methods=['PUT'])
# def update_product_in_cart():
#     try:
#         data = request.get_json()
#         result = cartRepo.updateProduct(data)
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"message": "Failed to update product in cart"}), 404

@app.route("/cart/<user_id>/<product_id>", methods=['DELETE'])
def deleteProductInCart(user_id, product_id):
    try:
        success, message = cartRepo.deleteProductInCart(user_id, product_id)
        
        if success:
            return jsonify({"message": message}), 200  
        else:
            return jsonify({"message": message}), 404  # Trả về mã 404 nếu không tìm thấy người dùng hoặc sản phẩm
    except Exception as e:
        return jsonify({"message": "Failed to delete product"}), 400
 

if __name__ == '__main__':
    # Chạy ứng dụng trên cổng 5000 (hoặc cổng bạn chọn)
    app.run(debug=True,port=5000)


