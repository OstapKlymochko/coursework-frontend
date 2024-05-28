import React, {FC} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface IProps {
    severity: "success" | "info" | "warning" | "error" | undefined;
    content: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<any>>
}

export const InfoPopup: FC<IProps> = ({severity, content, open, setOpen}) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(null);
    };
    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{width: '100%'}}>
                    {content}
                </Alert>
            </Snackbar>
        </div>
    );
}