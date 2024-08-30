const form = document.getElementById("formFeedback");
const nameInput = document.getElementById("feedbackName");
const emailInput = document.getElementById("feedbackEmail");
const phoneInput = document.getElementById("feedbackPhone");
const emailCheckbox = document.getElementById("feedbackByMail");
const phoneCheckbox = document.getElementById("feedbackByPhone");
const agreementCheckbox = document.getElementById("feedbackAgreement");
const submitButton = document.getElementById("feedbackSubmit");

const nameError = nameInput.nextElementSibling;
const emailError = emailInput.nextElementSibling;
const phoneError = phoneInput.nextElementSibling;

const textFinal = document.getElementById("textFinal");
textFinal.style.display = "none";

let nameTouched = false;
let emailTouched = false;
let phoneTouched = false;

// убрать пробел с начала текста в инпуте
function removeLeadingSpace(input) {
  input.value = input.value.trimStart();
}

// начинать каждое слово в инпуте с заглавной
function capitalizeWords(input) {
  var words = input.value.split(" ");
  var capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  var capitalizedString = capitalizedWords.join(" ");
  input.value = capitalizedString;
}

// не начинать с пробела + каждое слово заглавное
function formatNameInput(input) {
  removeLeadingSpace(input);
  capitalizeWords(input);
}

// почтовый индекс
function validatePostalCode(input) {
  let postalCode = input.value.replace(/\D/g, "");
  if (postalCode.length > 6) {
    input.value = postalCode.slice(0, 6);
  } else {
    input.value = postalCode;
  }
}

// маска для номера телефона
function formatMaskForPhoneNumber (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
          i = 0,
          def = matrix.replace(/\D/g, ""),
          val = this.value.replace(/\D/g, ""),
          new_value = matrix.replace(/[_\d]/g, function(a) {
              return i < val.length ? val.charAt(i++) : a
          });
      i = new_value.indexOf("_");
      if (i != -1) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
          function(a) {
              return "\\d{1," + a.length + "}"
          }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
        this.value = new_value;
      }
      if (event.type == "blur" && this.value.length < 5) {
        this.value = "";
      }
    }
  
    input.addEventListener("input", mask);
    input.addEventListener("focus", mask);
    input.addEventListener("blur", mask);
    input.addEventListener("keydown", mask);
  
  }

// общая валидация поля
function validateInput(input, error) {
  const pattern = new RegExp(input.pattern);
  if (!pattern.test(input.value)) {
    input.classList.add("form-control-error");
    error.style.opacity = 1;
    return false;
  } else {
    input.classList.remove("form-control-error");
    error.style.opacity = 0;
    return true;
  }
}

function validateNameInput() {
  nameInput.addEventListener("focus", function () {
    nameTouched = true;
  });
  if (nameTouched) {
    formatNameInput(nameInput);
    return validateInput(nameInput, nameError);
  }
}

function validateEmailInput() {
  emailInput.addEventListener("focus", function () {
    emailTouched = true;
  });
  if (emailTouched) {
    return validateInput(emailInput, emailError);
  }
}

function validatePhoneInput() {
  phoneInput.addEventListener("focus", function () {
    phoneTouched = true;
  });
  formatMaskForPhoneNumber(phoneInput);
  if (phoneTouched) {
    return validateInput(phoneInput, phoneError);
  }
}

function checkContactMethod() {
  const isEmailValid = validateEmailInput();
  const isPhoneValid = validatePhoneInput();

  const typeEmail = isEmailValid && emailCheckbox.checked;
  const typePhone = isPhoneValid && phoneCheckbox.checked;
  const typeAll = isEmailValid && isPhoneValid;

  if (emailCheckbox.checked && phoneCheckbox.checked) {
    return typeAll;
  } else if (emailCheckbox.checked) {
    return typeEmail;
  } else if (phoneCheckbox.checked) {
    return typePhone;
  }

  return false;
}

function checkAgreement() {
  return agreementCheckbox.checked;
}

function validateForm() {
  const isNameValid = validateNameInput();
  const isContactMethodValid = checkContactMethod();
  const isAgreementValid = checkAgreement();

  if (isNameValid && isContactMethodValid && isAgreementValid) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

nameInput.addEventListener("input", validateForm);
emailInput.addEventListener("input", validateForm);
phoneInput.addEventListener("input", validateForm);
emailCheckbox.addEventListener("change", validateForm);
phoneCheckbox.addEventListener("change", validateForm);
agreementCheckbox.addEventListener("change", validateForm);

validateForm();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then(() => {
      form.style.display = "none";
      textFinal.style.display = "flex";
    })
    .catch((error) => {
      console.error("Ошибка при отправке данных на сервер:", error);
    });
});
