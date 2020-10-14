const APIkey = "d751397f46a2f5be121a8b4e30d80843";
const cityInput = document.querySelector("input");
const temp = document.querySelector(".temperature");
const loc = document.querySelector(".location");
const description = document.querySelector(".description");
const temp_ressentie = document.querySelector(".temp_ressentie");
const img = document.querySelector("img");
const days_temp = document.querySelectorAll(".days_temp");
const hour = document.querySelectorAll(".hour");

const getCurrentData = async (city = "Neerheylissem") => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=FR&appid=${APIkey}
    `
  );
  const data = await response.json();
  return data;
};

const getForecastData = async (city = "Neerheylissem") => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=FR&appid=${APIkey}
    `
  );
  const data = await response.json();
  return data;
};

getCurrentData().then((data) => {
  console.log(data);
  updateUi(data);
});

getForecastData().then((data) => {
  console.log(data);
  updateUiDaily(data);
  console.log(typeof data.list[0].dt_txt);
});

const updateUi = (data) => {
  temp.innerHTML = Math.trunc(data.main.temp);
  description.innerHTML = data.weather[0].description;
  loc.innerHTML = data.name;
  temp_ressentie.innerHTML = Math.trunc(data.main.feels_like);
  img.src = `img/${data.weather[0].icon}.svg`;
};

const updateUiDaily = (data) => {
  for (i = 1; i < 9; i++) {
    days_temp[i - 1].innerHTML = `${Math.trunc(data.list[i].main.temp)} degré`;
    hour[i - 1].innerHTML = `${data.list[i].dt_txt.slice(10, 13)}h`;
  }
};

const cityForm = document.querySelector("form");

cityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = cityForm.city.value.trim();

  cityForm.reset();

  getCurrentData(city).then((x) => updateUi(x));
  getForecastData(city).then((x) => updateUiDaily(x));
});
