import React, { useEffect, useState } from 'react';
import { InfoPopupRedux, PlaylistsList } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { songsActions } from "../../redux";
import { CreateCollectionModal } from "../../components/CreateCollectionModal/CreateCollectionModal";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export const LibraryPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { collections, responseMessage, songDetails } = useAppSelector(s => s.songsReducer);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!collections.length) dispatch(songsActions.getMyCollections());
    }, [dispatch, collections.length]);


    return (
        <div style={{ position: 'relative' }}>
            <PlaylistsList collections={collections} vertical={true} xs={3} />
            <IconButton onClick={() => setOpenModal(true)}
                sx={{
                    position: 'fixed',
                    bottom: !!songDetails ? '10%' : '5%',
                    right: '5%'
                }}>
                <AddCircleIcon sx={{ fontSize: '3rem' }} color={'primary'} />
            </IconButton>
            <CreateCollectionModal open={openModal} setOpen={setOpenModal} />
            {responseMessage &&
                <InfoPopupRedux severity={'success'} content={responseMessage} open={!!responseMessage}
                    setOpen={songsActions.setResponseMessage} />}
        </div>
    );
};