import React from 'react';

export default function ExerciseCheckboxList({ exercises, onExerciseChange }) {
  return (
    <div>
      {exercises.map((exercise, index) => (
        <div key={index}>
          <label>
            <input
              type="checkbox"
              value={exercise.name}
              onChange={(e) => onExerciseChange(exercise, e.target.checked)}
            />
            {exercise.name}
          </label>
        </div>
      ))}
    </div>
  );
}
