const scriptURL =
  'https://script.google.com/macros/s/AKfycbyctKpB7I7is02rejzLAeXRljmqQ9ZmBSfT4VzVu1ZUDme9MT6L1DEMIyVVLOPKyn2tVA/exec';
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return { date, time };
}

function handleFormSubmit(form) {
  form.removeEventListener('submit', submitFormHandler);
  form.addEventListener('submit', submitFormHandler);
}

function submitFormHandler(e) {
  e.preventDefault();
  if (this.submitting) return;
  this.submitting = true;

  const formData = new FormData(this);
  const { date, time } = getCurrentDateTime();
  formData.append('Submission Date', date);
  formData.append('Submission Time', time);

  const visaTypeElement = document.querySelector(
    'input[name="visaType"]:checked',
  );
  if (!visaTypeElement) {
    alert('Please select a visa type before submitting.');
    this.submitting = false;
    return;
  }

  const visaType = visaTypeElement.value;
  formData.append('Visa Type', visaType);

  // Handle combined countries logic
  if (visaType === 'student') {
    const combinedCountries = [
      'desiredCountry1',
      'desiredCountry2',
      'desiredCountry3',
    ]
      .map((key) => formData.get(key) || '')
      .filter((country) => country.trim() !== '')
      .join(', ');
    formData.set('combinedDesiredCountries', combinedCountries);
  } else if (visaType === 'visitor') {
    const visitorCombinedCountries = [
      'Visitors desiredCountry1',
      'Visitors desiredCountry2',
      'Visitors desiredCountry3',
    ]
      .map((key) => formData.get(key) || '')
      .filter((country) => country.trim() !== '')
      .join(', ');
    formData.set('VisitorsDesiredCountries', visitorCombinedCountries);
  }

  // Create a new FormData object for the data to be sent
  const dataToSend = new FormData();

  // Add visa type, submission date and time
  dataToSend.append('Visa Type', visaType);
  dataToSend.append('Submission Date', date);
  dataToSend.append('Submission Time', time);

  // Process form data based on visa type
  for (let [key, value] of formData.entries()) {
    if (visaType === 'visitor') {
      // For visitor form, keep the 'Visitor ' prefix and include all visitor-related fields
      if (
        key.startsWith('Visitor ') ||
        key === 'VisitorsDesiredCountries' ||
        key === 'visitorNumber'
      ) {
        dataToSend.append(key, value);
      }
    } else {
      // For student form, add all fields as they are
      dataToSend.append(key, value);
    }
  }

  fetch(scriptURL, { method: 'POST', body: dataToSend })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Success:', response);
      alert('Thanks for submitting the form! We will contact you soon.');

      // Reset the form and show student visa form by default
      resetFormState();
      $('input[name="visaType"][value="student"]')
        .prop('checked', true)
        .trigger('change');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error submitting the form. Please try again.');
    })
    .finally(() => {
      this.submitting = false;
    });
}

function resetFormState() {
  // Reset both forms
  document.forms['google-sheet-student'].reset();
  document.forms['google-sheet-visitor'].reset();

  // Hide both visa forms
  $('#studentVisaForm').hide();
  $('#visitorVisaForm').hide();

  // Uncheck all visa type radio buttons
  $('input[name="visaType"]').prop('checked', false);

  // Disable and clear specific fields
  $('#examScore, #examDate').prop('disabled', true).val('');
  $(
    '#specificvisa, #otherpurpose, #visitedcountries, #rejectionreason, #otheroption, #otheroption1',
  )
    .prop('disabled', true)
    .val('');

  // Reset any other form-specific states here
  // For example, if you have any custom select dropdowns, reset them to their default state
}

function handleVisaTypeSelection() {
  $('#studentVisaForm').show();
  $('input[name="visaType"]').on('change', function () {
    const selectedType = $(this).val();
    $('.visa-form').hide();
    if (selectedType === 'student') {
      $('#studentVisaForm').show();
    } else if (selectedType === 'visitor') {
      $('#visitorVisaForm').show();
    }
  });
}

function formatPhoneInput(input) {
  input.addEventListener('input', function (e) {
    var x = e.target.value.replace(/\D/g, '').substring(0, 10);
    e.target.value = x;
  });
}

function handleExamTypeChange() {
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
}

function populateYears(selectId) {
  const currentYear = new Date().getFullYear();
  const selectYear = document.getElementById(selectId);
  for (let year = currentYear; year <= 2099; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    selectYear.appendChild(option);
  }
}

function handleOtherVisaType() {
  $('#typeofvisa').change(function () {
    var isOtherSelected = $(this).val() === 'Other';
    $('#specificvisa')
      .prop('disabled', !isOtherSelected)
      .toggleClass('locked-field', !isOtherSelected);
    if (!isOtherSelected) {
      $('#specificvisa').val('');
    }
  });
}

function handlePurposeOfVisit() {
  $('#purposeofvisit').change(function () {
    var isOther = $(this).val() === 'Other';
    $('#otherpurpose')
      .prop('disabled', !isOther)
      .toggleClass('locked-field', !isOther);
    if (!isOther) {
      $('#otherpurpose').val('');
    }
  });
}

function handleInternationalTravel() {
  $('#alreadyvisited').change(function () {
    var isVisited = $(this).val() === 'Yes';
    $('#visitedcountries')
      .prop('disabled', !isVisited)
      .toggleClass('locked-field', !isVisited);
    if (!isVisited) {
      $('#visitedcountries').val('');
    }
  });
}

function handleVisaRejection() {
  $('#rejection').change(function () {
    var isRejected = $(this).val() === 'Yes';
    $('#rejectionreason')
      .prop('disabled', !isRejected)
      .toggleClass('locked-field', !isRejected);
    if (!isRejected) {
      $('#rejectionreason').val('');
    }
  });
}

function handleHowYouKnowUs(selectId, inputId) {
  $(selectId).change(function () {
    var isOther = $(this).val() === 'Other';
    $(inputId).prop('disabled', !isOther).toggleClass('locked-field', !isOther);
    if (!isOther) {
      $(inputId).val('');
    }
  });
}

function initForm() {
  const studentForm = document.forms['google-sheet-student'];
  const visitorForm = document.forms['google-sheet-visitor'];

  if (studentForm) handleFormSubmit(studentForm);
  if (visitorForm) handleFormSubmit(visitorForm);

  formatPhoneInput(document.getElementById('phone'));
  handleExamTypeChange();
  populateYears('startYear');
  populateYears('startYear1');
  handleVisaTypeSelection();
  handleOtherVisaType();
  handlePurposeOfVisit();
  handleInternationalTravel();
  handleVisaRejection();
  handleHowYouKnowUs('#about_us', '#otheroption');
  handleHowYouKnowUs('#about_us1', '#otheroption1');

  $('#studentVisaForm').show();
}

$(document).ready(initForm);
document.addEventListener('DOMContentLoaded', initForm);
