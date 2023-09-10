import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import ExerciseDropdown from './ExerciseDropdown';
import ExerciseForm from './Exercises.js';
import WorkoutComponent from './WorkoutComponent.js';
import ExerciseCheckboxList from './ExerciseCheckboxList';
import ReactDOM from 'react-dom';


export default function Dashboard({ token, setToken }) {
    const [exerciseList, setExerciseList] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const navigate = useNavigate();
  
    // Function to update exercise list
    const updateExerciseList = (newExercise) => {
      setExerciseList([...exerciseList, newExercise]);
    };
  
    useEffect(() => {
      // Fetch the initial exercise list when the component mounts
      fetch("http://localhost:5050/record/exercises", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log('Fetched exercise data:', data);
          setExerciseList(data);
        })
        .catch((error) => {
          console.error('Error fetching exercises:', error);
        });
    }, [token]); // Add token as a dependency
  
    // Function to handle deleting an exercise
    const handleDeleteExercise = async () => {
      if (selectedExercise) {
        try {
          // Make a DELETE request to your server to delete the selected exercise
          const response = await fetch(`http://localhost:5050/record/exercises/${selectedExercise._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the headers
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            // Update the exercise list to remove the deleted exercise
            const updatedList = exerciseList.filter((exercise) => exercise._id !== selectedExercise._id);
            setExerciseList(updatedList);
            setSelectedExercise(null);
          } else {
            console.error('Failed to delete exercise:', response.statusText);
          }
        } catch (error) {
          console.error('Error deleting exercise:', error);
        }
      }
    };
  
    // Function to handle starting a workout
    const startWorkout = () => {
      // Implement the logic to start the selected workout here
      if (selectedWorkout) {
        // Render the selected workout's exercises with checkboxes
        ReactDOM.render(
          <ExerciseCheckboxList
            exercises={selectedWorkout.exercises}
            onExerciseChange={(exercise, isChecked) => {
              // Implement your logic to handle exercise selection here
              //console.log(`Exercise "${exercise.name}" is selected: ${isChecked}`);
            }}
          />,
          document.getElementById('exercise-list')
        );
      }
    };
  
    const handleLogout = () => {
      // Remove the token from local storage
      localStorage.removeItem('token');
      setToken("");
  
      // Redirect the user to the login page
      navigate('/login');
    };
  
    return (
      <div>
        <h2>Dashboard</h2>
        <ExerciseForm updateExerciseList={updateExerciseList} token={token} />
  
        {/* Render the ExerciseDropdown component */}
        <ExerciseDropdown
            exerciseList={exerciseList}
            selectedExercise={selectedExercise}
            onSelectExercise={setSelectedExercise}
            />

        <button onClick={handleDeleteExercise} disabled={!selectedExercise}>
          Delete Selected Exercise
        </button>
  
        <WorkoutComponent exerciseList={exerciseList} onSelectWorkout={setSelectedWorkout} />
  
        <button onClick={startWorkout} disabled={!selectedWorkout}>
          Start Workout
        </button>
  
        <button onClick={handleLogout}>Logout</button>
  
        {/* Container to render exercise list */}
        <div id="exercise-list"></div>
      </div>
    );
  }
  