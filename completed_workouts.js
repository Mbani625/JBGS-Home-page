document.addEventListener("DOMContentLoaded", () => {
  displayCompletedWorkouts();

  // Attach event listener to Clear Exercises button
  document
    .getElementById("clear-exercises")
    .addEventListener("click", clearExercises);

  // Event listeners for export functionality
  const exportButton = document.getElementById("export-button");
  const exportModal = document.getElementById("export-modal");
  const closeModalButton = document.getElementById("close-modal");
  const exportEmailButton = document.getElementById("export-email");
  const exportDriveButton = document.getElementById("export-drive");
  const exportExcelButton = document.getElementById("export-excel");

  // Show the modal when "Export" button is clicked
  exportButton.addEventListener("click", () => {
    exportModal.classList.add("active");
  });

  // Close the modal when "Close" button is clicked
  closeModalButton.addEventListener("click", () => {
    exportModal.classList.remove("active");
  });

  //exportEmailButton.addEventListener("click", exportToEmail);
  //exportDriveButton.addEventListener("click", exportToDrive);
  exportExcelButton.addEventListener("click", exportToExcel);
});

// Function to export workouts based on device type
function exportToExcel() {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  if (workouts.length === 0) {
    alert("No workouts to export.");
    return;
  }

  // Check if the device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Export as text file for mobile
    exportToTextFile(workouts);
  } else {
    // Export as Excel for desktop
    exportToExcelFile(workouts);
  }
}

// Function to export workouts to an Excel file (for desktops)
function exportToExcelFile(workouts) {
  try {
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    const worksheetData = [];

    // Add headers
    worksheetData.push([
      "Date",
      "Body Part",
      "Exercise",
      "Variation",
      "Sets",
      "Notes",
      "Set #",
      "Reps",
      "Weight",
      "Spice",
    ]);

    // Populate rows with workout data
    workouts.forEach((workout) => {
      workout.setDetails.forEach((set, setIndex) => {
        worksheetData.push([
          workout.date,
          workout.bodyPart,
          workout.exercise,
          workout.variation,
          workout.sets,
          workout.notes,
          setIndex + 1,
          set.reps,
          set.weight,
          set.spice || "N/A",
        ]);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Convert data to worksheet
    XLSX.utils.book_append_sheet(workbook, worksheet, "Completed Workouts"); // Append worksheet to workbook

    // Export to Excel file
    XLSX.writeFile(workbook, "Completed_Workouts.xlsx");
    console.log("Excel file generated successfully.");
  } catch (error) {
    console.error("Error during Excel export:", error);
    alert(
      "An error occurred while exporting to Excel. Check console for details."
    );
  }
}

// Function to export workouts to a text file (for mobile)
function exportToTextFile(workouts) {
  let textContent = "Completed Workouts:\n\n";

  workouts.forEach((workout, index) => {
    textContent += `Workout ${index + 1}:\n`;
    textContent += `Date: ${workout.date}, Body Part: ${workout.bodyPart}, Exercise: ${workout.exercise}\n`;
    textContent += `Variation: ${workout.variation}, Sets: ${workout.sets}, Notes: ${workout.notes}\n`;
    workout.setDetails.forEach((set, setIndex) => {
      textContent += `  Set ${setIndex + 1}: Reps ${set.reps}, Weight ${
        set.weight
      }, Spice: ${set.spice || "N/A"}\n`;
    });
    textContent += "\n";
  });

  // Create a Blob and initiate download
  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Completed_Workouts.txt";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

// Function to export workouts via email
/*function exportToEmail() {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  if (workouts.length === 0) {
    alert("No workouts to export.");
    return;
  }

  let emailBody = "Your Completed Workouts:\n\n";
  workouts.forEach((workout, index) => {
    emailBody += `Workout ${index + 1}:\n`;
    emailBody += `Date: ${workout.date}, Body Part: ${workout.bodyPart}, Exercise: ${workout.exercise}\n`;
    emailBody += `Variation: ${workout.variation}, Sets: ${workout.sets}, Notes: ${workout.notes}\n`;
    workout.setDetails.forEach((set, setIndex) => {
      emailBody += `  Set ${setIndex + 1}: Reps ${set.reps}, Weight ${
        set.weight
      }, Spice: ${set.spice || "N/A"}\n`;
    });
    emailBody += "\n";
  });

  // Encode the body for the mailto link
  const mailtoLink = `mailto:?subject=My%20Completed%20Workouts&body=${encodeURIComponent(
    emailBody
  )}`;
  window.location.href = mailtoLink;
}

// Placeholder function for exporting to Google Drive
function exportToDrive() {
  alert("Google Drive integration requires further setup.");
}*/

function displayCompletedWorkouts() {
  const workoutList = document.getElementById("workout-list");
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

  if (workouts.length === 0) {
    workoutList.innerHTML = "<p>No workouts added</p>";
    return;
  }

  workouts.forEach((workout, index) => {
    const workoutItem = document.createElement("div");
    workoutItem.classList.add("workout-item");

    // Format and display workout main info
    let workoutText = `
      <strong>Workout ${index + 1}:</strong><br>
      Date: ${workout.date} - Body Part: ${workout.bodyPart}, Exercise: ${
      workout.exercise
    } (${workout.variation})<br>
      Sets: ${workout.sets}, Notes: ${workout.notes}
    `;
    workoutItem.innerHTML = workoutText;

    // Display each set detail on a new line
    workout.setDetails.forEach((set, setIndex) => {
      const setInfo = document.createElement("div");
      setInfo.classList.add("set-info");
      setInfo.innerHTML = `
        Set ${setIndex + 1}: Reps ${set.reps}, Weight ${set.weight}, Spice: ${
        set.spice || "N/A"
      }
      `;
      workoutItem.appendChild(setInfo);
    });

    workoutList.appendChild(workoutItem);
  });
}

// Function to clear all workouts from local storage and reset the display
function clearExercises() {
  localStorage.removeItem("workouts");

  const workoutList = document.getElementById("workout-list");
  workoutList.innerHTML = "<p>No workouts added</p>";
}
