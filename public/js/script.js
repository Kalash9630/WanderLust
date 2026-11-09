const imageInput = document.getElementById("image");
const newImagePreview = document.getElementById("newImagePreview");
const previewContainer = document.getElementById("previewContainer");

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

if (imageInput && newImagePreview && previewContainer) {
  imageInput.addEventListener("change", function () {
      let file = this.files[0];

      if (file) {
          newImagePreview.src = URL.createObjectURL(file);
          previewContainer.style.display = "block";
      } else {
          newImagePreview.src = "";
          previewContainer.style.display = "none";
      }
  });
}

// Location dropdown functionality only open and close
const locationDropdown = document.getElementById("locationDropdown");
const locationDropdownMenu = document.getElementById("locationDropdownMenu");
const locationSearch = document.getElementById("locationSearch");

if (locationDropdown && locationDropdownMenu && locationSearch) {

    locationSearch.addEventListener("click", function () {
        locationDropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
        if (!locationDropdown.contains(event.target)) {
            locationDropdownMenu.classList.remove("show");
        }
    });

}

// dropdown to make functional
const locationOptions = document.getElementById("locationOptions");

if (locationOptions && locationSearch) {

    locationOptions.addEventListener("click", function (event) {
        const option = event.target.closest(".location-option");

        if (!option) return;

        locationSearch.value = option.dataset.value;

        locationDropdownMenu.classList.remove("show");
    });

}

// Dynamic location search
const locationOptionSearch = document.getElementById("locationOptionSearch");

if (locationOptionSearch && locationOptions) {

    locationOptionSearch.addEventListener("input", function () {
        const searchValue = this.value.toLowerCase().trim();

        const options = locationOptions.querySelectorAll(".location-option");

        options.forEach(option => {
            const optionText = option.textContent.toLowerCase();

            if (optionText.includes(searchValue)) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        });
    });

}

// Apply listing filters
const applyFilterBtn = document.querySelector(".apply-filter-btn");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", function () {

        const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;
        const location = locationSearch.value;

        const params = new URLSearchParams();

        if (minPrice) {
            params.set("minPrice", minPrice);
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        }

        if (location) {
            params.set("location", location);
        }

        window.location.href = `/listings?${params.toString()}`;
    });
}

// Clear listing filters
const clearFilterBtn = document.querySelector(".clear-filter-btn");

if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", function () {
        window.location.href = "/listings";
    });
}

// Listing price sorting
const sortBy = document.getElementById("sortBy");
const listingsGrid = document.querySelector(".listings-grid");

if (sortBy && listingsGrid) {

    sortBy.addEventListener("change", function () {

        // Get all listing cards
        const cards = Array.from(
            listingsGrid.querySelectorAll(".listing-card")
        );

        const sortValue = this.value;

        // Sort listings from lowest to highest price
        if (sortValue === "price-asc") {
            cards.sort((a, b) => {
                return Number(a.dataset.price) - Number(b.dataset.price);
            });
        }

        // Sort listings from highest to lowest price
        else if (sortValue === "price-desc") {
            cards.sort((a, b) => {
                return Number(b.dataset.price) - Number(a.dataset.price);
            });
        }

        // Re-append cards in the sorted order
        cards.forEach(card => {
            listingsGrid.appendChild(card);
        });

    });

}