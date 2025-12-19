import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

// Stocks
export const getStocks = async (params?: any) => {
    const response = await api.get('/stocks', { params });
    return response.data;
};

// Products
export const getProducts = async (params?: any) => {
    const response = await api.get('/products', { params });
    return response.data;
};

// Purchase Requests
export const getPurchaseRequests = async (params?: any) => {
    const response = await api.get('/purchase/request', { params });
    return response.data;
};

export const createPurchaseRequest = async (data: any) => {
    const response = await api.post('/purchase/request', data);
    return response.data;
};

export const updatePurchaseRequest = async (id: number, data: any) => {
    const response = await api.put(`/purchase/request/${id}`, data);
    return response.data;
};

export const deletePurchaseRequest = async (id: number) => {
    const response = await api.delete(`/purchase/request/${id}`);
    return response.data;
};

export const getPurchaseRequestById = async (id: number) => {
    const response = await api.get(`/purchase/request/${id}`);
    return response.data;
};

export const getWarehouses = async () => {
    const response = await api.get('/purchase/warehouses');
    return response.data;
};

export default api;
