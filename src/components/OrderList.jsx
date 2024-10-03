import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder } from '../api/orders';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await getOrders();
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateOrder(id, newStatus);
            setOrders(orders.map(order =>
                order._id === id ? { ...order, deliveryStatus: newStatus } : order
            ));
        } catch (err) {
            setError('Failed to update order status. Please try again.');
        }
    };

    const handleAddOrder = () => {
        navigate('/add-order'); // Redirect to the OrderForm component
    };

    return (
        <div className="flex justify-center items-center w-full bg-gray-100"> {/* Background color added */}
            <div className="order-list-container flex flex-col justify-center items-center w-full max-w-lg p-4 bg-white shadow-lg rounded-lg"> {/* Added bg-white, shadow, and rounded */}
                <h1 className="text-2xl font-bold mb-4">Order List</h1>
                <button
                    className="mb-4 bg-green-500 text-white py-2 px-4 rounded"
                    onClick={handleAddOrder}
                >
                    Add Order
                </button>
                {loading && <p className="text-gray-500">Loading orders...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {orders.length === 0 && !loading && <p className="text-gray-500">No orders available.</p>}
                {orders.map((order) => (
                    <div key={order._id} className="border p-4 rounded-md mb-4 shadow-md flex flex-col"> {/* Shadow for better visibility */}
                        <h2 className="text-xl font-semibold">{order.customerName}</h2>
                        <p><strong>Address:</strong> {order.customerDetails.address}, {order.customerDetails.landmark}, {order.customerDetails.district}, {order.customerDetails.state}, {order.customerDetails.pincode}</p>
                        <p><strong>Mobile 1:</strong> {order.customerDetails.mobile1}, <strong>Mobile 2:</strong> {order.customerDetails.mobile2}</p>
                        <p><strong>Product:</strong> {order.product.name} (Color: {order.product.color}, Size: {order.product.size})</p>
                        <p><strong>Amount:</strong> {order.product.amount}</p>
                        <p><strong>Order Mode:</strong> {order.product.orderMode}</p>
                        <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
                        <br />
                        <h1 className='text-xl font-bold'>Product</h1>
                        <img src={`${order.productImage}`} alt="Product" className="w-24 h-24 object-cover" />
                        <h1 className='text-xl font-bold'>Tracking</h1>
                        <img src={`${order.trackingImage}`} alt="Tracking" className="w-24 h-24 object-cover" />
                        <button
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                            onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                        >
                            Mark as Delivered
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderList;
