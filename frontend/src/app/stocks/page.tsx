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
    TablePagination,
    Typography,
    CircularProgress,
    TextField,
} from '@mui/material';
import { getStocks } from '@/services/api';
import { useEffect, ChangeEvent, useState } from 'react';

export default function StocksPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Backend expects 1-indexed page
            const result = await getStocks({
                page: page + 1,
                limit: rowsPerPage,
                search,
            });
            setData(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Failed to fetch stocks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timer);
    }, [page, rowsPerPage, search]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearch(value);
    };

    return (
        <Container maxWidth='xl'>
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant='h4' component='h1' gutterBottom>
                    Stock Dashboard
                </Typography>
                <TextField
                    label='Search Stock'
                    variant='outlined'
                    size='small'
                    value={search}
                    onChange={handleSearchChange}
                />
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Warehouse Name</TableCell>
                                <TableCell align='right'>
                                    Current Quantity
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} align='center'>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align='center'>
                                        No stocks found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row: any) => (
                                    <TableRow
                                        key={`${row.productId}-${row.warehouseId}`}
                                    >
                                        <TableCell>{row.productName}</TableCell>
                                        <TableCell>
                                            {row.warehouseName}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {row.quantity}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}
