// array to store persons
let persons = [];

// index for pagination
let index = 3;

// Get references to the form and input elements
const form = document.getElementById("person-form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const dobInput = document.getElementById("dob");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const cityInput = document.getElementById("city");
const zipcodeInput = document.getElementById("zipcode");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

// adding persons from local storage
function handleOnLoad() {
  persons = JSON.parse(localStorage.getItem("persons")) || [];
  // console.log(persons);
  // disable prev and next button on load if there are no persons
  if (persons.length === 0) {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }
  renderPersons();
}

// Add event listener for form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm()) {
    addPerson();
    clearForm();
  }
});

// Validate the form inputs
function validateForm() {
  clearErrors();

  let isValid = true;

  if (firstNameInput.value.trim() === "") {
    showError(firstNameInput, "First name is required");
    isValid = false;
  }

  if (lastNameInput.value.trim() === "") {
    showError(lastNameInput, "Last name is required");
    isValid = false;
  }

  if (dobInput.value === "") {
    showError(dobInput, "Date of birth is required");
    isValid = false;
  } else {
    const dob = new Date(dobInput.value);
    const now = new Date();

    // calculate age from dob and now and age must be at least 18 years
    const age = now.getFullYear() - dob.getFullYear();
    if (age < 18) {
      showError(dobInput, "Age must be at least 18 years");
      isValid = false;
    }
  }

  if (emailInput.value.trim() === "") {
    showError(emailInput, "Email is required");
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError(emailInput, "Invalid email format");
    isValid = false;
  }

  if (mobileInput.value.trim() === "") {
    showError(mobileInput, "Mobile number is required");
    isValid = false;
  } else if (!isValidMobile(mobileInput.value)) {
    showError(mobileInput, "Invalid mobile number format");
    isValid = false;
  }

  if (cityInput.value.trim() === "") {
    showError(cityInput, "City is required");
    isValid = false;
  }

  if (zipcodeInput.value.trim() === "") {
    showError(zipcodeInput, "Pincode/Zipcode is required");
    isValid = false;
  }

  return isValid;
}

// Add a new person to the list
function addPerson() {
  const person = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    dob: dobInput.value,
    email: emailInput.value.trim(),
    mobile: mobileInput.value.trim(),
    city: cityInput.value.trim(),
    zipcode: zipcodeInput.value.trim(),
  };

  persons.push(person);
  //   save person to local storage
  localStorage.setItem("persons", JSON.stringify(persons));
  renderPersons();
}

// Clear the form inputs
function clearForm() {
  form.reset();
}

// Clear error messages
function clearErrors() {
  const errorElements = document.getElementsByClassName("error");
  for (let i = 0; i < errorElements.length; i++) {
    errorElements[i].textContent = "";
  }
}

// Show error message for an input element
function showError(inputElement, errorMessage) {
  const errorElementId = inputElement.id + "-error";
  const errorElement = document.getElementById(errorElementId);
  errorElement.textContent = errorMessage;
}

// Validate email format
function isValidEmail(email) {
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate mobile number format (10 digits or with country code)
function isValidMobile(mobile) {
  // Mobile number validation regex
  const mobileRegex = /^\d{10}$|^(\+\d{1,3}[- ]?)?\d{10}$/;
  return mobileRegex.test(mobile);
}

// sort persons by age
function handleSortByAge(e) {
  e.preventDefault();
  let sortOrder = e.target.value;
  if (sortOrder === "asc") {
    persons.sort((a, b) => {
      return new Date(a.dob) - new Date(b.dob);
    });
    renderPersons();
  } else if (sortOrder === "desc") {
    persons.sort((a, b) => {
      return new Date(b.dob) - new Date(a.dob);
    });
    renderPersons();
  }
}

// search person by name
function handleSeachByName(e) {
  e.preventDefault();
  const searchValue = e.target.value;
  const filteredPersons = persons.filter(
    (person) =>
      person.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchValue.toLowerCase())
  );
  renderPersons(filteredPersons);
}

// pagination handlePrevBtnClick
function handlePrevBtnClick() {
  // check if index is less than 0 then disable prev button
  index -= 3;
  let nextPersons = persons.slice(index - 3, index);
  if (index <= 3) {
    prevBtn.disabled = true;
  }
  nextBtn.disabled = false;
  renderPersons(nextPersons);
  console.log(index);
}

// pagination handleNextBtnClick
function handleNextBtnClick() {
  // check if index is greater than persons length then disable next button
  index += 3;
  let nextPersons = persons.slice(index - 3, index);
  if (index >= persons.length) {
    nextBtn.disabled = true;
  }
  prevBtn.disabled = false;
  renderPersons(nextPersons);
}

// Render the persons list
function renderPersons(filteredPersons) {
  const personsList = document.getElementById("persons-list");
  personsList.innerHTML = "";

  if (filteredPersons) {
    for (let i = 0; i < filteredPersons.length; i++) {
      const person = filteredPersons[i];

      const card = document.createElement("div");
      card.classList.add("card");
      const fullName = document.createElement("h3");
      fullName.textContent = person.firstName + " " + person.lastName;
      const dob = document.createElement("p");
      dob.textContent = "DOB: " + person.dob;
      const email = document.createElement("p");
      email.textContent = "Email: " + person.email;
      const mobile = document.createElement("p");
      mobile.textContent = "Mobile: " + person.mobile;
      const city = document.createElement("p");
      city.textContent = "City: " + person.city;
      const zipcode = document.createElement("p");
      zipcode.textContent = "Zipcode: " + person.zipcode;

      card.appendChild(fullName);
      card.appendChild(dob);
      card.appendChild(email);
      card.appendChild(mobile);
      card.appendChild(city);
      card.appendChild(zipcode);
      personsList.appendChild(card);
    }
  } else {
    for (let i = 0; i < 3 && i < persons.length; i++) {
      const person = persons[i];

      const card = document.createElement("div");
      card.classList.add("card");
      const fullName = document.createElement("h3");
      fullName.textContent = person.firstName + " " + person.lastName;
      const dob = document.createElement("p");
      dob.textContent = "DOB: " + person.dob;
      const email = document.createElement("p");
      email.textContent = "Email: " + person.email;
      const mobile = document.createElement("p");
      mobile.textContent = "Mobile: " + person.mobile;
      const city = document.createElement("p");
      city.textContent = "City: " + person.city;
      const zipcode = document.createElement("p");
      zipcode.textContent = "Zipcode: " + person.zipcode;

      card.appendChild(fullName);
      card.appendChild(dob);
      card.appendChild(email);
      card.appendChild(mobile);
      card.appendChild(city);
      card.appendChild(zipcode);
      personsList.appendChild(card);
    }
  }
}
