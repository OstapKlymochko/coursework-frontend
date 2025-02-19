import Box from '@mui/material/Box';
import React from 'react';
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
    return (
        <Box bgcolor={'primary.main'} height={'100vh'}>
            <Outlet />
        </Box>
    );
}; 