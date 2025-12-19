'use client';

import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Avatar,
    Chip,
    useTheme,
    Button,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StoreIcon from '@mui/icons-material/Store';
import Link from 'next/link';
import { getStocks, getProducts, getWarehouses } from '@/services/api';
import { useEffect, useState } from 'react';

function StatCard({ title, value, icon, color, subtitle }: any) {
    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: color,
                    opacity: 0.1,
                    zIndex: 0,
                }}
            />
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        variant='rounded'
                        sx={{
                            bgcolor: `${color}22`, // 22 hex for transparency
                            color: color,
                            mr: 2,
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Typography
                        variant='h6'
                        color='text.secondary'
                        sx={{ fontWeight: 500 }}
                    >
                        {title}
                    </Typography>
                </Box>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant='body2' color='text.secondary'>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [stocks, setStocks] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalWarehouses: 0,
        totalStockQuantity: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stocksRes, productsRes, warehousesRes] =
                    await Promise.all([
                        getStocks({ limit: 5 }), // Get top 5 explicitly for preview
                        getProducts({ limit: 1 }), // Just to get total count
                        getWarehouses(),
                    ]);

                const allStocksRes = await getStocks({ limit: 100 });
                const totalQty = allStocksRes.data.reduce(
                    (sum: number, s: any) => sum + s.quantity,
                    0
                );

                setStocks(stocksRes.data);
                setStats({
                    totalProducts: productsRes.total || 0,
                    totalWarehouses: warehousesRes.length || 0,
                    totalStockQuantity: totalQty,
                });
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100vh',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth='xl' sx={{ pb: 8 }}>
            <Box sx={{ mb: 6, pt: 2 }}>
                <Typography
                    variant='h3'
                    component='h1'
                    sx={{ fontWeight: 800, mb: 1 }}
                >
                    Inventory{' '}
                    <span style={{ color: theme.palette.primary.main }}>
                        Overview
                    </span>
                </Typography>
                <Typography variant='subtitle1' color='text.secondary'>
                    Welcome back! Here's what's happening with your stock today.
                </Typography>
            </Box>

            {/* Stats Grid using Flexbox to avoid Grid usage issues */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 6 }}>
                <Box sx={{ flex: '1 1 250px' }}>
                    <StatCard
                        title='Total Products'
                        value={stats.totalProducts}
                        icon={<InventoryIcon fontSize='large' />}
                        color={theme.palette.primary.main}
                        subtitle='Registered items'
                    />
                </Box>
                <Box sx={{ flex: '1 1 250px' }}>
                    <StatCard
                        title='Total Warehouses'
                        value={stats.totalWarehouses}
                        icon={<WarehouseIcon fontSize='large' />}
                        color={theme.palette.secondary.main}
                        subtitle='Active Locations'
                    />
                </Box>
                <Box sx={{ flex: '1 1 250px' }}>
                    <StatCard
                        title='Total Stock'
                        value={stats.totalStockQuantity.toLocaleString()}
                        icon={<StoreIcon fontSize='large' />}
                        color='#f59e0b' // Amber
                        subtitle='Units across all locations'
                    />
                </Box>
            </Box>

            {/* Stock Table Section */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    bgcolor: 'rgba(30, 41, 59, 0.4)', // Semi-transparent
                    backdropFilter: 'blur(10px)',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Recent Stock Levels
                    </Typography>
                    <Link href='/stocks' passHref>
                        <Button
                            variant='outlined'
                            color='primary'
                            sx={{ borderRadius: 2 }}
                        >
                            View All
                        </Button>
                    </Link>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    '& th': {
                                        borderBottom:
                                            '1px solid rgba(255, 255, 255, 0.1)',
                                        fontWeight: 600,
                                    },
                                }}
                            >
                                <TableCell>Product Name</TableCell>
                                <TableCell>Warehouse</TableCell>
                                <TableCell align='right'>Quantity</TableCell>
                                <TableCell align='center'>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.map((row: any) => (
                                <TableRow
                                    key={`${row.productId}-${row.warehouseId}`}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.02)',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {row.productName}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={
                                                <WarehouseIcon
                                                    sx={{
                                                        fontSize:
                                                            '1rem !important',
                                                    }}
                                                />
                                            }
                                            label={row.warehouseName}
                                            size='small'
                                            variant='outlined'
                                            sx={{ borderRadius: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color:
                                                    row.quantity < 20
                                                        ? '#ef4444'
                                                        : 'inherit',
                                            }}
                                        >
                                            {row.quantity}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Chip
                                            label={
                                                row.quantity > 50
                                                    ? 'In Stock'
                                                    : row.quantity > 0
                                                    ? 'Low Stock'
                                                    : 'Out of Stock'
                                            }
                                            color={
                                                row.quantity > 50
                                                    ? 'success'
                                                    : row.quantity > 0
                                                    ? 'warning'
                                                    : 'error'
                                            }
                                            size='small'
                                            sx={{
                                                borderRadius: 1,
                                                minWidth: 80,
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {stocks.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align='center'
                                        sx={{ py: 4 }}
                                    >
                                        <Typography color='text.secondary'>
                                            No stock data available
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}
