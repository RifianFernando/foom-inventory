'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
    { name: 'Dashboard', path: '/' },
    { name: 'Stocks', path: '/stocks' },
    { name: 'Purchase Requests', path: '/purchase-requests' },
];

function Navbar() {
    const pathname = usePathname();

    return (
        <AppBar position='sticky' elevation={0}>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography
                        variant='h6'
                        noWrap
                        component={Link}
                        href='/'
                        sx={{
                            mr: 4,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FOOM
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                        {pages.map((page) => (
                            <Button
                                key={page.path}
                                component={Link}
                                href={page.path}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    fontWeight:
                                        pathname === page.path
                                            ? 'bold'
                                            : 'normal',
                                    borderBottom:
                                        pathname === page.path
                                            ? '2px solid white'
                                            : 'none',
                                    borderRadius: 0,
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
