let lifeExpectancy = 0;
const nameInput = document.getElementById('name-input');
const countryInput = document.getElementById('country');
const form = document.getElementById('input-form');
const doomsdayHeader = document.getElementById('doomsday-name');
const doomsdayTime = document.getElementById('doomsday-date');
const doomsdayExplanation = document.getElementById('doomsday-explanation');

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        let countryCodes = data.map(country => country.cca3)
        countryCodes = countryCodes.sort()
        const countryInput = document.getElementById('country');
        countryCodes.forEach(code => {
            const option = document.createElement('option');
            option.value = code;
            option.innerText = code;
            countryInput.appendChild(option);
        });
    });

const params = new URLSearchParams(new URL(window.location.href).search);
let doomEstimate;

if (params.get("birthday")) {
    form.style.display = 'none';
    doomsdayHeader.textContent = `Doomsday ${params.get('name')}`
    fetch(`https://api.worldbank.org/v2/country/${params.get('country')}/indicator/SP.DYN.LE00.IN?format=json`)
        .then(response => response.json())
        .then(data => {
            lifeExpectancy = data[1].find((element) => element.value !== null).value;
            doomEstimate = new Date(params.get('birthday'))
            doomEstimate.setDate(doomEstimate.getDate() + (lifeExpectancy * 365.25))
            doomsdayExplanation.textContent = `Data based on life expectancy of ${Math.floor(lifeExpectancy*100)/100} years in ${params.get('country')}`;

            updateTime();
            setInterval(updateTime, 1000);
        });

}

function updateTime() {
    const now = new Date();
    const difference = doomEstimate - now;
    const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor(difference % (1000 * 60 * 60 * 24 * 365) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    doomsdayTime.textContent = `${years} years ${days} days ${hours}h ${minutes}m ${seconds}s`;
}