import React, {FC} from 'react';
import {ISongsCollection} from "../../interfaces";
import Grid from "@mui/material/Grid";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import Container from "@mui/material/Container";
import {CollectionCard} from "../CollectionCard/CollectionCard";

interface IProps {
    collections: ISongsCollection[]
    vertical: boolean;
    xs?: number;
}

export const PlaylistsList: FC<IProps> = ({collections, vertical, xs}) => {
    return (

        <Container maxWidth={"lg"} sx={{padding: '32px 8px 0'}}>
            <Grid container>
                {collections.map(c => {
                    const props = {xs: 12}
                    if (vertical) props.xs = xs!;

                    return <Grid item key={generateUniqueID()} {...props}>
                        <CollectionCard collection={c}/>
                    </Grid>
                })}
            </Grid>
        </Container>
    );
};