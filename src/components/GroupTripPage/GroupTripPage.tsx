// main group trip page
// leaderboard &/or group stats with clickable individual user links

// stretch:
// pass down banner w/ top leader(s) & countdown
// message board component pulled in here

//import things you need!
import React, { useState, useEffect } from 'react';
import SoloPage from '../SoloPage/SoloPage';
import MessageBoard from './MessageBoard';
import { useLocation, useNavigate } from 'react-router-dom';

//LATER - figure out how to pass these numbers down and not hardcode ...

type TripGoals = {
  workout: number;
  diet: number;
  language: number;
};

const tripGoals: TripGoals = {
  workout: 20,
  diet: 15,
  language: 10,
};

//helper function for calculating total. also ts for progress.
const calculateTotal = (progress: Progress) => {
  return progress.workout + progress.diet + progress.language;
};

// type definitions

type Progress = {
  workout: number;
  diet: number;
  language: number;
};

type UserProgress = {
  username: string;
  id: string;
  workout: number;
  diet: number;
  language: number;
};

//define page's react componenet
const GroupTripPage: React.FC = () => {
  const navigate = useNavigate();
  // super jank way getting the tripId off of the URL.
  // gets the last 5 characters of the URL string. sets to null if the URL is only /GroupTripPage/
  const trailingUrl = useLocation().pathname;
  const tripId = trailingUrl.length > 15 ? trailingUrl.slice(-5) : null;

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [groupProgress, setGroupProgress] = useState<UserProgress[]>([]);

  // const [groupStats, setGroupStats] = useState(null);

  useEffect(() => {
    if (!tripId) {
      alert('No Trip Id!');
      navigate('/');
      return;
    }
    const fetchGroupStats = async () => {
      try {
        const res = await fetch(`http://localhost:3000/trips/groupStats/${tripId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch group stats');
        }
        const data = await res.json();
        console.log('res:', res);
        console.log('data:', data);

        const adjustProgress = data.usersAndTrackers.map((user: any) => ({
          username: user.name,
          id: user.id,
          workout: user.workout_count,
          diet: user.diet_count,
          language: user.language_count,
        }));
        setGroupProgress(adjustProgress);
        console.log('adjustProgress', adjustProgress);
        // setGroupStats(data);
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    fetchGroupStats();
  }, [tripId, navigate]);

  // handles progress for a specific user.
  // if a username matches the username passed in, we update their progress
  // otherwise ... keep the user the same (don't update anything)

  const handleProgressUpdate = async (userId: string, habitObj: { [key: string]: number }, updatedValue: number) => {
    // why is the only thing console.logging habitObj?
    console.log('hi');
    console.log('userId', userId);
    console.log('habitObj: ', habitObj); // why does only this one work???
    console.log('habit obj keys', Object.keys(habitObj));
    let habit: string = '';
    if (habitObj.workout === 1) habit = 'workout';
    else if (habitObj.diet === 1) habit = 'diet';
    else if (habitObj.language === 1) habit = 'language';
    console.log('habit', habit);

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/${habit}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedValue }),
      });

      if (!res.ok) {
        throw new Error('Failed to update progress on backend');
      }

      const data = await res.json(); // your backend returns { countAfterIncrement: newCount }
      console.log('PATCH response:', data);

      setGroupProgress((prevProgress) =>
        prevProgress.map((user) =>
          user.id === userId
            ? {
                ...user,
                [habit]: data.countAfterIncrement,
              }
            : user
        )
      );
    } catch (err) {
      console.log('Error updating progress', err);
    }
  };

  // sort the leaderboard (for each user, calc the total progress and sort from high to low)
  // groupProgress is unsorted list of Users. [...] makes a copy - don't mutate original.
  // calculateTotal(b.progress) - calculateTotal(a.progress) --> means if b's total is bigger that a's... etc.
  const sortedProgress = [...groupProgress].sort((a, b) => {
    return (
      calculateTotal({
        workout: b.workout,
        diet: b.diet,
        language: b.language,
      }) -
      calculateTotal({
        workout: a.workout,
        diet: a.diet,
        language: a.language,
      })
    );
  });

  // render section. note tenary operator -- saying if user is null, display first set. else ... display the user selected
  return (
    <div style={{ padding: '20px' }}>
      {!selectedUser ? (
        <>
          <h2>Trip Name: </h2>
          <h3>Trip Id: {tripId}</h3>
          <h3>Trip Goals:</h3>
          <ul>
            Workout: {tripGoals.workout} sessions <strong>|</strong> Diet:{' '}
            {tripGoals.diet} days of healthy eating <strong>|</strong> Language:{' '}
            {tripGoals.language} lessons
          </ul>

          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ flex: 1 }}>
              <h2>Leaderboard</h2>
              {sortedProgress.map((user, index) => (
                //react requires key for el's in a loop, so used user.username as key
                <div key={user.username}>
                  <button
                    onClick={() => setSelectedUser(user.username)}
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      padding: '10px',
                      backgroundColor:
                        index === 0
                          ? '#ffd700'
                          : index === 1
                          ? '#f2e8e8'
                          : index === 2
                          ? '#cd7f32'
                          : '#f0f0f0',
                      borderRadius: '8px',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    #{index + 1} - {user.username} - Total:{' '}
                    {calculateTotal({
                      workout: user.workout,
                      diet: user.diet,
                      language: user.language,
                    })}
                  </button>
                  <ul>
                    <li>
                      Workout: {user.workout} / {tripGoals.workout}
                    </li>
                    <li>
                      Diet: {user.diet} / {tripGoals.diet}
                    </li>
                    <li>
                      Language: {user.language} / {tripGoals.language}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <h2>Message Board</h2>
              <MessageBoard />
            </div>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedUser(null)}>
            Back to Group Page
          </button>
          <SoloPage
            username={
              groupProgress.find((user) => user.id === selectedUser)
                ?.username || ''
            }
            progress={{
              workout:
                groupProgress.find((user) => user.id === selectedUser)
                  ?.workout || 0,
              diet:
                groupProgress.find((user) => user.id === selectedUser)
                  ?.diet || 0,
              language:
                groupProgress.find((user) => user.id === selectedUser)
                  ?.language || 0,
            }}
            tripGoals={{
              workout: tripGoals.workout,
              diet: tripGoals.diet,
              language: tripGoals.language,
            }}
            onProgressUpdate={(habit: keyof ProgressState,) =>
              handleProgressUpdate(selectedUser!, habit)
            }
          />
        </>
      )}
    </div>
  );
};

export default GroupTripPage;
