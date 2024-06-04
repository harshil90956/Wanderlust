// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();

// Event listener for toggling prices with GST
let prices = document.getElementsByClassName("prices");
let originalPrices = {}; // Object to store original prices

// Store original prices
for (let i = 0; i < prices.length; i++) {
  originalPrices[i] = parseFloat(prices[i].innerHTML.replace(/[^0-9.-]+/g, ""));
}

// Event listener for price toggle switch
let priceToggle = document.getElementById("flexSwitchCheckDefault");
priceToggle.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");

  // Toggle visibility of tax info
  for (let info of taxInfo) {
    if (info.style.display !== "inline") {
      info.style.display = "inline";

      // Apply GST to prices
      for (let i = 0; i < prices.length; i++) {
        let currentPrice = originalPrices[i];
        let gstAmount = currentPrice * 0.18; // Calculate GST amount
        let priceWithGST = currentPrice + gstAmount; // Calculate price with GST
        prices[i].innerHTML = `₹ ${priceWithGST.toFixed(2)} /night`; // Display price with GST
      }
    } else {
      info.style.display = "none";

      // Restore original prices
      for (let i = 0; i < prices.length; i++) {
        prices[i].innerHTML = `₹ ${originalPrices[i]} /night`; // Display original price without GST
      }
    }
  }
});

// Event listeners for filter icons
const filterElements = document.querySelectorAll('.filter');
filterElements.forEach(filter => {
  filter.addEventListener('click', handleFilterClick);
});

// Function to handle filter click event
function handleFilterClick(event) {
  const filterCategory = event.currentTarget.dataset.category;
  sendFilterRequest(filterCategory);
}

// Function to send filter request
function sendFilterRequest(filterCategory) {
  const url = new URL('/listings/category', window.location.origin);
  url.searchParams.set('category', filterCategory);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        console.error('Server error:', response.statusText);
        return;
      }
      return response.json();
    })
    .then(data => { "success" })
    .catch(error => console.error(error));
}

// Function to encode search query
function encodeSearchQuery() {
  var searchInput = document.getElementById('searchInput');
  searchInput.value = encodeURIComponent(searchInput.value);
}
