import React from 'react'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className='landing-page'>

        <img src='logo.png' alt=''className='logo'/>
        <button className='to-home-btn' onClick={() => navigate('/HomePage')}>Go To Home</button>
        <h2>Your Movie Journey Starts Here 🍿</h2>
        <p>Keep track of every movie you’ve watched, discover hidden gems, and share in the joy of cinema. 
            You can search movies by cast, creators, or genres, compare ratings from popular sources, add 
            your own personal rating, and build your ultimate movie collection.
        </p>

    </div>
  )
}

export default LandingPage