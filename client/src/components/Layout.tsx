import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}> 
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}