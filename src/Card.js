import React from 'react';
import Col from 'react-bootstrap/Col';
import './App.css';
import { useNavigate } from 'react-router-dom';

const Card = ({ movie }) => {
    const genres = movie && movie.genre_ids ? movie.genre_ids.join(', ') : "No genres available";
    const navigate = useNavigate();

    const handleExploreMore = () => {
        navigate(`/details/${movie?.id}`);
    };

    return (
        <Col md="4" className="d-flex justify-content-center mb-4">
            <div className="card">
                <div className="front-page" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie?.poster_path})` }}>
                    <div className="card-info">
                        <div className="card-rating">
                        </div>
                    </div>
                </div>
                <div className="back-page">
                    <div className="card-content">
                        <span>{movie?.vote_average} ★</span>
                        <span>{genres}</span>
                        <h3>{movie?.title}</h3>
                        <p className="card-description">{movie?.overview}</p>
                        <button className="card-button" onClick={handleExploreMore}>Explore More</button>
                    </div>
                </div>
            </div>
        </Col>
    );
};

export default Card;