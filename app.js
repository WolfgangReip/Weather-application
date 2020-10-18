const APIkey = "d751397f46a2f5be121a8b4e30d80843";
const cityInput = document.querySelector("input");
const temp = document.querySelector(".temperature");
const loc = document.querySelector(".location");
const description = document.querySelector(".description");
const temp_ressentie = document.querySelector(".temp_ressentie");
const img = document.querySelector("img");
const days_temp = document.querySelectorAll(".days_temp");
const hour = document.querySelectorAll(".hour");
const day = document.querySelectorAll(".day");
const day_temp_max = document.querySelectorAll(".days_temp_Max");
const humidity = document.querySelector(".humidity");
const vent = document.querySelector(".vent");

let hours = [];

//On récupère les données pour avoir les latitues, longitudes et le nom
const getLatLongData = async (city = "Neerheylissem") => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=FR&appid=${APIkey}
    `
    );
    const data = await response.json();
    return data;
};

// On récupère les données météos générale pour l'actuelle et les prévisions
const getForecastData = async (lat = "50.7568", lon = "4.989") => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=FR&callbackexclude={part}&appid=${APIkey}

    `
    );
    const data = await response.json();
    return data;
};

//Avec les données récupérées de coordonnées et de nom, on va updater le nom (et les heures en dessous) On va également à l'aide de ces données appeler la fonction avec les lattitudes et longitudes nouvellement acquise pour récupérer les données météos actuelles et prévisionnelles et ensuite appeler la fonction pour mettre à jour les données météo
getLatLongData().then((data) => {
    updateName(data);

    const test = (data) => {
        let hours = [];
        for (i = 0; i < 8; i++) {
            hours.push(`${data.list[i].dt_txt.slice(11, 13)}h`);
        }
        return hours;
    };

    const degre = (data) => {
        let degres = [];
        for (i = 0; i < 8; i++) {
            degres.push(parseInt(Math.trunc(data.list[i].main.temp)));
        }
        return degres;
    };

    console.log(degre(data));

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: test(data),
            datasets: [
                {
                    label: "Température °C",
                    data: degre(data),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 18,
                },
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            fontColor: "white",
                            callback: function (value) {
                                return value + "°C";
                            },
                        },
                        gridLines: {
                            drawBorder: true,
                            display: false,
                            color: "white",
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontColor: "white",
                        },
                        gridLines: {
                            drawBorder: true,
                            display: false,
                            color: "white",
                        },
                    },
                ],
            },
        },
    });
    console.log(myChart.data.labels);

    let { lattitude, longitude } = getLatLong(data);

    getForecastData(lattitude, longitude).then((data) => {
        updateUiData(data);
    });
});

const getLatLong = (data) => {
    let latData = data.city.coord.lat;
    let longData = data.city.coord.lon;

    return {
        latData,
        longData,
    };
};

const updateUiData = (data) => {
    let deg = degToCard(data.current.wind_deg);
    vent.innerHTML = `Vent : ${data.current.wind_speed} km/h ${deg}`;

    humidity.innerHTML = `<span> Humidité : ${data.current.humidity}% </span>`;
    let descrip = data.current.weather[0].description;
    descrip = descrip.charAt(0).toUpperCase() + descrip.slice(1);
    temp.innerHTML = Math.trunc(data.current.temp) + "<span>&#8451</span>";
    description.innerHTML = descrip;
    temp_ressentie.innerHTML = `Temp ressentie : ${Math.trunc(
        data.current.feels_like
    )}&#8451`;
    img.src = `img/${data.current.weather[0].icon}.svg`;

    for (i = 0; i < 8; i++) {
        days_temp[i].innerHTML = `${Math.trunc(
            data.daily[i].temp.min
        )}<span>&#8451</span> Min`;
        day_temp_max[i].innerHTML = `${Math.trunc(
            data.daily[i].temp.max
        )}<span>&#8451</span> Max`;
        if (i === 7) {
            day[i].innerHTML = jourActuelle;
        } else {
            day[i].innerHTML = semaineOrdre[i];
        }
    }
};

const updateName = (data) => {
    loc.innerHTML = data.city.name;
};

const cityForm = document.querySelector("form");

cityForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = cityForm.city.value.trim();

    cityForm.reset();

    getLatLongData(city).then((data) => {
        console.log(data);
        updateName(data);
        const { latData, longData } = getLatLong(data);

        getForecastData(latData, longData).then((data) => {
            console.log(data);
            updateUiData(data);
        });
    });
});

const semaine = [
    "lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
];

let date = new Date();
let options = { weekday: "long" };
let jourActuelle = date.toLocaleDateString("fr-FR", options);
jourActuelle = jourActuelle.charAt(0).toUpperCase() + jourActuelle.slice(1);

let semaineOrdre = semaine
    .slice(semaine.indexOf(jourActuelle))
    .concat(semaine.slice(0, semaine.indexOf(jourActuelle)));

var degToCard = function (deg) {
    if (deg > 11.25 && deg < 33.75) {
        return "NNE";
    } else if (deg > 33.75 && deg < 56.25) {
        return "ENE";
    } else if (deg > 56.25 && deg < 78.75) {
        return "E";
    } else if (deg > 78.75 && deg < 101.25) {
        return "ESE";
    } else if (deg > 101.25 && deg < 123.75) {
        return "ESE";
    } else if (deg > 123.75 && deg < 146.25) {
        return "SE";
    } else if (deg > 146.25 && deg < 168.75) {
        return "SSE";
    } else if (deg > 168.75 && deg < 191.25) {
        return "S";
    } else if (deg > 191.25 && deg < 213.75) {
        return "SSW";
    } else if (deg > 213.75 && deg < 236.25) {
        return "SW";
    } else if (deg > 236.25 && deg < 258.75) {
        return "WSW";
    } else if (deg > 258.75 && deg < 281.25) {
        return "W";
    } else if (deg > 281.25 && deg < 303.75) {
        return "WNW";
    } else if (deg > 303.75 && deg < 326.25) {
        return "NW";
    } else if (deg > 326.25 && deg < 348.75) {
        return "NNW";
    } else {
        return "N";
    }
};
