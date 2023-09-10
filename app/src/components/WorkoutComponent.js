import React, { useState, useEffect } from 'react';
import ExerciseDropdown from './ExerciseDropdown';

export default function WorkoutComponent({ exerciseList, onSelectWorkout }) {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newExerciseList, setNewExerciseList] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [selectedExerciseToAdd, setSelectedExerciseToAdd] = useState(null);

  const createWorkout = () => {
    if (newWorkout.trim() === '') return;

    const workout = {
      name: newWorkout,
      exercises: newExerciseList,
    };

    setWorkouts([...workouts, workout]);
    setNewWorkout('');
    setNewExerciseList([]);
    setWorkoutExercises({ ...workoutExercises, [newWorkout]: newExerciseList });
  };

  const selectWorkout = (workout) => {
    setSelectedWorkout(workout);
    onSelectWorkout(workout); // Notify the parent component of the selected workout
  };

  const deleteWorkout = () => {
    if (!selectedWorkout) return;

    const index = workouts.findIndex((workout) => workout === selectedWorkout);

    if (index !== -1) {
      const updatedWorkouts = [...workouts];
      updatedWorkouts.splice(index, 1);
      setWorkouts(updatedWorkouts);
      setSelectedWorkout(null);
    }
  };

  const addExerciseToNewWorkout = (exercise) => {
    setNewExerciseList([...newExerciseList, exercise]);
  };

  const addExerciseToWorkout = (workoutName, exercise) => {
    const updatedExercises = [...workoutExercises[workoutName], exercise];
    setWorkoutExercises({ ...workoutExercises, [workoutName]: updatedExercises });
  };

  const removeExerciseFromList = (exerciseToRemove) => {
    const updatedList = newExerciseList.filter((exercise) => exercise !== exerciseToRemove);
    setNewExerciseList(updatedList);
  };

  return (
    <div>
      <h3>Workouts</h3>
      <div>
        <input
          type="text"
          placeholder="New Workout Name"
          value={newWorkout}
          onChange={(e) => setNewWorkout(e.target.value)}
        />
        <button onClick={createWorkout}>Create</button>
      </div>
      <div>
        <select
          value={selectedWorkout ? selectedWorkout.name : ''}
          onChange={(e) =>
            selectWorkout(workouts.find((workout) => workout.name === e.target.value))
          }
        >
          <option value="" disabled>
            Select a Workout
          </option>
          {workouts.map((workout) => (
            <option key={workout.name} value={workout.name}>
              {workout.name}
            </option>
          ))}
        </select>
        <button onClick={deleteWorkout}>Delete</button>
      </div>
      {selectedWorkout && (
        <div>
          <h4>{selectedWorkout.name} Exercises</h4>
          <ul>
            {workoutExercises[selectedWorkout.name].map((exercise) => (
              <li key={exercise._id}>{exercise.name}</li>
            ))}
          </ul>
        </div>
      )}
      <h3>Add Exercises to New Workout</h3>
      <ExerciseDropdown
        exerciseList={exerciseList}
        selectedExercise={selectedExerciseToAdd}
        onSelectExercise={(exercise) => setSelectedExerciseToAdd(exercise)}
      />
      <button
        onClick={() => {
          if (selectedExerciseToAdd) {
            addExerciseToNewWorkout(selectedExerciseToAdd);
            setSelectedExerciseToAdd(null); // Reset selected exercise
          }
        }}
        disabled={!selectedExerciseToAdd} // Disable the button when no exercise is selected
      >
        Add
      </button>
      <ul>
        {newExerciseList.map((exercise) => (
          <li key={exercise._id}>
            {exercise.name}
            <button onClick={() => removeExerciseFromList(exercise)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

