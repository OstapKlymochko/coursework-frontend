import React, { FC } from 'react';
import { useAppDispatch } from "../../hooks";
import { InfoPopup } from "../InfoPopup/InfoPopup";

interface IProps {
    severity: "success" | "info" | "warning" | "error" | undefined;
    content: string;
    open: boolean;
    setOpen: (arg: any) => any
}

export const InfoPopupRedux: FC<IProps> = ({ severity, content, open, setOpen }) => {
    const dispatch = useAppDispatch();
    return <InfoPopup severity={severity} content={content} open={open}
        setOpen={(value) => dispatch(setOpen(value))} />
};