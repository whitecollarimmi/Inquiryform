const scriptURL =
  'https://script.google.com/macros/s/AKfycbzML2ZSF5QYf2Up2uueZoVNSJItOUAoznrYlaNPJw7Eq9HbSpD_RRmgEmCd0f-bLw4q/exec';
const form = document.forms['google-sheet'];

// Function to get current date and time in separate strings
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString(); // e.g., "8/30/2024"
  const time = now.toLocaleTimeString(); // e.g., "10:15:30 AM"
  return { date, time };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Create a new FormData object
  const formData = new FormData(form);

  // Get the current date and time
  const { date, time } = getCurrentDateTime();

  // Add the current date and time to the form data
  formData.append('Submission Date', date);
  formData.append('Submission Time', time);

  // Handle combined countries if needed
  const country1 = formData.get('desiredCountry1') || '';
  const country2 = formData.get('desiredCountry2') || '';
  const country3 = formData.get('desiredCountry3') || '';
  const combinedCountries = [country1, country2, country3]
    .filter((country) => country.trim() !== '')
    .join(', ');

  formData.set('combinedDesiredCountries', combinedCountries);

  fetch(scriptURL, { method: 'POST', body: formData })
    .then((response) => response.json())
    .then((result) => {
      alert('Thanks for submitting the form! We will contact you soon.');
      form.reset(); // Reset the form after successful submission
    })
    .catch((error) => console.error('Error!', error.message));
});

// Format phone input to accept only numbers
document.getElementById('phone').addEventListener('input', function (e) {
  var x = e.target.value.replace(/\D/g, '').match(/(\d{0,10})/);
  e.target.value = x[1];
});

// Handle exam type changes
$('#examType').on('change', function () {
  var selectedExam = $(this).val();
  var isExamSelected = ['ielts', 'pte', 'oet'].includes(selectedExam);

  $('#examScore, #examDate')
    .prop('disabled', !isExamSelected)
    .toggleClass('locked-field', !isExamSelected);

  if (!isExamSelected) {
    $('#examScore, #examDate').val('');
  }

  // Update placeholder based on selected exam
  if (selectedExam === 'ielts') {
    $('#examScore').attr('placeholder', 'Enter IELTS band score (e.g., 7.5)');
  } else if (selectedExam === 'pte') {
    $('#examScore').attr('placeholder', 'Enter PTE score (10-90)');
  } else if (selectedExam === 'oet') {
    $('#examScore').attr('placeholder', 'Enter OET grade (e.g., B, C+)');
  } else {
    $('#examScore').attr('placeholder', 'Enter your score');
  }
});

// Disable exam score and date if "none" is selected
$('form[name="google-sheet"]').on('submit', function (e) {
  var selectedExam = $('#examType').val();
  if (selectedExam === 'none') {
    $('#examScore, #examDate').prop('disabled', true).val('');
  }
});

// Populate years for dropdown
function populateYears() {
  const currentYear = new Date().getFullYear();
  const selectYear = document.getElementById('startYear');
  for (let year = currentYear; year <= 2099; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    selectYear.appendChild(option);
  }
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', populateYears);
