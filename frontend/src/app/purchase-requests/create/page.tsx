'use client';

import * as React from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import PurchaseRequestForm from '@/components/PurchaseRequest/PurchaseRequestForm';
import {
    getWarehouses,
    getProducts,
    createPurchaseRequest,
} from '@/services/api';

export default function CreatePurchaseRequestPage() {
    const [loading, setLoading] = React.useState(true);
    const [warehouses, setWarehouses] = React.useState([]);
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        const init = async () => {
            try {
                const [wRes, pRes] = await Promise.all([
                    getWarehouses(),
                    getProducts({ limit: 1000 }), // Get all products (simplified)
                ]);
                setWarehouses(wRes);
                setProducts(pRes.data); // Assuming pRes is { data: [], total: ... }
            } catch (error) {
                console.error('Failed to load initial data', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleSubmit = async (data: any) => {
        await createPurchaseRequest(data);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth='md'>
            <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
                Create Purchase Request
            </Typography>
            <PurchaseRequestForm
                warehouses={warehouses}
                products={products}
                onSubmit={handleSubmit}
                submitLabel='Create Request'
            />
        </Container>
    );
}
