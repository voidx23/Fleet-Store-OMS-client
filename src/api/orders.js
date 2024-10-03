import axios from 'axios';

const API_URL = 'https://fleet-store-oms-backend.onrender.com/api/orders';

export const addOrder = (orderData) => axios.post(`${API_URL}/add`, orderData);
export const getOrders = () => axios.get(API_URL);
export const updateOrder = (id, deliveryStatus) => 
    axios.put(`${API_URL}/update/${id}`, { deliveryStatus });


