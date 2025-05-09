import React from 'react';
import {
    Grid as MuiGrid,
    Select as MuiSelect,
    FormControl as MuiFormControl,
    InputLabel as MuiInputLabel,
    MenuItem as MuiMenuItem,
    TextField as MuiTextField,
    Collapse as MuiCollapse,
} from '@mui/material';

// Componentes personalizados que aceptan cualquier prop
export const Grid = (props: any) => <MuiGrid {...props} />;
export const Select = (props: any) => <MuiSelect {...props} />;
export const FormControl = (props: any) => <MuiFormControl {...props} />;
export const InputLabel = (props: any) => <MuiInputLabel {...props} />;
export const MenuItem = (props: any) => <MuiMenuItem {...props} />;
export const TextField = (props: any) => <MuiTextField {...props} />;
export const Collapse = (props: any) => <MuiCollapse {...props} />;