import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchDetails from './useFetchDetails';
import useFetch from './useFetch';
import moment from 'moment';
import Divider from './Divider';
import VideoPlay from './VideoPlay';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Rating = () => {
    return (
        <div className="rating-card">
            <div className="text-wrapper">
                <p className="text-primary">Please Rate The Movie Here</p>
                <p className="text-secondary">to help us know your experience with it</p>
            </div>

            <div className="rating-stars-container">
                {[...Array(10)].map((_, i) => (
                    <React.Fragment key={i}>
                        <input value={`star-${i + 1}`} name="star" id={`star-${i + 1}`} type="radio" />
                        <label htmlFor={`star-${i + 1}`} className="star-label">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                                    pathLength="360"
                                ></path>
                            </svg>
                        </label>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

const DetailsPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const imageURL = "https://image.tmdb.org/t/p/w500";
    const { data } = useFetchDetails(`https://api.themoviedb.org/3/movie/${params.id}?api_key=db95773a7fb212ba790d71f6adac0e7e`);
    const { data: castData } = useFetchDetails(`https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=db95773a7fb212ba790d71f6adac0e7e`);
    const { data: similarData } = useFetch(`https://api.themoviedb.org/3/movie/${params.id}/similar?api_key=db95773a7fb212ba790d71f6adac0e7e`);
    const { data: recommendationData } = useFetch(`https://api.themoviedb.org/3/movie/${params.id}/recommendations?api_key=db95773a7fb212ba790d71f6adac0e7e`);
    const [playVideo, setPlayVideo] = useState(false);
    const [playVideoId, setPlayVideoId] = useState("");

    const handlePlayVideo = () => {
        setPlayVideoId(params.id);
        setPlayVideo(true);
    };

    const duration = (data?.runtime / 60)?.toFixed(1)?.split(".");
    const writer = castData?.crew?.filter(el => el?.job === "Writer")?.map(el => el?.name)?.join(", ");

    return (
        <div className="details-page">
            <button className="home-link" onClick={() => navigate('/')}>Back to Home</button>

            <div className='banner'>
                <img
                    src={imageURL + data?.backdrop_path}
                    className='banner-image'
                    alt='Movie backdrop'
                />
                <div className='banner-overlay'></div>
            </div>

            <div className='container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10'>
                <div className='poster-container'>
                    <img
                        src={imageURL + data?.poster_path}
                        className='poster-image'
                        alt='Movie poster'
                    />
                    <button onClick={handlePlayVideo} className='play-button'>Play Now</button>
                </div>

                <div className='details-content'>
                    <h2 className='title'>{data?.title || data?.name}</h2>
                    <p className='tagline'>{data?.tagline}</p>

                    <Divider />

                    <div className='info'>
                        <p>Rating: {Number(data?.vote_average).toFixed(1)}+</p>
                        <span>|</span>
                        <p>Views: {Number(data?.vote_count)}</p>
                        <span>|</span>
                        <p>Duration: {duration[0]}h {duration[1]}m</p>
                    </div>

                    <Divider />

                    <Rating />

                    <Divider />

                    <div className='overview'>
                        <h3>Overview</h3>
                        <p>{data?.overview}</p>
                    </div>

                    <Divider />

                    <div className='additional-info'>
                        <p>Status: {data?.status}</p>
                        <span>|</span>
                        <p>Release Date: {moment(data?.release_date).format("MMMM Do YYYY")}</p>
                        <span>|</span>
                        <p>Revenue: ${Number(data?.revenue).toLocaleString()}</p>
                    </div>

                    <Divider />

                    <div className='crew-info'>
                        <p>Director: {castData?.crew[0]?.name}</p>
                        <Divider />
                        <p>Writer: {writer}</p>
                    </div>

                    <Divider />

                    <h2 className='cast-title'>Cast:</h2>
                    <div className='cast-list'>
                        {castData?.cast?.filter(el => el?.profile_path).map((starCast, index) => (
                            <div key={index} className='cast-member'>
                                <img
                                    src={imageURL + starCast?.profile_path}
                                    className='cast-image'
                                    alt='Cast member'
                                />
                                <p className='cast-name'>{starCast?.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Divider />


            {playVideo && (
                <VideoPlay data={playVideoId} close={() => setPlayVideo(false)} media_type="movie" />
            )}
        </div>
    )
}

export default DetailsPage;