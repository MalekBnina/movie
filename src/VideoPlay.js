import React from 'react';
import { IoClose } from "react-icons/io5";
import useFetchDetails from './useFetchDetails.js';

const VideoPlay = ({ data, close, media_type }) => {
  const { data: videoData } = useFetchDetails(`https://api.themoviedb.org/3/${media_type}/${data}/videos?api_key=db95773a7fb212ba790d71f6adac0e7e`);

  return (
    <div className='video-section'>
      <div className='video-container'>
        <button onClick={close} className='close-button'>
          <IoClose />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoData?.results[0]?.key}`}
          className='video-frame'
          title='Movie Trailer'
        />
      </div>
    </div>
  );
};

export default VideoPlay;