import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import Navbar from '@/components/Layout/Navbar';
import Box from '@mui/material/Box';

export const metadata = {
    title: 'Foom Inventory',
    description: 'Inventory Allocation System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body suppressHydrationWarning={true}>
                <ThemeRegistry>
                    <Box
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Navbar />
                        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                            {children}
                        </Box>
                    </Box>
                </ThemeRegistry>
            </body>
        </html>
    );
}
