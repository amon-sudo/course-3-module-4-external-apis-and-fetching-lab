// Select DOM elements
const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");

// Function to fetch weather alerts
function fetchWeatherAlerts(stateAbbr) {
  // Validate input
  if (!stateAbbr || stateAbbr.length !== 2) {
    displayError("Please enter a valid two-letter state abbreviation.");
    return;
  }

  fetch(`https://api.weather.gov/alerts/active?area=${stateAbbr}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => displayAlerts(data))
    .catch(error => displayError(error.message));
}

// Function to display alerts in the DOM
function displayAlerts(data) {
  // Clear previous alerts and errors
  alertsDisplay.innerHTML = "";
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");

  const alertCount = data.features.length;

  // Display summary heading (must match test expectations)
  const summary = document.createElement("h2");
  summary.textContent = `Weather Alerts: ${alertCount}`;
  alertsDisplay.appendChild(summary);

  if (alertCount > 0) {
    const alertList = document.createElement("ul");
    data.features.forEach(alert => {
      const listItem = document.createElement("li");
      listItem.textContent = alert.properties.headline;
      alertList.appendChild(listItem);
    });
    alertsDisplay.appendChild(alertList);
  } else {
    const noAlerts = document.createElement("p");
    noAlerts.textContent = "No active weather alerts at this time.";
    alertsDisplay.appendChild(noAlerts);
  }

  // Clear input field
  stateInput.value = "";
}

// Function to display error messages
function displayError(message) {
  alertsDisplay.innerHTML = "";
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

// Event listener for button click
fetchButton.addEventListener("click", () => {
  const stateAbbr = stateInput.value.trim().toUpperCase();
  fetchWeatherAlerts(stateAbbr);
});
