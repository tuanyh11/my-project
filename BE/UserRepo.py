import xml.etree.ElementTree as ET
import xml.dom.minidom as Minidom
import xml;
import uuid;
import hashlib

class UserRepo():
    def __init__(self, root: ET.Element, tree: ET.ElementTree, FILE_PATH):
        self.root = root
        self.tree = tree
        self.treeElement = root.find("users")
        self.FILE_PATH = FILE_PATH
    
    def writeFile(self):
        self.tree.write(self.FILE_PATH)

    def toDict(self, item: ET.Element):
        values = {}
        for child in item.iter():
            if child.tag != item.tag:
                values[child.tag] = child.text
        return values
    
    def login(self, email: str, password: str):
        data = {}
        def element_to_dict(element):
            result = {}
            for child in element:
                if child.tag == 'cart':
                    result[child.tag] = [element_to_dict(product) for product in child.findall('product')]
                elif child:
                    result[child.tag] = element_to_dict(child)
                else:
                    result[child.tag] = child.text
            return result
        for user in self.treeElement.iterfind("user"):
            user_email = user.find("email").text
            password_db = user.find("password").text
            if user_email == email and password_db == password:
                return element_to_dict(user)
        return data 
    
    def getUsers(self):
        users = []
        for user in self.treeElement:
            userValue = self.toDict(user)
            userValue.pop("cart", None)
            users.append(userValue)
        return users
    
    def newUser(self, newUser: dict):
        newUser["cart"] = ""
        newNode = ET.Element("user")
        for key, value in newUser.items():
            subNode = ET.Element(str(key))
            subNode.text = str(value)
            newNode.append(subNode)
        ET.dump(newNode)
        self.treeElement.append(newNode)
        self.writeFile()
    
    def deleteUserByEmail(self, email: str):
        elementRemoved = None
        for user in self.treeElement.iterfind("user"):
            if user.find("email").text == email:
                elementRemoved = self.toDict(user)
                self.treeElement.remove(user)
                self.writeFile()
                break  # Dừng vòng lặp sau khi xóa người dùng
        return elementRemoved


    
    def updateUser(self, id: str, data: dict):
        for user in self.treeElement.iterfind("user"):
            if user.find("email").text == id:
                for key, value in data.items():
                    if user.find(key) is not None:
                        user.find(key).text = str(value)
                self.writeFile()
                return True
        return False 
