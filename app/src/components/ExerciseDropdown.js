import React from 'react';

function ExerciseDropdown({ exerciseList, selectedExercise, onSelectExercise }) {
  // Check if exerciseList is an array before calling .map()
  if (!Array.isArray(exerciseList)) {
    // Handle the case where exerciseList is not an array
    return <div>No exercises available</div>;
  }

  return (
    <div>
      <select
        value={selectedExercise ? selectedExercise._id : ''}
        onChange={(e) => {
          const selectedId = e.target.value;
          console.log(selectedId)
          const exercise = exerciseList.find((ex) => ex._id === selectedId);
          console.log('Selected exercise:', exercise);
          onSelectExercise(exercise);
        }}
      >
        <option value="">Select an exercise</option>
        {exerciseList.map((exercise) => (
          <option key={exercise._id} value={exercise._id}>
            {exercise.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ExerciseDropdown;




