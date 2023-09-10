import React, { useState } from 'react';

const Exercises = ({ updateExerciseList, token }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if exerciseName is empty
    if (!exerciseName) {
      setMessage('Exercise name cannot be empty');
      return;
    }

    try {
      // Send a request to insert the exercise into MongoDB with the token
      const response = await fetch('http://localhost:5050/record/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify({ name: exerciseName }),
      });

      if (response.ok) {
        const newExercise = await response.json(); 
        updateExerciseList(newExercise);
        setExerciseName('');
        setMessage('Exercise added successfully');
        //console.log("Successfully added exercise")
      } else if (response.status === 409) {
        setMessage('Exercise already exists');
      } else {
        setMessage('An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Exercises</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter exercise name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
        <button type="submit">Add Exercise</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Exercises;
