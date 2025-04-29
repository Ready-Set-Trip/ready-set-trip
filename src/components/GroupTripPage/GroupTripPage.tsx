// main group trip page
// leaderboard &/or group stats with clickable individual user links

// stretch:
// pass down banner w/ top leader(s) & countdown
// message board component pulled in here

//import things you need!
import React, { useState } from 'react';
import SoloPage from '../SoloPage/SoloPage';
import MessageBoard from './MessageBoard';
import { useLocation } from 'react-router-dom';

//LATER - figure out how to pass these numbers down and not hardcode ...

const tripGoals = {
  workout: 20,
  diet: 15,
  language: 10,
};

//helper function for calculating total. also ts for progress.
const calculateTotal = (progress: {
  workout: number;
  diet: number;
  language: number;
}) => {
  return progress.workout + progress.diet + progress.language;
};

//define page's react componenet
const GroupTripPage: React.FC = () => {
  //useState for each user (keep track of which user is currentyl selected ... initialized to null (no user!))
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const location = useLocation();
  const tripId = location.state?.tripId;

  //useState for any incremental progress for each user, in each of the 3 catgegories
  const [groupProgress, setGroupProgress] = useState([
    { username: 'Sandar', progress: { workout: 0, diet: 0, language: 0 } },
    { username: 'Will', progress: { workout: 0, diet: 0, language: 0 } },
    { username: 'Pete', progress: { workout: 0, diet: 0, language: 0 } },
  ]);

  // handles progress for a specific user.
  // if a username matches the username passed in, we update their progress
  // otherwise ... keep the user the same (don't update anything)

  const handleProgressUpdate = (username: string, updatedProgress: any) => {
    setGroupProgress((prevProgress) =>
      prevProgress.map((user) =>
        user.username === username
          ? { ...user, progress: updatedProgress }
          : user
      )
    );
  };

  // sort the leaderboard (for each user, calc the total progress and sort from high to low)
  // groupProgress is unsorted list of Users. [...] makes a copy - don't mutate original.
  // calculateTotal(b.progress) - calculateTotal(a.progress) --> means if b's total is bigger that a's... etc.
  const sortedProgress = [...groupProgress].sort((a, b) => {
    return calculateTotal(b.progress) - calculateTotal(a.progress);
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
                    {calculateTotal(user.progress)}
                  </button>
                  <ul>
                    <li>
                      Workout: {user.progress.workout} / {tripGoals.workout}
                    </li>
                    <li>
                      Diet: {user.progress.diet} / {tripGoals.diet}
                    </li>
                    <li>
                      Language: {user.progress.language} / {tripGoals.language}
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
            //giving props username, progress, tripGoals, onProgressUpdate to child component
            // ".?" --> if find() works, then .progress (display progress) ... ELSE display initial state
            username={selectedUser}
            progress={
              groupProgress.find((user) => user.username === selectedUser)
                ?.progress || { workout: 0, diet: 0, language: 0 }
            }
            // selectedUser! --> ! is typescript telling SoloPage that selectedUser is not null. Tells React not to freak out.
            // only way we'd get to this component anyway is if a user were selected by button.
            tripGoals={tripGoals}
            onProgressUpdate={(updatedProgress) =>
              handleProgressUpdate(selectedUser!, updatedProgress)
            }
          />
        </>
      )}
    </div>
  );
};

export default GroupTripPage;
