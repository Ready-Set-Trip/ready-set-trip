// page with "create a trip?" or "have a trip ID already?"
// if trip id, sends to trip page and puts your username in the trip profile board
// if create a trip, send you to trip template

//stretch goal: view old trips? button

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import beach1_icon from '../../assets/beach1.jpg';
import './CreateJoinTrip.css';

const CreateJoinTrip = () => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setError('');
  };
  const handleClick = async () => {
    //check if the id exist or not, if it is exist navigate to grouptrip page
    try {
      const response = await fetch(`/api/validate-id/${id}`);
      const data = await response.json();
      if (response.ok && data.id) {
        navigate(`/GroupTripPage/${id}`);
      } else {
        setError('Invalid Trip ID');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later');
    }
  };
  return (
    <div className='boxcontainer'>
      <div className='background_pic'>
        <img src={beach1_icon} alt='beach_vacation' />
      </div>
      <div className='createboxcontainer'>
        <div className='createbox'>Create a trip?</div>
        <Link to='/TripTemplate' className='clickme'>
          Click Here
        </Link>
      </div>
      <div className='createboxcontainer'>
        <div className='createbox'>Have a trip ID already?</div>
        <input
          className='inputbox'
          type='text'
          value={id}
          onChange={handleChange}
          placeholder='Enter your id'
        />
        <button className='clickmego' onClick={handleClick}>
          Go
        </button>
        {error && <p className='errormsg'>{error}</p>}
      </div>
    </div>
  );
};

export default CreateJoinTrip;
