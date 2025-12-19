'use client';

import * as React from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import PurchaseRequestForm from '@/components/PurchaseRequest/PurchaseRequestForm';
import {
    getWarehouses,
    getProducts,
    getPurchaseRequestById,
    updatePurchaseRequest,
} from '@/services/api';
import { useParams } from 'next/navigation';

export default function EditPurchaseRequestPage() {
    const params = useParams();
    const id = Number(params.id);

    const [loading, setLoading] = React.useState(true);
    const [initialData, setInitialData] = React.useState<any>(null);
    const [warehouses, setWarehouses] = React.useState([]);
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        if (!id) return;

        const init = async () => {
            try {
                const [wRes, pRes, prRes] = await Promise.all([
                    getWarehouses(),
                    getProducts({ limit: 1000 }),
                    getPurchaseRequestById(id),
                ]);
                setWarehouses(wRes);
                setProducts(pRes.data);
                setInitialData({
                    reference: prRes.reference,
                    warehouseId: prRes.warehouseId,
                    status: prRes.status,
                    items: prRes.items.map((i: any) => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        productName: i.productName,
                    })),
                });
            } catch (error) {
                console.error('Failed to load data', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    const handleSubmit = async (data: any) => {
        await updatePurchaseRequest(id, data);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!initialData) {
        return <Typography>Purchase Request not found</Typography>;
    }

    return (
        <Container maxWidth='md'>
            <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
                Edit Purchase Request
            </Typography>
            <PurchaseRequestForm
                initialData={initialData}
                warehouses={warehouses}
                products={products}
                onSubmit={handleSubmit}
                submitLabel='Update Request'
            />
        </Container>
    );
}
