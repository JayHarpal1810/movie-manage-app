import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addMovieData, fetchAllMovies, updateMovieData } from '../actions';
import { useDispatch } from 'react-redux';

const AddMovieDialog = ({ open, setOpen, editData, movies }) => {
    const dispatch = useDispatch();

    const initialFormData = {
        title: editData ? editData.Title : '',
        genre: editData ? editData.Genre : '',
        year: editData ? editData.Year : '',
        rating: editData ? editData.Rating : ''
    };


    const [formData, setFormData] = useState({ ...initialFormData });

    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({ ...initialFormData });
        setError({});
    }, [editData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        const newErrors = { ...error };

        if (name === 'title') {
            if (!value.trim()) {
                newErrors.title = 'Title is required.';
            } else if (movies.some(movie => movie.Title.toLowerCase() === value.toLowerCase())) {
                newErrors.title = 'Movie name already exists';
            } else {
                delete newErrors.title;
            }
        }

        if (name === 'year') {
            const yearValue = parseInt(value, 10);
            if (!value || isNaN(yearValue) || yearValue < 1990 || yearValue > new Date().getFullYear()) {
                newErrors.year = 'Please enter a valid year between 1900 and the current year.';
            } else {
                delete newErrors.year;
            }
        }

        setError(newErrors);
    };


    const handleClose = () => {
        setOpen(false);
        setFormData({
            title: '',
            genre: '',
            year: '',
            rating: ''
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = Object.keys(error).length === 0;

        if (isValid) {

            const payload = {
                ...formData,
                year: parseInt(formData.year),
                rating: parseInt(formData.rating)
            };

            try {
                if (editData) {
                    const res = await dispatch(updateMovieData(payload, editData?.ID));
                    if (res.ok) {
                        setOpen(false);
                        setFormData({
                            title: '',
                            genre: '',
                            year: '',
                            rate: ''
                        })
                        handleClose();
                    }

                } else {
                    const res = await dispatch(addMovieData(payload));
                    if (res.ok) {
                        setOpen(false);
                        setFormData({
                            title: '',
                            genre: '',
                            year: '',
                            rate: ''
                        })
                        handleClose();
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }

        }

    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{editData ? 'Edit Movie' : 'Add Movie'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!error.title}
                        helperText={error.title}
                    />
                    <TextField
                        margin="dense"
                        id="genre"
                        name="genre"
                        label="Genre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.genre}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="year"
                        name="year"
                        label="Year"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.year}
                        onChange={handleChange}
                        error={!!error.year}
                        helperText={error.year}
                    />
                    <TextField
                        margin="dense"
                        id="rating"
                        name="rating"
                        label="Rating"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.rating}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddMovieDialog;
