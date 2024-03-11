import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/solid';
// import { deleteProductInCart } from '../apis';


export const OrderCard = ({ id, title, imageUrl, price, handleDelete }) => {
    // const email = localStorage.getItem('email');

    // handleDelete= async(id)=>{
    //     console.log(id)
    //     try {
    //         const response = await deleteProductInCart(email, id);
    //         if (response) {
    //             console.log('Delete successful');
    //         } else {
    //             setError(response.data.error);
    //         }
    //     } catch (error) {
    //         console.error('An error occurred:', error);
    //     }
    // }
    return (
        <div className='flex justify-between items-center px-4 mb-2'>
            <div className='flex items-center gap-2'>
                <figure className='w-20 h-20'>
                    <img className='w-full h-full object-contain' src={imageUrl} alt={`Image ${title}`} />
                </figure>
                <div>
                    <p className='text-sm font-light'>{title}</p>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <p className='font-medium text-lg text-red-800'>${price}</p>
                    <XMarkIcon
                        className='h-6 w-6 text-black cursor-pointer'
                        onClick={() => handleDelete(id)}
                    ></XMarkIcon>
            </div>
        </div>
    )
};

