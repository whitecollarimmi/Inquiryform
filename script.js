const scriptURL =
  'https://script.google.com/macros/s/AKfycbyctKpB7I7is02rejzLAeXRljmqQ9ZmBSfT4VzVu1ZUDme9MT6L1DEMIyVVLOPKyn2tVA/exec';
const form = document.forms['google-sheet'];

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return { date, time };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const { date, time } = getCurrentDateTime();
  formData.append('Submission Date', date);
  formData.append('Submission Time', time);

  const country1 = formData.get('desiredCountry1') || '';
  const country2 = formData.get('desiredCountry2') || '';
  const country3 = formData.get('desiredCountry3') || '';
  const combinedCountries = [country1, country2, country3]
    .filter((country) => country.trim() !== '')
    .join(', ');

  formData.set('combinedDesiredCountries', combinedCountries);

  // Handle exam fields
  const selectedExam = document.getElementById('examType').value;
  if (selectedExam === 'none') {
    formData.set('examScore', '');
    formData.set('examDate', '');
  }

  fetch(scriptURL, { method: 'POST', body: formData })
    .then((response) => response.json())
    .then((result) => {
      alert('Thanks for submitting the form! We will contact you soon.');
      form.reset();
    })
    .catch((error) => console.error('Error!', error.message));
});


document.getElementById('phone').addEventListener('input', function (e) {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
});

document.getElementById('phone1').addEventListener('input', function (e) {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
});


document.getElementById('examType').addEventListener('change', function () {
  const selectedExam = this.value;
  const isExamSelected = ['ielts', 'pte', 'oet'].includes(selectedExam);
  const examScore = document.getElementById('examScore');
  const examDate = document.getElementById('examDate');

  examScore.disabled = !isExamSelected;
  examDate.disabled = !isExamSelected;
  examScore.classList.toggle('locked-field', !isExamSelected);
  examDate.classList.toggle('locked-field', !isExamSelected);

  if (!isExamSelected) {
    examScore.value = '';
    examDate.value = '';
  }

  if (selectedExam === 'ielts') {
    examScore.placeholder = 'Enter IELTS band score (e.g., 7.5)';
  } else if (selectedExam === 'pte') {
    examScore.placeholder = 'Enter PTE score (10-90)';
  } else if (selectedExam === 'oet') {
    examScore.placeholder = 'Enter OET grade (e.g., B, C+)';
  } else {
    examScore.placeholder = 'Enter your score';
  }
});

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

function populateYears1() {
  const currentYear = new Date().getFullYear();
  const selectYear = document.getElementById('visitorstartYear');
  for (let year = currentYear; year <= 2099; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    selectYear.appendChild(option);
  }
}

function handleOtherVisaType() {
  const typeOfVisaSelect = document.getElementById('typeofvisa');
  const specificVisaInput = document.getElementById('specificvisa');

  if (!typeOfVisaSelect || !specificVisaInput) {
    console.error('Required elements not found');
    return;
  }

  function updateSpecificVisa() {
    const isOtherSelected = typeOfVisaSelect.value === 'Other';

    specificVisaInput.disabled = !isOtherSelected;
    specificVisaInput.classList.toggle('locked-field', !isOtherSelected);

    if (!isOtherSelected) {
      specificVisaInput.value = '';
    }
  }

  typeOfVisaSelect.addEventListener('change', updateSpecificVisa);


  updateSpecificVisa();
}

function handlePurposeOfVisit() {
  const purposeOfVisitSelect = document.getElementById('purposeofvisit');
  const otherPurposeInput = document.getElementById('otherpurpose');

  if (!purposeOfVisitSelect || !otherPurposeInput) {
    console.error('Required elements not found');
    return;
  }

  function updateOtherPurpose() {
    const isOther = purposeOfVisitSelect.value === 'Other';

    otherPurposeInput.disabled = !isOther;
    otherPurposeInput.classList.toggle('locked-field', !isOther);

    if (!isOther) {
      otherPurposeInput.value = '';
    }
  }

  purposeOfVisitSelect.addEventListener('change', updateOtherPurpose);

  
  updateOtherPurpose();
}

function handleTravelFields() {
  const passportSelect = document.getElementById('pass');
  const travelledBeforeSelect = document.getElementById('alreadyvisited');
  const visitedCountriesTextarea = document.getElementById('visitedcountries');

  if (!passportSelect || !travelledBeforeSelect || !visitedCountriesTextarea) {
    console.error('Required elements not found');
    return;
  }

  function updateFields() {
    const hasPassport = passportSelect.value === 'Yes';
    const hasTravelledBefore = travelledBeforeSelect.value === 'Yes';

    
    travelledBeforeSelect.disabled = !hasPassport;
    travelledBeforeSelect.classList.toggle('locked-field', !hasPassport);

    
    if (!hasPassport) {
      travelledBeforeSelect.value = 'none';
    }

  
    visitedCountriesTextarea.disabled = !(hasPassport && hasTravelledBefore);
    visitedCountriesTextarea.classList.toggle(
      'locked-field',
      !(hasPassport && hasTravelledBefore),
    );

    // If either passport or travelledBefore is not "Yes", clear the visitedCountries field
    if (!hasPassport || !hasTravelledBefore) {
      visitedCountriesTextarea.value = '';
    }
  }

  passportSelect.addEventListener('change', updateFields);
  travelledBeforeSelect.addEventListener('change', updateFields);

  // Call the function initially to set the correct state
  updateFields();
}

function handleVisaRejection() {
  const rejectionSelect = document.getElementById('rejection');
  const rejectionReasonInput = document.getElementById('rejectionreason');

  if (!rejectionSelect || !rejectionReasonInput) {
    console.error('Required elements not found');
    return;
  }

  function updateRejectionReason() {
    const isRejected = rejectionSelect.value === 'Yes';

    rejectionReasonInput.disabled = !isRejected;
    rejectionReasonInput.classList.toggle('locked-field', !isRejected);

    if (!isRejected) {
      rejectionReasonInput.value = '';
    }
  }

  rejectionSelect.addEventListener('change', updateRejectionReason);

  
  updateRejectionReason();
}


document.addEventListener('DOMContentLoaded', () => {
  populateYears();
  populateYears1();
  handleOtherVisaType();
  handlePurposeOfVisit();
  handleTravelFields();
  handleVisaRejection();
});
