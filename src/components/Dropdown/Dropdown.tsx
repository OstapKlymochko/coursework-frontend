import { Dispatch, SetStateAction } from 'react';
import { MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from "@mui/material";
import { v4 as uuid } from "uuid";
import { IBasicMenuItem } from "../../interfaces";

interface IProps<TItem extends IBasicMenuItem> {
    title: string;
    menuItems: TItem[];
    selectedItem: string;
    setSelectedItem: Dispatch<SetStateAction<string | null>>;
}

export const Dropdown =
    <TItem extends IBasicMenuItem>({ title, menuItems, setSelectedItem, selectedItem }: IProps<TItem>) => {
        const handleChange = (e: SelectChangeEvent) => {
            setSelectedItem(e.target.value);
        }
        return (
            <div>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">{title}</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={selectedItem!.toString() || ''}
                        onChange={handleChange}
                        label={title}>
                        {!!menuItems.length && menuItems.map(i =>
                            <MenuItem key={uuid()} value={i.value}>{i.label}</MenuItem>)})
                    </Select>
                </FormControl>
            </div>
        );
    };
