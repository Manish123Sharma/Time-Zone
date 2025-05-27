const apiKey = 'a8edf7ed12154dc0b660e24ca5561661';

const addressInput = document.getElementById('address-input');
const findTimezoneBtn = document.getElementById('find-timezone-btn');
const errorMessageEl = document.getElementById('error-message');

// Result display elements
const resultBox = document.getElementById('result-box');
const timezoneEl = document.getElementById('user-timezone');
const latEl = document.getElementById('user-lat');
const lonEl = document.getElementById('user-lon');
const offsetStdEl = document.getElementById('user-offset-std');
const offsetStdSecEl = document.getElementById('user-offset-std-sec');
const offsetDstEl = document.getElementById('user-offset-dst');
const offsetDstSecEl = document.getElementById('user-offset-dst-sec');
const countryEl = document.getElementById('user-country');
const postcodeEl = document.getElementById('user-postcode');
const cityEl = document.getElementById('user-city');

async function fetchCoordinates(address) {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch coordinates.');
    const data = await response.json();
    if (data.results.length > 0) {
        return {
            lat: data.results[0].lat,
            lon: data.results[0].lon
        };
    } else {
        throw new Error('Address not found.');
    }
}

findTimezoneBtn.addEventListener('click', async () => {
    const address = addressInput.value.trim();
    errorMessageEl.textContent = '';
    resultBox.style.display = 'none';

    if (!address) {
        errorMessageEl.textContent = 'Please enter a valid address.';
        return;
    }

    try {
        const { lat, lon } = await fetchCoordinates(address);
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch timezone data.');

        const data = await response.json();
        const result = data.results[0];

        timezoneEl.textContent = result.timezone.name || 'N/A';
        latEl.textContent = lat.toFixed(5);
        lonEl.textContent = lon.toFixed(5);
        offsetStdEl.textContent = result.timezone.offset_STD || 'N/A';
        offsetStdSecEl.textContent = result.timezone.offset_STD_seconds ?? 'N/A';
        offsetDstEl.textContent = result.timezone.offset_DST || 'N/A';
        offsetDstSecEl.textContent = result.timezone.offset_DST_seconds ?? 'N/A';
        countryEl.textContent = result.country || 'N/A';
        postcodeEl.textContent = result.postcode || 'N/A';
        cityEl.textContent = result.city || 'N/A';

        resultBox.style.display = 'block';
    } catch (error) {
        errorMessageEl.textContent = error.message;
    }
});
