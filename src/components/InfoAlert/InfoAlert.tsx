import {Box, Collapse, IconButton, Alert} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, {FC, useEffect, useState} from 'react';

interface IProps {
    severity: "success" | "info" | "warning" | "error" | undefined;
    content: string;
}

export const InfoAlert: FC<IProps> = ({severity, content}: IProps) => {
    const [open, setOpen] = useState<boolean>();

    useEffect(() => {
        setOpen(!!content);
    }, [content]);

    return (
        <Box sx={{width: '100%'}}>
            <Collapse in={open}>
                <Alert action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}>
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>} severity={severity}>
                    {content}
                </Alert>
            </Collapse>
        </Box>
    );
};