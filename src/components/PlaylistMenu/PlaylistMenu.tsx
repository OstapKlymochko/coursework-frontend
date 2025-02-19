import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {songsActions} from "../../redux";
import {FC} from "react";
import {AsyncThunk} from "@reduxjs/toolkit";
import {useAppDispatch} from "../../hooks";
import {useNavigate} from "react-router-dom";


const actions = [{
    label: 'Delete', action: songsActions.deleteCollection, navigateTo: '/library'
}]

const ITEM_HEIGHT = 48;

interface IProps {
    id: number;
}

export const PlaylistMenu: FC<IProps> = ({id}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const performOperation = (action: AsyncThunk<any, any, any>, navigateTo: string) => {
        dispatch(action(id));
        if (navigateTo) navigate(navigateTo);
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                // PaperProps={{
                //     style: {
                //         maxHeight: ITEM_HEIGHT * 4.5,
                //         width: '20ch',
                //     },
                // }}
            >
                {actions.map(({label, action, navigateTo}) => (
                    <MenuItem key={label} onClick={() => performOperation(action, navigateTo)}>
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
