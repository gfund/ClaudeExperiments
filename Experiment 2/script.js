// Weather Dashboard JavaScript - Live Data from Open-Meteo API

// Greer, SC coordinates
const LATITUDE = 34.9387;
const LONGITUDE = -82.2270;
const LOCATION_NAME = 'Greer';

// Weather code descriptions
const weatherCodes = {
    0: { description: 'Clear sky', icon: 'fa-sun', isDay: 'fa-sun', isNight: 'fa-moon' },
    1: { description: 'Mainly clear', icon: 'fa-sun', isDay: 'fa-sun', isNight: 'fa-moon' },
    2: { description: 'Partly cloudy', icon: 'fa-cloud-sun', isDay: 'fa-cloud-sun', isNight: 'fa-cloud-moon' },
    3: { description: 'Overcast', icon: 'fa-cloud', isDay: 'fa-cloud', isNight: 'fa-cloud' },
    45: { description: 'Foggy', icon: 'fa-smog', isDay: 'fa-smog', isNight: 'fa-smog' },
    48: { description: 'Depositing rime fog', icon: 'fa-smog', isDay: 'fa-smog', isNight: 'fa-smog' },
    51: { description: 'Light drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    53: { description: 'Moderate drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    55: { description: 'Dense drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    56: { description: 'Freezing drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    57: { description: 'Dense freezing drizzle', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    61: { description: 'Slight rain', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    63: { description: 'Moderate rain', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    65: { description: 'Heavy rain', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    66: { description: 'Freezing rain', icon: 'fa-cloud-rain', isDay: 'fa-cloud-rain', isNight: 'fa-cloud-rain' },
    67: { description: 'Heavy freezing rain', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    71: { description: 'Slight snow', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    73: { description: 'Moderate snow', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    75: { description: 'Heavy snow', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    77: { description: 'Snow grains', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    80: { description: 'Slight rain showers', icon: 'fa-cloud-sun-rain', isDay: 'fa-cloud-sun-rain', isNight: 'fa-cloud-moon-rain' },
    81: { description: 'Moderate rain showers', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    82: { description: 'Violent rain showers', icon: 'fa-cloud-showers-heavy', isDay: 'fa-cloud-showers-heavy', isNight: 'fa-cloud-showers-heavy' },
    85: { description: 'Slight snow showers', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    86: { description: 'Heavy snow showers', icon: 'fa-snowflake', isDay: 'fa-snowflake', isNight: 'fa-snowflake' },
    95: { description: 'Thunderstorm', icon: 'fa-cloud-bolt', isDay: 'fa-cloud-bolt', isNight: 'fa-cloud-bolt' },
    96: { description: 'Thunderstorm with hail', icon: 'fa-cloud-bolt', isDay: 'fa-cloud-bolt', isNight: 'fa-cloud-bolt' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'fa-cloud-bolt', isDay: 'fa-cloud-bolt', isNight: 'fa-cloud-bolt' }
};

// Day names
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
    initCardEffects();
    initHourlyScroll();

    // Refresh data every 10 minutes
    setInterval(fetchWeatherData, 600000);
});

// Fetch weather data from Open-Meteo
async function fetchWeatherData() {
    try {
        const params = new URLSearchParams({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            current: [
                'temperature_2m',
                'relative_humidity_2m',
                'apparent_temperature',
                'is_day',
                'precipitation',
                'weather_code',
                'wind_speed_10m',
                'wind_direction_10m',
                'wind_gusts_10m'
            ].join(','),
            hourly: [
                'temperature_2m',
                'precipitation_probability',
                'weather_code',
                'is_day'
            ].join(','),
            daily: [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'precipitation_probability_max',
                'precipitation_sum',
                'sunrise',
                'sunset',
                'uv_index_max'
            ].join(','),
            temperature_unit: 'fahrenheit',
            wind_speed_unit: 'mph',
            precipitation_unit: 'inch',
            timezone: 'America/New_York',
            forecast_days: 10
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        updateUI(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Unable to load weather data. Please try again later.');
    }
}

// Update all UI elements with fetched data
function updateUI(data) {
    updateHeader(data);
    updateHourlyForecast(data);
    updateDailyForecast(data);
    updateCurrentConditions(data);
    updateSunset(data);
    console.log('Weather data updated:', new Date().toLocaleTimeString());
}

// Update header section
function updateHeader(data) {
    const current = data.current;
    const daily = data.daily;

    // City name
    document.querySelector('.city-name').textContent = LOCATION_NAME;

    // Current temperature
    document.querySelector('.current-temp').textContent = `${Math.round(current.temperature_2m)}°`;

    // Feels like
    document.querySelector('.feels-like-header').textContent = `Feels Like: ${Math.round(current.apparent_temperature)}°`;

    // High/Low
    document.querySelector('.high-low').textContent = `H:${Math.round(daily.temperature_2m_max[0])}° L:${Math.round(daily.temperature_2m_min[0])}°`;
}

// Update hourly forecast
function updateHourlyForecast(data) {
    const hourly = data.hourly;
    const container = document.querySelector('.hourly-container');
    const now = new Date();
    const currentHour = now.getHours();

    // Find current hour index in the data
    const currentDateStr = now.toISOString().split('T')[0];
    let startIndex = hourly.time.findIndex(t => {
        const d = new Date(t);
        return d.getHours() >= currentHour && t.startsWith(currentDateStr);
    });

    if (startIndex === -1) startIndex = 0;

    // Get sunrise/sunset for today
    const sunset = new Date(data.daily.sunset[0]);
    const sunrise = new Date(data.daily.sunrise[0]);

    let html = '';

    for (let i = 0; i < 12; i++) {
        const idx = startIndex + i;
        if (idx >= hourly.time.length) break;

        const time = new Date(hourly.time[idx]);
        const temp = Math.round(hourly.temperature_2m[idx]);
        const precip = hourly.precipitation_probability[idx];
        const weatherCode = hourly.weather_code[idx];
        const isDay = hourly.is_day[idx];

        const weather = weatherCodes[weatherCode] || weatherCodes[0];
        const icon = isDay ? weather.isDay : weather.isNight;

        // Check if this hour is sunset
        const isSunsetHour = time.getHours() === sunset.getHours() &&
                            time.getDate() === sunset.getDate();

        let timeLabel = i === 0 ? 'Now' : formatHour(time);

        if (isSunsetHour) {
            html += `
                <div class="hour sunset-hour">
                    <span class="time">${formatTime(sunset)}</span>
                    <i class="fa-solid fa-sun weather-icon sunset-icon"></i>
                    <span class="label-text">Sunset</span>
                </div>
            `;
        }

        html += `
            <div class="hour">
                <span class="time">${timeLabel}</span>
                <i class="fa-solid ${icon} weather-icon"></i>
                ${precip > 0 ? `<span class="precip">${precip}%</span>` : ''}
                <span class="temp">${temp}°</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Update 10-day forecast
function updateDailyForecast(data) {
    const daily = data.daily;
    const container = document.querySelector('.forecast-list');

    // Find min and max temps for the range
    const allTemps = [...daily.temperature_2m_min, ...daily.temperature_2m_max];
    const minTemp = Math.min(...allTemps);
    const maxTemp = Math.max(...allTemps);
    const tempRange = maxTemp - minTemp;

    let html = '';

    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? 'Today' : dayNames[date.getDay()];
        const weatherCode = daily.weather_code[i];
        const high = Math.round(daily.temperature_2m_max[i]);
        const low = Math.round(daily.temperature_2m_min[i]);
        const precip = daily.precipitation_probability_max[i];

        const weather = weatherCodes[weatherCode] || weatherCodes[0];

        // Calculate bar position and width
        const barLeft = ((low - minTemp) / tempRange) * 100;
        const barWidth = ((high - low) / tempRange) * 100;

        // Icon color class
        let iconClass = '';
        if (weather.icon === 'fa-sun') iconClass = 'sunny';
        else if (weather.icon.includes('rain') || weather.icon.includes('snow')) iconClass = 'rainy';

        html += `
            <div class="forecast-day">
                <span class="day-name">${dayName}</span>
                <i class="fa-solid ${weather.icon} weather-icon ${iconClass}"></i>
                ${precip > 30 ? `<span class="precip">${precip}%</span>` : '<span class="precip"></span>'}
                <span class="low-temp">${low}°</span>
                <div class="temp-bar">
                    <div class="bar-fill" style="left: ${barLeft}%; width: ${barWidth}%;"></div>
                    ${i === 0 ? '<div class="current-marker" style="left: ' + getCurrentTempPosition(data, minTemp, tempRange) + '%;"></div>' : ''}
                </div>
                <span class="high-temp">${high}°</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Get current temperature position on the bar
function getCurrentTempPosition(data, minTemp, tempRange) {
    const currentTemp = data.current.temperature_2m;
    return ((currentTemp - minTemp) / tempRange) * 100;
}

// Update current conditions cards
function updateCurrentConditions(data) {
    const current = data.current;
    const daily = data.daily;

    // Wind
    document.querySelector('.wind-speed').textContent = Math.round(current.wind_speed_10m);
    document.querySelector('.gusts').textContent = `Gusts: ${Math.round(current.wind_gusts_10m)} mph ${getWindDirection(current.wind_direction_10m)}`;
    updateWindArrow(current.wind_direction_10m);

    // Humidity
    document.querySelector('.humidity-value').textContent = `${current.relative_humidity_2m}%`;

    // Calculate approximate dew point
    const dewPoint = calculateDewPoint(current.temperature_2m, current.relative_humidity_2m);
    document.querySelector('.dew-point').textContent = `The dew point is ${Math.round(dewPoint)}°`;

    // Feels like card
    document.querySelector('.feels-temp').textContent = `${Math.round(current.apparent_temperature)}°`;
    document.querySelector('.actual-temp').textContent = `Actual: ${Math.round(current.temperature_2m)}°`;
    const tempDiff = Math.round(current.apparent_temperature - current.temperature_2m);
    document.querySelector('.feels-diff').textContent = `${tempDiff > 0 ? '+' : ''}${tempDiff}°`;

    // Update feels like description
    const feelsDesc = document.querySelector('.feels-description');
    if (current.apparent_temperature < current.temperature_2m) {
        feelsDesc.textContent = 'Wind is making it feel colder.';
    } else if (current.apparent_temperature > current.temperature_2m) {
        feelsDesc.textContent = 'Humidity is making it feel warmer.';
    } else {
        feelsDesc.textContent = 'Similar to the actual temperature.';
    }

    // UV Index
    const uvIndex = Math.round(daily.uv_index_max[0]);
    document.querySelector('.uv-value').textContent = uvIndex;
    document.querySelector('.uv-label').textContent = getUVLabel(uvIndex);
    document.querySelector('.uv-advice').textContent = getUVAdvice(uvIndex);
    updateUVIndicator(uvIndex);

    // Precipitation
    const precipToday = daily.precipitation_sum[0] || 0;
    const precipTomorrow = daily.precipitation_sum[1] || 0;
    document.querySelector('.precip-value').textContent = `${precipToday.toFixed(1)}"`;
    document.querySelector('.precip-expected').innerHTML = `${precipTomorrow.toFixed(1)}" expected in<br>next 24h.`;

    // Update weather alert based on conditions
    updateWeatherAlert(data);
}

// Update sunset card
function updateSunset(data) {
    const sunset = new Date(data.daily.sunset[0]);
    const sunrise = new Date(data.daily.sunrise[1]); // Tomorrow's sunrise

    const now = new Date();
    const isPastSunset = now > sunset;

    const titleEl = document.querySelector('.sunset .card-title');
    const timeEl = document.querySelector('.sunset-time');

    if (isPastSunset) {
        titleEl.innerHTML = '<i class="fa-solid fa-sun"></i> SUNRISE';
        timeEl.textContent = formatTime(sunrise);
    } else {
        titleEl.innerHTML = '<i class="fa-solid fa-sun"></i> SUNSET';
        timeEl.textContent = formatTime(sunset);
    }

    // Update sun arc position
    updateSunArc(data);
}

// Update sun arc SVG
function updateSunArc(data) {
    const sunrise = new Date(data.daily.sunrise[0]);
    const sunset = new Date(data.daily.sunset[0]);
    const now = new Date();

    const sunCircle = document.querySelector('.arc-svg circle');
    if (!sunCircle) return;

    if (now < sunrise || now > sunset) {
        // Night time - sun below horizon
        sunCircle.setAttribute('cx', now < sunrise ? 10 : 90);
        sunCircle.setAttribute('cy', 50);
        sunCircle.setAttribute('fill', '#666');
    } else {
        // Day time - calculate position on arc
        const totalDayTime = sunset - sunrise;
        const elapsed = now - sunrise;
        const progress = elapsed / totalDayTime;

        const x = 5 + progress * 90;
        const y = 45 - Math.sin(progress * Math.PI) * 35;

        sunCircle.setAttribute('cx', x);
        sunCircle.setAttribute('cy', y);
        sunCircle.setAttribute('fill', '#FFD700');
    }
}

// Update weather alert card
function updateWeatherAlert(data) {
    const current = data.current;
    const weatherCode = current.weather_code;
    const temp = current.temperature_2m;

    const alertCard = document.querySelector('.severe-weather');
    const alertHeader = alertCard.querySelector('.card-header div strong');
    const alertText = alertCard.querySelector('.alert-text');
    const alertCount = alertCard.querySelector('.alert-count');

    // Check for severe conditions
    let alertType = null;
    let alertMessage = '';

    if (weatherCode >= 95) {
        alertType = 'Thunderstorm Warning';
        alertMessage = 'Thunderstorms are occurring in your area. Seek shelter indoors.';
    } else if (weatherCode >= 71 && weatherCode <= 77) {
        alertType = 'Winter Weather';
        alertMessage = 'Snow is falling in your area. Travel may be hazardous.';
    } else if (weatherCode >= 66 && weatherCode <= 67) {
        alertType = 'Ice Storm Warning';
        alertMessage = 'Freezing rain is occurring. Roads may be icy.';
    } else if (temp <= 32) {
        alertType = 'Freeze Warning';
        alertMessage = `Current temperature is ${Math.round(temp)}°F. Protect sensitive plants and exposed pipes.`;
    } else if (temp >= 100) {
        alertType = 'Excessive Heat Warning';
        alertMessage = `Current temperature is ${Math.round(temp)}°F. Stay hydrated and limit outdoor activities.`;
    }

    if (alertType) {
        alertHeader.textContent = alertType;
        alertText.textContent = alertMessage;
        alertCount.textContent = '1 alert';
        alertCard.style.display = 'block';
    } else {
        // Show current conditions instead
        const weather = weatherCodes[weatherCode] || weatherCodes[0];
        alertHeader.textContent = 'Current Conditions';
        alertText.textContent = weather.description + '. No active weather alerts for your area.';
        alertCount.textContent = '0 alerts';
    }
}

// Helper functions
function formatHour(date) {
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}${ampm}`;
}

function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')}${ampm}`;
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function updateWindArrow(degrees) {
    const arrow = document.querySelector('.wind-arrow');
    if (arrow) {
        arrow.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
    }
}

function calculateDewPoint(tempF, humidity) {
    // Convert to Celsius for calculation
    const tempC = (tempF - 32) * 5 / 9;
    const dewPointC = tempC - ((100 - humidity) / 5);
    // Convert back to Fahrenheit
    return (dewPointC * 9 / 5) + 32;
}

function getUVLabel(index) {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    if (index <= 10) return 'Very High';
    return 'Extreme';
}

function getUVAdvice(index) {
    if (index <= 2) return 'No protection needed.';
    if (index <= 5) return 'Use sun protection.';
    if (index <= 7) return 'Protection essential.';
    if (index <= 10) return 'Extra protection needed.';
    return 'Avoid sun exposure.';
}

function updateUVIndicator(index) {
    const indicator = document.querySelector('.uv-indicator');
    if (indicator) {
        // UV index typically maxes at 11+
        const position = Math.min(index / 11, 1) * 100;
        indicator.style.left = `${position}%`;
    }
}

function showError(message) {
    console.error(message);
    // Could add a toast notification here
}

// Card hover effects
function initCardEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.transition = 'transform 0.2s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Horizontal scroll for hourly forecast
function initHourlyScroll() {
    const hourlyContainer = document.querySelector('.hourly-container');
    if (hourlyContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        hourlyContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            hourlyContainer.style.cursor = 'grabbing';
            startX = e.pageX - hourlyContainer.offsetLeft;
            scrollLeft = hourlyContainer.scrollLeft;
        });

        hourlyContainer.addEventListener('mouseleave', () => {
            isDown = false;
            hourlyContainer.style.cursor = 'grab';
        });

        hourlyContainer.addEventListener('mouseup', () => {
            isDown = false;
            hourlyContainer.style.cursor = 'grab';
        });

        hourlyContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - hourlyContainer.offsetLeft;
            const walk = (x - startX) * 2;
            hourlyContainer.scrollLeft = scrollLeft - walk;
        });
    }
}

// Alert click handler
document.querySelector('.severe-weather')?.addEventListener('click', () => {
    const alertText = document.querySelector('.alert-text').textContent;
    alert(alertText);
});

console.log('Weather Dashboard initialized with Open-Meteo API');
