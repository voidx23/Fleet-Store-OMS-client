// src/OrderForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { storage } from '../../firebase'; // Import the storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
    const [order, setOrder] = useState({
        customerName: '',
        productImage: null,
        trackingImage: null,
        customerDetails: {
            address: '',
            landmark: '',
            district: '',
            state: '',
            pincode: '',
            mobile1: '',
            mobile2: ''
        },
        product: {
            name: '',
            color: '',
            size: '',
            amount: 0,
            orderMode: 'COD', // default value can be COD or UPI
        },
        deliveryStatus: 'Pending',
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (name.startsWith('customerDetails.')) {
            const field = name.split('.')[1];
            setOrder(prevOrder => ({
                ...prevOrder,
                customerDetails: { ...prevOrder.customerDetails, [field]: value },
            }));
        } else if (name.startsWith('product.')) {
            const field = name.split('.')[1];
            setOrder(prevOrder => ({
                ...prevOrder,
                product: { ...prevOrder.product, [field]: value },
            }));
        } else if (type === 'file') {
            setOrder(prevOrder => ({
                ...prevOrder,
                [name]: files[0], // Simplifying this to directly assign the file
            }));
        } else {
            setOrder(prevOrder => ({ ...prevOrder, [name]: value }));
        }
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        try {
            // Upload images to Firebase Storage
            const productImageRef = ref(storage, `images/${order.productImage.name}`);
            const trackingImageRef = ref(storage, `images/${order.trackingImage.name}`);

            // Upload product image
            await uploadBytes(productImageRef, order.productImage);
            const productImageURL = await getDownloadURL(productImageRef);

            // Upload tracking image
            await uploadBytes(trackingImageRef, order.trackingImage);
            const trackingImageURL = await getDownloadURL(trackingImageRef);
            console.log(trackingImageURL, "this is the tracking image url");
            console.log(productImageURL, "this is the product image ref");
            // Append order details to form data
            formData.append('customerName', order.customerName);
            formData.append('productImage', productImageURL);
            formData.append('trackingImage', trackingImageURL);
            formData.append('deliveryStatus', order.deliveryStatus);

            // Append customer details
            Object.keys(order.customerDetails).forEach(key => {
                formData.append(`customerDetails[${key}]`, order.customerDetails[key]);
            });

            // Append product details
            Object.keys(order.product).forEach(key => {
                formData.append(`product[${key}]`, order.product[key]);
            });

            console.log([...formData], "form data"); // log the form data as an array of key-value pairs

            // Direct API call
            const response = await axios.post('https://fleet-store-oms-backend.onrender.com/api/orders/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Order added successfully');
            console.log(response, " this is the res");

            // Reset the form after successful submission
            if (response.status === 200) {
                setOrder({
                    customerName: '',
                    productImage: null,
                    trackingImage: null,
                    customerDetails: {
                        address: '',
                        landmark: '',
                        district: '',
                        state: '',
                        pincode: '',
                        mobile1: '',
                        mobile2: ''
                    },
                    product: {
                        name: '',
                        color: '',
                        size: '',
                        amount: 0,
                        orderMode: 'COD',
                    },
                    deliveryStatus: 'Pending',
                });
            }
        } catch (error) {
            console.error(error);
            alert('Failed to add order. Please try again.');
        }
    };
    const handleOrderList = () => {
        navigate('/'); // Redirect to the OrderForm component
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white">
            <button onClick={handleOrderList}>Order List</button>
             
            <div className='border border-gray-300 p-8 m-10'>
            <h1 className="text-2xl font-bold mb-4">Add New Order</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Customer Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={order.customerName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                </div>
                <div>
                    <label className="block mb-1">Product Image</label>
                    <input
                        type="file"
                        name="productImage"
                        onChange={handleChange}
                        accept="image/*"
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                </div>
                <div>
                    <label className="block mb-1">Tracking Image</label>
                    <input
                        type="file"
                        name="trackingImage"
                        onChange={handleChange}
                        accept="image/*"
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mt-4">Customer Details</h2>
                    <label className="block mb-1">Address</label>
                    <input
                        type="text"
                        name="customerDetails.address"
                        value={order.customerDetails.address}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Landmark</label>
                    <input
                        type="text"
                        name="customerDetails.landmark"
                        value={order.customerDetails.landmark}
                        onChange={handleChange}
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">District</label>
                    <input
                        type="text"
                        name="customerDetails.district"
                        value={order.customerDetails.district}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">State</label>
                    <input
                        type="text"
                        name="customerDetails.state"
                        value={order.customerDetails.state}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Pincode</label>
                    <input
                        type="text"
                        name="customerDetails.pincode"
                        value={order.customerDetails.pincode}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Mobile 1</label>
                    <input
                        type="text"
                        name="customerDetails.mobile1"
                        value={order.customerDetails.mobile1}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Mobile 2</label>
                    <input
                        type="text"
                        name="customerDetails.mobile2"
                        value={order.customerDetails.mobile2}
                        onChange={handleChange}
                        className="w-full p-2 border rounded border-black"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mt-4">Product Details</h2>
                    <label className="block mb-1">Product Name</label>
                    <input
                        type="text"
                        name="product.name"
                        value={order.product.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Color</label>
                    <input
                        type="text"
                        name="product.color"
                        value={order.product.color}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Size</label>
                    <input
                        type="text"
                        name="product.size"
                        value={order.product.size}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Amount</label>
                    <input
                        type="number"
                        name="product.amount"
                        value={order.product.amount}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded border-black"
                    />
                    <label className="block mb-1">Order Mode</label>
                    <select
                        name="product.orderMode"
                        value={order.product.orderMode}
                        onChange={handleChange}
                        className="w-full p-2 border rounded border-black"
                    >
                        <option value="COD">Cash on Delivery</option>
                        <option value="UPI">UPI</option>
                    </select>
                </div>
                <button type="submit" className="mt-4 p-2 bg-black text-white rounded">
                    Add Order
                </button>
            </form>
            </div>
        </div>
    );
};

export default OrderForm;
