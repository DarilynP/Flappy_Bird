const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function addTask() {
  const task = inputBox.value.trim(); // Corrected to 'value'
  if (!task) {
    alert("Please write down a task");
    return;
  }

  const li = document.createElement("li"); // Create a new list item
  li.innerHTML = `
        <label>
            <input type="checkbox">
            <span>${task}</span>
        </label>
        <span class="edit-btn">Edit</span>
        <span class="delete-btn">Delete</span>
    `;

  listContainer.appendChild(li); // Append the new item to the list
  inputBox.value = ""; // Clear the input box
  updateCounters(); // Update counters after adding a new task

  const checkbox = li.querySelector("input[type='checkbox']"); // Get checkbox after li creation
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("span");
  const deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked); // Toggle completed class
    updateCounters(); // Update counters when checkbox is clicked
  });

  editBtn.addEventListener("click", function () {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update; // Update the task text
      checkbox.checked = false; // Reset checkbox
      li.classList.remove("completed"); // Remove completed class
      updateCounters(); // Update counters after editing
    }
  });

  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove(); // Remove the task item from the list
      updateCounters(); // Update counters after deletion
    }
  });
}

// Function to update completed and uncompleted counters
function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks = listContainer.children.length - completedTasks;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

// Event listener for the add button
document.getElementById("input-button").addEventListener("click", addTask);

// Allow Enter key to trigger add task
inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask(); // Call addTask function on Enter key
  }
});
