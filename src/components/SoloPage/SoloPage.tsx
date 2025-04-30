//main solo page component (pull other trackers in here)
// stretch:
// also include banner (pull in from props)

import React from 'react';
import WorkoutTracker from './WorkoutTracker';
import DietTracker from './DietTracker';
import LangTracker from './LangTracker';

// typescript define types of internal state
interface ProgressState {
  workout: number;
  diet: number;
  language: number;
}
//typescript define props SoloPage is expecting
interface SoloPageProps {
  username: string;
  progress: ProgressState;
  tripGoals: { workout: number; diet: number; language: number };
  // prop function takes one arg progress -- iwhic is a ProgressState object, and returns nothign
  onProgressUpdate: (habit: keyof ProgressState) => void;
}
// react component page that takes 4 props from GroupTripPage ... handles incrementing each category as needed
const SoloPage: React.FC<SoloPageProps> = ({
  username,
  progress,
  tripGoals,
  onProgressUpdate,
}) => {
  // takes key of ProgressState -> so, must be workout, diet, or language ... updates amount up to goal amount
  const handleIncrement = (key: keyof ProgressState) => {
    console.log('increment key', key); 
    if (progress[key] <= tripGoals[key]) {
       console.log('is less than trip goal', progress[key]); 
      onProgressUpdate(key); // just pass the habit string
    }
  };

  // renders the page ... progess.workout for example is the value currently in useState of Progress for "workout"
  return (
    <div style={{ textAlign: 'center' }}>
      <h2> {username}'s Current Status</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <WorkoutTracker
          //passes 3 props to tracker
          value={progress.workout}
          goal={tripGoals.workout}
          onIncrement={() => handleIncrement('workout')}
        />
        <DietTracker
          value={progress.diet}
          goal={tripGoals.diet}
          onIncrement={() => handleIncrement('diet')}
        />
        <LangTracker
          value={progress.language}
          goal={tripGoals.language}
          onIncrement={() => handleIncrement('language')}
        />
      </div>
    </div>
  );
};

export default SoloPage;
