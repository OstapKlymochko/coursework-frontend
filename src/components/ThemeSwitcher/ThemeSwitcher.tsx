import IconButton from "@mui/material/IconButton";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { commonActions } from "../../redux";
import Brightness5Icon from '@mui/icons-material/Brightness5';
import Brightness4Icon from '@mui/icons-material/Brightness4';

export const ThemeSwitcher = () => {

    const dispatch = useAppDispatch();
    const { mode } = useAppSelector(s => s.commonReducer);

    const setTheme = (mode: 'light' | 'dark') => {
        dispatch(commonActions.setMode(mode));
    }

    return (
        <>
            <IconButton
                sx={{ fontSize: "1rem" }}
                onClick={(() => setTheme('light'))}
                color="inherit"
                disableTouchRipple
                disableRipple
                disabled={mode === 'light'}
            >
                <Brightness5Icon />
            </IconButton>
            <IconButton
                sx={{ fontSize: "1rem" }}
                onClick={(() => setTheme('dark'))}
                color="inherit"
                disableTouchRipple
                disableRipple
                disabled={mode === 'dark'}
            >
                <Brightness4Icon />
            </IconButton>
        </>
    );
};
