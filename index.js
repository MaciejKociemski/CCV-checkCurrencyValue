// Selectors
const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const getBtn = document.querySelector("form button");
const exIcon = document.querySelector("form .reverse");
const amount = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");

// Initial values
[fromCur.value, toCur.value] = ["GMD", "PLN"];
amount.value = 100;

// Function to set up currency options
function setupCurrencyOptions(select, initialCode) {
  for (let curCode in Country_List) {
    const selected = curCode === initialCode ? "selected" : "";
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${curCode}" ${selected}>${curCode}</option>`
    );
  }
}

// Function to update flag image
function updateFlagImage(select) {
  const code = select.value;
  const imgTag = select.parentElement.querySelector("img");
  imgTag.src = `https://flagcdn.com/48x36/${Country_List[
    code
  ].toLowerCase()}.png`;
}

// Event listeners for currency dropdowns
[fromCur, toCur].forEach((select, i) => {
  setupCurrencyOptions(select, i === 0 ? "GMD" : "PLN");
  select.addEventListener("change", () => {
    updateFlagImage(select);
  });
});

// Function to get exchange rate from API
async function getExchangeRate() {
  const amountVal = amount.value || 100;
  exRateTxt.innerText = "Getting exchange rate...";
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/93ffb97de52b52b333dbd9c9/latest/${fromCur.value}`
    );
    const result = await response.json();
    const exchangeRate = result.conversion_rates[toCur.value];
    const totalExRate = (amountVal * exchangeRate).toFixed(2);
    exRateTxt.innerText = `${amountVal} ${fromCur.value} = ${totalExRate} ${toCur.value}`;
  } catch (error) {
    exRateTxt.innerText = "Something went wrong...";
  }
}

// Event listeners for window load, button click, and exchange icon click
window.addEventListener("load", () => {
  [fromCur, toCur].forEach((select) => {
    updateFlagImage(select);
  });
  getExchangeRate();
});

getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exIcon.addEventListener("click", () => {
  [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
  [fromCur, toCur].forEach((select) => {
    updateFlagImage(select);
  });
  getExchangeRate();
});
