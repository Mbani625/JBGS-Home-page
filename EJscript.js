document.addEventListener("DOMContentLoaded", () => {
  initializeWorkoutBox(document.querySelector(".workout-box"));

  // Attach event listener to Add New Workout button
  document
    .getElementById("add-new-workout")
    .addEventListener("click", addNewWorkoutBox);
});

// Function to initialize event listeners for a workout box
function initializeWorkoutBox(workoutBox) {
  const generateSetsButton = workoutBox.querySelector(".generate-sets");
  const saveWorkoutButton = workoutBox.querySelector(".save-workout");
  const dateInput = workoutBox.querySelector(".date");

  // Set today's date as the default value for the date input
  dateInput.value = new Date().toISOString().slice(0, 10);

  // Attach event listeners
  generateSetsButton.addEventListener("click", function () {
    generateSetRows(workoutBox);
  });

  saveWorkoutButton.addEventListener("click", function () {
    // Check if the save button is visible and enabled before saving
    if (!saveWorkoutButton.classList.contains("hidden")) {
      saveWorkout(workoutBox);
    }
  });
}

// Function to generate set rows in a specific workout box
function generateSetRows(workoutBox) {
  const setTableBody = workoutBox.querySelector(".set-table-body");
  const setDetailsAndNotes = workoutBox.querySelector(".set-details-and-notes");
  const saveWorkoutButton = workoutBox.querySelector(".save-workout");
  const numSets = parseInt(workoutBox.querySelector(".sets").value) || 1;

  // Show the Set Details, Notes section, and Save Workout button
  setDetailsAndNotes.classList.remove("hidden");
  saveWorkoutButton.classList.remove("hidden"); // Make Save Workout button visible and active
  setTableBody.innerHTML = ""; // Clear any previous rows

  // Generate rows for each set
  for (let i = 1; i <= numSets; i++) {
    const row = document.createElement("tr");

    const setCell = document.createElement("td");
    setCell.textContent = i;
    row.appendChild(setCell);

    const repsCell = document.createElement("td");
    const repsSelect = document.createElement("select");
    repsSelect.classList.add("set-reps");
    for (let j = 1; j <= 30; j++) {
      const option = document.createElement("option");
      option.value = j;
      option.textContent = j;
      repsSelect.appendChild(option);
    }
    repsCell.appendChild(repsSelect);
    row.appendChild(repsCell);

    const weightCell = document.createElement("td");
    const weightSelect = document.createElement("select");
    weightSelect.classList.add("set-weight");
    for (let w = 5; w <= 1000; w += 5) {
      const option = document.createElement("option");
      option.value = w;
      option.textContent = w + " lbs";
      weightSelect.appendChild(option);
    }
    weightCell.appendChild(weightSelect);
    row.appendChild(weightCell);

    const spiceCell = document.createElement("td");
    const spiceInput = document.createElement("input");
    spiceInput.type = "text";
    spiceInput.classList.add("set-spice");
    spiceInput.placeholder = "Optional";
    spiceCell.appendChild(spiceInput);
    row.appendChild(spiceCell);

    setTableBody.appendChild(row);
  }
}

// Function to add a new workout box
function addNewWorkoutBox() {
  const workoutsContainer = document.getElementById("workouts-container");
  const newWorkoutBox = document.querySelector(".workout-box").cloneNode(true);

  // Reset placeholders and date for cloned workout box
  newWorkoutBox.querySelector(".date").value = new Date()
    .toISOString()
    .slice(0, 10);
  newWorkoutBox.querySelector(".body-part").selectedIndex = 0;
  newWorkoutBox.querySelector(".exercise").selectedIndex = 0;
  newWorkoutBox.querySelector(".variation").selectedIndex = 0;
  newWorkoutBox.querySelector(".sets").value = "1";
  newWorkoutBox.querySelector(".notes").value = "";

  // Hide the Save Workout button and Set Details section in the new box
  newWorkoutBox.querySelector(".save-workout").classList.add("hidden");
  newWorkoutBox.querySelector(".set-details-and-notes").classList.add("hidden");

  // Initialize event listeners for the new workout box
  initializeWorkoutBox(newWorkoutBox);

  workoutsContainer.appendChild(newWorkoutBox);
}

// Function to save a workout from a specific workout box to local storage
function saveWorkout(workoutBox) {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  const bodyPart = workoutBox.querySelector(".body-part").value;
  const exercise = workoutBox.querySelector(".exercise").value;
  const variation = workoutBox.querySelector(".variation").value;
  const sets = workoutBox.querySelector(".sets").value;
  const date = workoutBox.querySelector(".date").value;
  const notes = workoutBox.querySelector(".notes").value;

  // Gather set details
  const setRows = workoutBox.querySelectorAll(".set-table-body tr");
  const setDetails = Array.from(setRows).map((row) => {
    const repsSelect = row.querySelector(".set-reps");
    const weightSelect = row.querySelector(".set-weight");
    const spiceInput = row.querySelector(".set-spice");

    return {
      reps: repsSelect ? repsSelect.value : "N/A",
      weight: weightSelect ? weightSelect.value : "N/A",
      spice: spiceInput ? spiceInput.value : "N/A",
    };
  });

  // Construct workout object
  const workout = {
    bodyPart,
    exercise,
    variation,
    sets,
    date,
    notes,
    setDetails,
  };

  // Avoid duplication by checking if workout already exists
  const isDuplicate = workouts.some((existingWorkout) => {
    return (
      existingWorkout.date === workout.date &&
      existingWorkout.bodyPart === workout.bodyPart &&
      existingWorkout.exercise === workout.exercise &&
      JSON.stringify(existingWorkout.setDetails) ===
        JSON.stringify(workout.setDetails)
    );
  });

  if (isDuplicate) {
    alert("This workout has already been saved.");
    return;
  }

  // Add the new workout if it's not a duplicate
  workouts.push(workout);
  localStorage.setItem("workouts", JSON.stringify(workouts));

  alert("Workout saved!");
}
