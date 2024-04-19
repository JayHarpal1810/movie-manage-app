// Action types
export const FETCH_MOVIES_REQUEST = 'FETCH_MOVIES_REQUEST';
export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const FETCH_MOVIES_FAILURE = 'FETCH_MOVIES_FAILURE';


export const fetchMoviesRequest = () => ({
    type: FETCH_MOVIES_REQUEST,
});

export const fetchMoviesSuccess = (movies) => ({
    type: FETCH_MOVIES_SUCCESS,
    payload: movies,
});

export const fetchMoviesFailure = (error) => ({
    type: FETCH_MOVIES_FAILURE,
    payload: error,
});

export const fetchAllMovies = () => {
    return async (dispatch) => {
        dispatch(fetchMoviesRequest());
        try {
            const response = await fetch("http://localhost:9091/movies");
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            dispatch(fetchMoviesSuccess(data));
            return response;
        } catch (error) {
            dispatch(fetchMoviesFailure(error.message));
            return error;
        }
    };
};


export const addMovieData = (newData) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://localhost:9091/movies", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            if (response.ok) {
                dispatch({ type: 'ADD_MOVIE_SUCCESS', payload: newData });
                dispatch(fetchAllMovies());
            } else {
                throw new Error('Error adding new data.');
            }
            return response;
        } catch (error) {
            console.error('Error adding new data:', error);
            throw error;
        }
    }
};


export const updateMovieData = (newData, id) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:9091/movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            if (response.ok) {
                dispatch({ type: 'UPDATE_MOVIE_SUCCESS', payload: newData });
                dispatch(fetchAllMovies());
            } else {
                throw new Error('Error adding new data.');
            }
            return response;
        } catch (error) {
            console.error('Error adding new data:', error);
            throw error;
        }
    }
};

export const deleteMovie = (movieId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:9091/movies/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete movie.');
            }
            dispatch({ type: 'DELETE_MOVIE_SUCCESS', payload: movieId });
            dispatch(fetchAllMovies());
        } catch (error) {
            console.log(error);
            dispatch({ type: 'DELETE_MOVIE_FAILURE', payload: error.message });
        }
    };
};
