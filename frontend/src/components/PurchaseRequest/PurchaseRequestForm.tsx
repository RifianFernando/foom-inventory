'use client';

import * as React from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    sku: string;
}

interface Warehouse {
    id: number;
    name: string;
}

interface PurchaseRequestItem {
    productId: number;
    quantity: number;
    productName?: string;
}

interface PurchaseRequestFormProps {
    initialData?: {
        reference: string;
        warehouseId: number;
        status: string;
        items: PurchaseRequestItem[];
    };
    warehouses: Warehouse[];
    products: Product[];
    onSubmit: (data: any) => Promise<void>;
    submitLabel: string;
}

export default function PurchaseRequestForm({
    initialData,
    warehouses,
    products,
    onSubmit,
    submitLabel,
}: PurchaseRequestFormProps) {
    const router = useRouter();
    const [reference, setReference] = React.useState(
        initialData?.reference || ''
    );
    const [warehouseId, setWarehouseId] = React.useState<number | ''>(
        initialData?.warehouseId || ''
    );
    const [status, setStatus] = React.useState(initialData?.status || 'DRAFT');
    const [items, setItems] = React.useState<PurchaseRequestItem[]>(
        initialData?.items || []
    );
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleAddItem = () => {
        setItems([...items, { productId: 0, quantity: 1, productName: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (
        index: number,
        field: keyof PurchaseRequestItem,
        value: any
    ) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        if (field === 'productId') {
            const product = products.find((p) => p.id === value);
            newItems[index].productName = product?.name || '';
        }
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!reference) {
            setError('Reference is required');
            return;
        }
        if (!warehouseId) {
            setError('Warehouse is required');
            return;
        }
        if (items.length === 0) {
            setError('At least one item is required');
            return;
        }
        for (const item of items) {
            if (!item.productId || item.productId === 0) {
                setError('All items must have a product selected');
                return;
            }
            if (item.quantity <= 0) {
                setError('Quantity must be greater than 0');
                return;
            }
        }

        setLoading(true);
        try {
            await onSubmit({
                reference,
                warehouseId: Number(warehouseId),
                status,
                items: items.map((i) => ({
                    productId: i.productId,
                    quantity: Number(i.quantity),
                })),
            });
            router.push('/purchase-requests');
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Failed to submit form'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {Array.isArray(error)
                        ? error.map((e: any) => <div key={e}>{e}</div>)
                        : error}
                </Alert>
            )}

            {/* Using Box with flex instead of Grid to avoid version conflicts/types issues for now */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                    <TextField
                        fullWidth
                        label='Reference'
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        required
                        disabled={!!initialData}
                    />
                </Box>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                    <TextField
                        select
                        fullWidth
                        label='Warehouse'
                        value={warehouseId}
                        onChange={(e) => setWarehouseId(Number(e.target.value))}
                        required
                        disabled={!!initialData}
                    >
                        {warehouses.map((w) => (
                            <MenuItem key={w.id} value={w.id}>
                                {w.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                {initialData && (
                    <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <TextField
                            select
                            fullWidth
                            label='Status'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <MenuItem value='DRAFT'>DRAFT</MenuItem>
                            <MenuItem value='PENDING'>PENDING</MenuItem>
                        </TextField>
                    </Box>
                )}
            </Box>

            <Typography variant='h6' gutterBottom>
                Items
            </Typography>

            <Paper variant='outlined' sx={{ mb: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell width={150}>Quantity</TableCell>
                                <TableCell width={50}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                            select
                                            fullWidth
                                            size='small'
                                            value={item.productId || ''}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'productId',
                                                    Number(e.target.value)
                                                )
                                            }
                                            error={!item.productId}
                                        >
                                            {products.map((p) => (
                                                <MenuItem
                                                    key={p.id}
                                                    value={p.id}
                                                >
                                                    {p.sku} - {p.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type='number'
                                            fullWidth
                                            size='small'
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'quantity',
                                                    e.target.value
                                                )
                                            }
                                            InputProps={{
                                                inputProps: { min: 1 },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color='error'
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align='center'>
                                        No items added
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ p: 2 }}>
                    <Button startIcon={<AddIcon />} onClick={handleAddItem}>
                        Add Item
                    </Button>
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : submitLabel}
                </Button>
                <Button
                    variant='outlined'
                    color='secondary'
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </Box>
        </form>
    );
}
