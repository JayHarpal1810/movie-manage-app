import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteMovie } from '../actions';
import { useDispatch } from 'react-redux';

const ConfirmDailog = ({ open, setOpen, id }) => {
    const dispatch = useDispatch();


    const handleDelete = () => {
        dispatch(deleteMovie(id));
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>

            <DialogTitle sx={{ pb: 2 }}>Delete</DialogTitle>
            <DialogContent sx={{ typography: 'body2' }}> Are you sure want to delete? </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDailog;
