const countryInput = document.getElementById("country");
const cityInput = document.getElementById("location");

const countryOptions = document.getElementById("countryOptions");
const cityOptions = document.getElementById("cityOptions");

let countries = [];
let countriesLoaded = false;

// Run this code only on Create Listing and Edit Listing pages
if (countryInput && cityInput) {
  // Load countries from the backend
  async function loadCountries() {
    // Avoid fetching countries multiple times
    if (countriesLoaded) return;

    try {
      const response = await fetch("/listings/countries");

      if (!response.ok) {
        throw new Error("Unable to load countries.");
      }

      countries = await response.json();

      // Add countries to the dropdown suggestions
      countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.name;
        countryOptions.appendChild(option);
      });

      countriesLoaded = true;
    } catch (error) {
      console.error(error);
    }
  }

  // Load countries when the user clicks the Country field
  countryInput.addEventListener("focus", loadCountries);

  // Load cities for the selected country
  async function loadCities(selectedCountry) {
    cityOptions.innerHTML = "";

    try {
      const response = await fetch(`/listings/cities/${selectedCountry.code}`);

      if (!response.ok) {
        throw new Error("Unable to load cities.");
      }

      const cities = await response.json();

      // Add cities to the dropdown suggestions
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        cityOptions.appendChild(option);
      });

      cityInput.disabled = false;
      cityInput.placeholder = "Search or select city";
    } catch (error) {
      console.error(error);
    }
  }

  // Load cities when the user clicks the City field
  cityInput.addEventListener("focus", async function () {
    await loadCountries();

    const selectedCountry = countries.find(
      (country) =>
        country.name.toLowerCase() === countryInput.value.trim().toLowerCase(),
    );

    // Load cities if they haven't been loaded yet
    if (selectedCountry && cityOptions.children.length === 0) {
      await loadCities(selectedCountry);
    }
  });

  // Handle country selection or changes
  countryInput.addEventListener("change", async function () {
    await loadCountries();

    // Clear the previous city selection
    cityInput.value = "";
    cityOptions.innerHTML = "";
    cityInput.disabled = true;
    cityInput.placeholder = "Select a country first";

    // Find the selected country
    const selectedCountry = countries.find(
      (country) =>
        country.name.toLowerCase() === countryInput.value.trim().toLowerCase(),
    );

    // Stop if the country is not found
    if (!selectedCountry) {
      return;
    }

    // Load cities for the selected country
    await loadCities(selectedCountry);
  });
}
