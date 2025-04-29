// manages the trip template components.
// after all filled in, submit button will create your trip id
// and send it to your friends (via email link) to come to the site and set up their profiles
import React from 'react';
import './template.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const TripTemplate = () => {
  const [tripName, setTripName] = useState('');
  const [emails, setEmails] = useState(['', '', '', '']);
  const [tripId, setTripId] = useState<string | null>(null);

  //we will handle data input by client,
  // should be ChangeEvent cox we will call onChange event down
  const handleTripnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripName(e.target.value);
  };
  const handleEmail = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEmails = [...emails];
    newEmails[index] = e.target.value;
    setEmails(newEmails);
  };
  //whenever we press invite button, will be handle the submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //   console.log('Trip created:', tripName);
    // };
    const payload = {
      tripName,
      emails: emails.filter((email) => email.trim() !== ''),
    };
    try {
      const response = await fetch('http://localhost:3000/trips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = `Error: ${response.status}`;
        throw new Error(message);
      }
      const data = await response.json(); //recieved id from backend
      // console.log('Trip created and here's ur id:', data);
      setTripId(data.tripId);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <div className='nametripcontainer'>
      <form className='form' onSubmit={handleSubmit}>
        <div className='tripname'>
          <label>Name Your Trip</label>
          <input
            className='tripnamebox'
            type='text'
            placeholder='Enter your trip name'
            value={tripName}
            onChange={handleTripnameChange}
            required
          />
        </div>

        {tripId && (
          <div className='tripid'>
            New Trip Created! Your Trip ID is:<strong>{tripId}</strong>
          </div>
        )}
        <div className='invitecontainer'>
          <label> Invite Your Friends</label>
          {emails.map((email, index) => (
            <input
              className='inputbox'
              key={index}
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => handleEmail(index, e)}
            />
          ))}
          <button type='submit' className='invitebutton'>
            Send Invite
          </button>
          <p>After you get the id, please go to Group Page</p>
          <Link
            to='/grouptrippage'
            state={{ tripId: `${tripId}` }}
            className='direct_to_grouppage'
          >
            Group Page
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TripTemplate;
