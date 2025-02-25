import React, { useState, useEffect } from 'react';
import Card from './Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './App.css';

let API_key = "&api_key=db95773a7fb212ba790d71f6adac0e7e";
let base_url = "https://api.themoviedb.org/3";
let url = base_url + "/discover/movie?sort_by=popularity.desc" + API_key;

const Main = () => {
    const [movieData, setData] = useState([]);
    const [url_set, setUrl] = useState(url);
    const [search, setSearch] = useState("");
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [newMovie, setNewMovie] = useState({ title: '', image: '', rating: '', description: '' });
    const [customMovies, setCustomMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation'];
    const ratings = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars', '6 stars', '7 stars', '8 stars', '9 stars', '10 stars'];

    useEffect(() => {
        fetch(url_set).then(res => res.json()).then(data => {
            setData(data.results);
        });
    }, [url_set]);

    const getDataByGenre = (genre) => {
        let genre_id;
        switch (genre) {
            case 'Action': genre_id = 28; break;
            case 'Comedy': genre_id = 35; break;
            case 'Drama': genre_id = 18; break;
            case 'Horror': genre_id = 27; break;
            case 'Romance': genre_id = 10749; break;
            case 'Sci-Fi': genre_id = 878; break;
            case 'Thriller': genre_id = 53; break;
            case 'Documentary': genre_id = 99; break;
            case 'Animation': genre_id = 16; break;
            default: genre_id = null;
        }
        if (genre_id) {
            url = `${base_url}/discover/movie?with_genres=${genre_id}${API_key}`;
            setUrl(url);
        }
    };

    const getDataByRating = (rating) => {
        const vote_average = rating.split(" ")[0];
        url = `${base_url}/discover/movie?vote_average.gte=${vote_average}&vote_average.lte=${vote_average}${API_key}`;
        setUrl(url);
    };

    const searchMovie = (evt) => {
        if (evt.key === "Enter") {
            url = base_url + "/search/movie?api_key=db95773a7fb212ba790d71f6adac0e7e&query=" + search;
            setUrl(url);
            setSearch("");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMovie({ ...newMovie, [name]: value });
    };

    const addMovie = () => {
        const { title, image, rating, description } = newMovie;
        const ratingNumber = Number(rating);
        
        if (!title || !image || !rating || !description) {
            setErrorMessage("All fields must be filled out.");
            return;
        }
        
        if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 10) {
            setErrorMessage("Rating must be a number between 1 and 10.");
            return;
        }

        setCustomMovies([...customMovies, newMovie]);
        setNewMovie({ title: '', image: '', rating: '', description: '' });
        setErrorMessage("");
    };

    return (
        <>
            <div className="navbar">
                <div className="nav-left">
                    <a href="/" className="home-link">Home Page</a>
                </div>
                <div className="nav-center">
                    <button className="nav-link" onClick={() => setIsGenreOpen(!isGenreOpen)}>Genres</button>
                    {isGenreOpen && (
                        <div className="dropdown-menu show">
                            {genres.map((genre, index) => (
                                <div key={index} className="dropdown-item" onClick={() => getDataByGenre(genre)}>{genre}</div>
                            ))}
                        </div>
                    )}
                    <button className="nav-link" onClick={() => setIsRatingOpen(!isRatingOpen)}>Rating</button>
                    {isRatingOpen && (
                        <div className="dropdown-menu show">
                            {ratings.map((rating, index) => (
                                <div key={index} className="dropdown-item" onClick={() => getDataByRating(rating)}>{rating}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="nav-right">
                    <div className="search">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="search__input" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            onKeyPress={searchMovie} 
                        />
                    </div>
                </div>
            </div>
            <div className="main-container">
                <Container>
                    <Row className="justify-content-md-center">
                        {movieData.length === 0 ? <p>Not Found</p> : movieData.map((res, pos) => <Card key={pos} movie={res} />)}
                        {customMovies.map((movie, index) => (
                            <Card key={index} movie={{ title: movie.title, poster_path: movie.image, vote_average: movie.rating, overview: movie.description }} />
                        ))}
                    </Row>
                </Container>
            </div>
            <div className="add-movie-container">
                <h2>Add a Movie</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <input className="add" type="text" name="title" placeholder="Title" value={newMovie.title} onChange={handleInputChange} /> <br/>
                <input className="add" type="text" name="image" placeholder="Image URL" value={newMovie.image} onChange={handleInputChange} /><br/>
                <input className="add" type="number" name="rating" placeholder="Rating (1-10)" value={newMovie.rating} onChange={handleInputChange} /><br/>
                <textarea className="add" name="description" placeholder="Description" value={newMovie.description} onChange={handleInputChange}></textarea> <br/>
                <button className="card-button" onClick={addMovie}>Add Movie</button>
            </div>
        </>
    );
};

export default Main;
