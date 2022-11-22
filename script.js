"use strict";

const loanAmountInput = document.querySelector(".loan-amount");
const loanInterestInput = document.querySelector(".loan-interest");
const loanTenureInput = document.querySelector(".loan-tenure");

const loanEMIValue = document.querySelector(".loan-emi .value");
const totalInterestValue = document.querySelector(".total-interest .value");
const totalAmountValue = document.querySelector(".total-amount .value");

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const panNum = document.getElementById("panNum");

const calculateBtn = document.querySelector(".calculate-btn");

let loanAmount = parseFloat(loanAmountInput.value);
let loanInterest = parseFloat(loanInterestInput.value);
let loanTenure = parseFloat(loanTenureInput.value) * 12;

let interest = loanInterest / 12 / 100;

// Calculate EMI
const calculateEMI = () => {
  checkValues();
  refInputValues();

  let emi =
    loanAmount *
    interest *
    (Math.pow(1 + interest, loanTenure) /
      (Math.pow(1 + interest, loanTenure) - 1));

  return emi;
};

// Displaying the Chart
let myChart;

const displayChart = (totalInterestPayable) => {
  const ctx = document.getElementById("myChart");
  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Total Interest", "Principal Loan Amount"],
      datasets: [
        {
          data: [totalInterestPayable, loanAmount],
          backgroundColor: ["#e63946", "#14213d"],
          borderWidth: 0,
        },
      ],
    },
  });
};

// Updating the Chart
const updateChart = (totalInterestPayable) => {
  myChart.data.datasets[0].data[0] = totalInterestPayable;
  myChart.data.datasets[0].data[1] = loanAmount;
  myChart.update();
};

// Updating the Values
const updateData = (emi) => {
  loanEMIValue.innerHTML = Math.round(emi);

  let totalAmount = Math.round(loanTenure * emi);
  totalAmountValue.innerHTML = totalAmount;

  let totalInterestPayable = Math.round(totalAmount - loanAmount);
  totalInterestValue.innerHTML = totalInterestPayable;

  if (myChart) {
    updateChart(totalInterestPayable);
  } else {
    displayChart(totalInterestPayable);
  }
};

// Checking the Input Values
const checkValues = () => {
  let loanAmountValue = loanAmountInput.value;
  let loanInterestValue = loanInterestInput.value;
  let loanTenureValue = loanTenureInput.value;

  let regexNumber = /^[0-9]+$/;
  if (!loanAmountValue.match(regexNumber)) {
    loanAmountInput.value = "100000";
  }

  if (!loanTenureValue.match(regexNumber)) {
    loanTenureInput.value = "15";
  }

  let regexDecimal = /^(\d*\.)?\d+$/;
  if (!loanInterestValue.match(regexNumber)) {
    loanInterestInput.value = "8.5";
  }
};

// Referencing the Value Inputs
const refInputValues = () => {
  loanAmount = parseFloat(loanAmountInput.value);
  loanInterest = parseFloat(loanInterestInput.value);
  loanTenure = parseFloat(loanTenureInput.value) * 12;
  interest = loanInterest / 12 / 100;
};

const init = () => {
  let emi = calculateEMI();
  updateData(emi);
};

init();

calculateBtn.addEventListener("click", init);

// Submitting the Personal Details

form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs();
  console.log(generateOTP());
});

// Checking the Values in the Input
function checkInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const panNumValue = panNum.value.trim();

  if (usernameValue === "") {
    setErrorFor(username, "Please enter your Full Name");
  } else if (!isFullName(usernameValue)) {
    setErrorFor(username, "Enter a Valid Name");
  } else {
    setSuccessFor(username);
  }

  if (emailValue === "") {
    setErrorFor(email, "Please enter your Email");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Email is not valid");
  } else {
    setSuccessFor(email);
  }

  if (panNumValue === "") {
    setErrorFor(panNum, "Please enter your PAN");
  } else if (!isPan(panNumValue)) {
    setErrorFor(panNum, "PAN is not valid");
  } else {
    setSuccessFor(panNum);
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.innerText = message;

  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;

  formControl.className = "form-control success";
}

function isFullName(username) {
  return /([a-zA-Z.\\s]{4,}) ([a-zA-Z.\\s]{4,})/.test(username);
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function isPan(panNum) {
  return /(([A-Z]){5}([0-9]){4}([A-Z]){1})/.test(panNum);
}

// Generating an OTP
function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
