//main solo page component (pull other trackers in here)
// stretch:
// also include banner (pull in from props)

import React from 'react';
import WorkoutTracker from './WorkoutTracker';
import DietTracker from './DietTracker';
import LangTracker from './LangTracker';

// typescript define types of internal state
interface ProgressState {
  workout_count: number;
  diet_count: number;
  language_count: number;
}
//typescript define props SoloPage is expecting
interface SoloPageProps {
  username: string;
  progress: ProgressState;
  tripGoals: { workout_count: number; diet_count: number; language_count: number };
  // prop function takes one arg progress -- iwhic is a ProgressState object, and returns nothign
  onProgressUpdate: (progress: ProgressState) => void;
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
    const updatedValue = {
      ...progress,
      [key]: Math.min(progress[key] + 1, tripGoals[key]),
    };
    onProgressUpdate(updatedValue); // Pass updated progress back to GroupTripPage
  };

  // renders the page ... progess.workout for example is the value currently in useState of Progress for "workout"
  return (
    <div style={{ textAlign: 'center' }}>
      <h2> {username}'s Current Status</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <WorkoutTracker
          //passes 3 props to tracker
          value={progress.workout_count}
          goal={tripGoals.workout_count}
          onIncrement={() => handleIncrement('workout_count')}
        />
        <DietTracker
          value={progress.diet_count}
          goal={tripGoals.diet_count}
          onIncrement={() => handleIncrement('diet_count')}
        />
        <LangTracker
          value={progress.language_count}
          goal={tripGoals.language_count}
          onIncrement={() => handleIncrement('language_count')}
        />
      </div>
    </div>
  );
};

export default SoloPage;
