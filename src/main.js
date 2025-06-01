import { el, setChildren } from "redom";
import valid from "card-validator";
import { validate } from "email-validator";
import IMask from "imask";
import { images } from "./img.js";

const form = el("form.form");
const inpCardNumber = el("input", {
  type: "text",
  placeholder: "Номер карты",
  class: "form__inp",
});
const inpExpirationDate = el("input", {
  type: "text",
  placeholder: "ММ/ГГ",
  class: "form__inp-mini form__inp",
});
const inpSecurityCode = el("input", {
  type: "text",
  placeholder: "CVC/CVV",
  class: "form__inp-mini form__inp",
});
const inpEmail = el("input", {
  type: "email",
  placeholder: "Адрес электронной почты",
  class: "form__inp",
});
const btn = el("button", "Оплатить", { disabled: "true", class: "form__btn" });
const inputsArray = new Set();

let cardImg = el("img", { src: images.default, class: "card-img" });

[inpCardNumber, inpExpirationDate, inpSecurityCode, inpEmail].forEach((el) => {
  el.oninput = (e) => e.target.classList.remove("input-error");
});

const maskCardNumber = IMask(inpCardNumber, {
  mask: "0000 0000 0000 0000 00",
});

const maskExpirationDate = IMask(inpExpirationDate, {
  mask: "m/y",
  blocks: {
    m: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    y: {
      mask: IMask.MaskedRange,
      from: 24,
      to: 99,
    },
  },
});

const maskSecurityCode = IMask(inpSecurityCode, {
  mask: "000",
});

inpCardNumber.addEventListener("blur", (e) => {
  const validation = valid.number(maskCardNumber.unmaskedValue);
  addImg(validation.card, validation.isValid);
  checkInput(e.target, validation.isValid);
});

inpExpirationDate.addEventListener("blur", (e) => {
  const validation = valid.expirationDate(
    maskExpirationDate.unmaskedValue
  ).isValid;
  checkInput(e.target, validation);
});

inpSecurityCode.addEventListener("blur", (e) => {
  const validation = valid.postalCode(maskSecurityCode.unmaskedValue).isValid;
  checkInput(e.target, validation);
});

inpEmail.addEventListener("blur", (e) => {
  const validation = validate(e.target.value);
  checkInput(e.target, validation);
});

function checkInput(input, isCorrect) {
  if (isCorrect) {
    inputsArray.add(input);
    input.classList.remove("input-error");
    input.classList.add("valid");
    if (inputsArray.size >= 4) {
      btn.classList.add("valid");
      btn.disabled = false;
    }
  } else {
    inputsArray.delete(input);
    input.classList.remove("valid");
    input.classList.add("input-error");
    btn.classList.remove("valid");
    btn.disabled = true;
  }
}
// список карт для просмотра картинки
// "discover",   6011000990139424
// "jcb",  3530111333300000
// "maestro",  5610591081018250
// "mastercard", 5105105105105100
// "mir",  2202201000305843
// "unionpay",  6291160880003642
// "visa", 4012888888881881

//  те карты которые не нашел, имеют не свою картинку а заглушку

function addImg(type, valid) {
  const imgArr = [
    "discover",
    "jcb",
    "maestro",
    "mastercard",
    "mir",
    "unionpay",
    "visa",
  ];
  if (type == null || !valid) {
    cardImg.src = images.default;
  } else {
    if (imgArr.includes(type.type)) {
      cardImg.src = images[type.type];
    } else {
      cardImg.src = images.default;
    }
  }
}

setChildren(
  form,
  inpCardNumber,
  inpExpirationDate,
  inpSecurityCode,
  inpEmail,
  btn
);
setChildren(app, form, cardImg);
