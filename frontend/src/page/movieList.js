import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMovies, updateMovieData } from '../actions';
import { Box, Button, CardContent, Grid, IconButton, MenuItem, Pagination, Rating, Stack, TextField, Typography } from '@mui/material';
import AddMovieDialog from '../component/addMovieDailog';
import ConfirmDailog from '../component/ConfirmBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const MovieList = () => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movie.movies);

  const [currentPage, setCurrentPage] = useState(1);
  const [openMovie, setOpenMovie] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteID, setDeleteID] = useState(false);
  const [editData, setEditData] = useState(null);

  const [yearFilter, setYearFilter] = useState('All');
  const [titleSearch, setTitleSearch] = useState('');

  const moviesPerPage = 12;

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    dispatch(fetchAllMovies())
  }, [dispatch]);

  const handleRatingChange = async (newRating, movie) => {
    const payload = {
      ...movie,
      Rating: newRating
    };
    try {
      const res = await dispatch(updateMovieData(payload, movie.ID));
    } catch (error) {
      console.error("Error updating movie data:", error);
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setOpenMovie(true);
  };

  const handleConfirmDelete = (id) => {
    setDeleteID(id);
    setOpenConfirm(true);
  };


  const handleYearFilterChange = (e) => {
    setYearFilter(e.target.value);
  };

  const handleTitleSearchChange = (e) => {
    setTitleSearch(e.target.value);
  };

  const clearFilters = () => {
    setYearFilter('All');
    setTitleSearch('');
  };

  const filterMovies = (movie) => {
    const yearMatch = yearFilter === 'All' || movie.Year === parseInt(yearFilter);
    const titleMatch = movie.Title.toLowerCase().includes(titleSearch.toLowerCase());
    return yearMatch && titleMatch;
  };

  const filteredMovies = movies.filter(filterMovies);

  const totalMovies = filteredMovies.length;
  const totalPages = Math.ceil(totalMovies / moviesPerPage);
  const offset = (currentPage - 1) * moviesPerPage;
  const currentMovies = filteredMovies.slice(offset, offset + moviesPerPage);

  return (
    <>
      <Box m={3}>
        <Typography variant="" component="h1" textAlign='center'>Movie List</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent={'space-between'} gap={2} >
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
            <TextField
              select
              label="Filter by Year"
              variant="outlined"
              value={yearFilter}
              onChange={handleYearFilterChange}
            >
              <MenuItem value="All">All Years</MenuItem>
              {[...new Set(movies.map(movie => movie.Year))].map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Search by Title"
              variant="outlined"
              value={titleSearch}
              onChange={handleTitleSearchChange}
            />
             <IconButton
              variant="outlined"
              onClick={clearFilters}
            >
              <FilterAltOffIcon color='info' onClick={clearFilters}/>
            </IconButton>
          </Stack>
          <Button
            variant="contained"
            onClick={() => setOpenMovie(true)}
          >
            Add Movie
          </Button>
        </Stack>

        <Grid container mt={1} spacing={3} >
          {currentMovies && Array.isArray(currentMovies) && currentMovies.length > 0 && currentMovies.map(movie => (
            <Grid item xs={12} sm={2} md={3}>
              <Box boxShadow={3} borderRadius={2} >
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {movie?.Title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {movie?.Genre} - {movie?.Year}
                  </Typography>
                  <Rating
                    name="simple-controlled"
                    value={movie?.Rating}
                    onChange={(event, newValue) => handleRatingChange(newValue, movie)}
                  />

                  <Stack flexDirection='row' mt={2} justifyContent='flex-end' gap={1}>
                    <IconButton color="secondary" onClick={() => handleEdit(movie)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleConfirmDelete(movie?.ID)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Stack spacing={2} mt={3} flexDirection={'row'} alignItems='center' justifyContent='center'>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Box>
      <AddMovieDialog
        open={openMovie}
        setOpen={setOpenMovie}
        editData={editData}
        movies={movies}
      />

      <ConfirmDailog
        open={openConfirm}
        setOpen={setOpenConfirm}
        id={deleteID}
      />
    </>

  );
};

export default MovieList;
