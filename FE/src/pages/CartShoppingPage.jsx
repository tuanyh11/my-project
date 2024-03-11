import { useContext } from 'react';
import { Layout, OrderCard } from '../components';
import { GoToTop } from '../utils';
import { Context } from '../context';
import { Link } from 'react-router-dom';
import { totalPrice } from '../utils';
import { useCreateDate } from '../hooks';
import { deleteProductInCart } from '../apis';
import useStore from '../store';
import { products } from '../assets/products';

export const CartShoppingPage = () => {

    const context = useContext(Context);
    const date = useCreateDate();
    GoToTop();
    const email = localStorage.getItem('email');
    
    const {cart} = useStore()
    
    const handleDelete = async(id) => {
        try {
            const response = await deleteProductInCart(email, id);
            if (response) {
                console.log('Delete successful');
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
        const filteredProducts = context.cartProducts.filter(prod => prod.id != id);
        context.setCartProducts(filteredProducts);
    }

    const handleCheckout = () => {
        const orderToAdd = {
            id: new Date().getTime(),
            date: date,
            products: context.cartProducts,
            totalProducts: context.cartProducts.length,
            totalPrice: totalPrice(context.cartProducts)
        }

        context.setOrder([...context.order, orderToAdd]);
        context.setCartProducts([]);
        context.closeCheckoutSideMenu();
        //context.setSearchByTitle(null);
    }

    const totalPriceProductToCart = ()=>{
        const productJSON = localStorage.getItem('comprarShopi');

        const products = JSON.parse(productJSON);
    
        let total = 0;
    
        products?.forEach(product => {
            const price = parseFloat(product.price);
            const quantity = parseFloat(product.quantity);
            
            total += price * quantity;

        });
        return total
    }


    return (
        <Layout>
            <h1 className='mb-5 font-bold text-4xl'>My shopping cart</h1>

            <div className='flex flex-grow justify-between items-start max-w-screen-lg'>
                <div className='overflow-y-scroll px-20'>
                    {
                        cart.map((prod) => {
                            const productImage = products[Math.floor(Math.random() * products.length)].images;
                            return (
                                <OrderCard
                                    key={prod.id}
                                    id={prod.id}
                                    title={prod.name}
                                    imageUrl={productImage[Math.floor(Math.random() * productImage.length)]}
                                    price={prod.price}
                                    handleDelete={handleDelete}
                                />
                            )
                        })
                    }
                </div>
                <div className='px-4 mb-4'>
                    <p className='flex flex-row justify-between items-center'>
                        <span className='mr-5'>Total in the shopping cart:</span>
                        
                        <span className='font-medium text-2xl text-red-800'>${totalPriceProductToCart()}</span>
                    </p>
                    {
                        context.productsCount !== 0 &&
                        <div>
                            <Link to='/my-orders/last'>
                                <button
                                    type='button'
                                    className='border-2 p-2 rounded-lg w-full mt-3 bg-orange-200' 
                                    onClick={() => handleCheckout()}
                                >
                                    Buy
                                </button>
                            </Link>
                            <button
                                type='button'
                                onClick={() => context.setCartProducts([])}
                                className='border-2 p-2 rounded-lg w-full bg-red-200 mt-3'
                            >
                                Delete all items
                            </button>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
};