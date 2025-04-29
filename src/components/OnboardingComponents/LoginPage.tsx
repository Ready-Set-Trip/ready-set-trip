//login page here.
//signup button if no login info yet
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './LoginPage.css';
import email_icon from '../../assets/email.png';
import password_icon from '../../assets/password.png';

import { ValidateForm } from './LoginValidation';

import UserContext from '../UserContext'; 
import { useContext } from 'react'; 

const LoginPage = () => {
  
  const [user, setUser] = useContext(UserContext)
  //set up first initial state of our login form,
  // whenever client enter data, we will set the changed state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  //also setError, either email or password should be string according to typescript
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();
  //we will handle data input by client,
  // should be ChangeEvent cox we will call onChange event down
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    //set the change data, layout previous state by ... prev, name should be the value
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  //whenever we press login button, will be handle the submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = ValidateForm(loginData);
    //first we will set the error by using ValidateForm function
    setErrors(err);
    //if there is no error, we will post request to backend api
    if (!err.email && !err.password) {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        if (!response.ok) {
          const message = `Error: ${response.status}`;
          throw new Error(message);
        }
        const data = await response.json();
        setUser({ name: loginData.email, email: loginData.email }); 
        navigate('/CreateJoinTrip');
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='logcontainer'>
        <form action='' onSubmit={handleSubmit}>
          <div className='logheader'>
            <div className='text'>Log In</div>
            <div className='underline'></div>
          </div>

          <div className='loginput-field'>
            <div className='input'>
              <img src={email_icon} alt='emailIcon' />
              <input
                type='email'
                name='email'
                id='email'
                placeholder='Email'
                onChange={handleInput}
              />
              {errors.email && (
                <span className='errordanger'>{errors.email}</span>
              )}
            </div>

            <div className='input'>
              <img src={password_icon} alt='passwordIcon' />
              <input
                type='password'
                name='password'
                id='password'
                placeholder='Password'
                onChange={handleInput}
              />
              {errors.password && (
                <span className='errordanger'>{errors.password}</span>
              )}
            </div>
          </div>
          <div className='forgot-password'>
            Forgot Password?<span>Click Here</span>
          </div>
          <div className='submit-container'>
            <button type='submit' className='submit-button'>
              Log In
            </button>
            <Link to='/signup' className='submit-button'>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
