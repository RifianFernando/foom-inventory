'use client';

import * as React from 'react';
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
    Button,
    Chip,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPurchaseRequests, deletePurchaseRequest } from '@/services/api';
import Link from 'next/link';

export default function PurchaseRequestsPage() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<any[]>([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getPurchaseRequests({
                page: page + 1,
                limit: rowsPerPage,
            });
            setData(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Failed to fetch purchase requests', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this purchase request?')) {
            try {
                await deletePurchaseRequest(id);
                fetchData();
            } catch (error) {
                alert(
                    'Failed to delete purchase request (Status might not be DRAFT)'
                );
            }
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                    Purchase Requests
                </Typography>
                <Link href='/purchase-requests/create' passHref>
                    <Button variant='contained' startIcon={<AddIcon />}>
                        New Request
                    </Button>
                </Link>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reference</TableCell>
                                <TableCell>Vendor</TableCell>
                                <TableCell>Warehouse</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align='right'>Qty Total</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align='right'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align='center'>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align='center'>
                                        No purchase requests found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row: any) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.reference}</TableCell>
                                        <TableCell>
                                            PT FOOM LAB GLOBAL
                                        </TableCell>
                                        <TableCell>{row.warehouse}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                color={
                                                    row.status === 'COMPLETED'
                                                        ? 'success'
                                                        : row.status ===
                                                          'PENDING'
                                                        ? 'warning'
                                                        : 'default'
                                                }
                                                size='small'
                                            />
                                        </TableCell>
                                        <TableCell align='right'>
                                            {row.qty_total}
                                        </TableCell>
                                        <TableCell>
                                            {row.request_date}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Link
                                                href={`/purchase-requests/${row.id}`}
                                                passHref
                                            >
                                                <IconButton
                                                    size='small'
                                                    color='primary'
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Link>
                                            {row.status === 'DRAFT' && (
                                                <IconButton
                                                    size='small'
                                                    color='error'
                                                    onClick={() =>
                                                        handleDelete(row.id)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
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
