// Weather Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Update time display
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);

    // Animate snow stopping countdown
    initSnowCountdown();

    // Add hover effects to cards
    initCardEffects();

    // Initialize hourly forecast scroll
    initHourlyScroll();
});

// Update current time in relevant places
function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Update "Now" label if needed
    const nowLabel = document.querySelector('.hour:first-child .time');
    if (nowLabel && nowLabel.textContent === 'Now') {
        // Keep as "Now" for clarity
    }
}

// Snow countdown timer simulation
function initSnowCountdown() {
    let minutes = 11;
    const snowText = document.querySelector('.snow-stopping p');

    const countdownInterval = setInterval(() => {
        minutes--;
        if (minutes <= 0) {
            snowText.textContent = 'Snow has stopped.';
            clearInterval(countdownInterval);
            updatePrecipitationBars(0);
        } else {
            snowText.textContent = `Snow is expected to stop in ${minutes} min.`;
            updatePrecipitationBars(minutes);
        }
    }, 60000); // Update every minute (real-time simulation)
}

// Update precipitation timeline bars
function updatePrecipitationBars(remainingMinutes) {
    const bars = document.querySelectorAll('.timeline-bars .bar');
    const totalBars = bars.length;

    bars.forEach((bar, index) => {
        const progress = index / totalBars;
        const minuteMark = progress * 50;

        if (minuteMark > remainingMinutes) {
            bar.style.height = '0%';
        }
    });
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
        // Enable smooth scrolling with mouse drag
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

// Animate wind compass arrow (simulates changing wind direction)
function animateWindArrow() {
    const arrow = document.querySelector('.wind-arrow');
    if (arrow) {
        // ENE direction is roughly 67.5 degrees from North
        const baseAngle = 67.5;
        const variation = (Math.random() - 0.5) * 10; // ±5 degrees variation
        arrow.style.transform = `translateX(-50%) rotate(${baseAngle + variation}deg)`;
    }
}

// Update wind animation periodically
setInterval(animateWindArrow, 3000);

// Sunrise/Sunset arc animation
function updateSunPosition() {
    const sunCircle = document.querySelector('.arc-svg circle');
    if (sunCircle) {
        const now = new Date();
        const sunriseHour = 7; // 7 AM
        const sunsetHour = 17.85; // 5:51 PM

        const currentHour = now.getHours() + now.getMinutes() / 60;

        if (currentHour >= sunriseHour && currentHour <= sunsetHour) {
            const dayProgress = (currentHour - sunriseHour) / (sunsetHour - sunriseHour);
            // Map progress to arc position (x: 5 to 95, y follows parabola)
            const x = 5 + dayProgress * 90;
            const y = 45 - Math.sin(dayProgress * Math.PI) * 35;
            sunCircle.setAttribute('cx', x);
            sunCircle.setAttribute('cy', y);
        }
    }
}

// Initial sun position update
updateSunPosition();

// Alert click handler
document.querySelector('.severe-weather')?.addEventListener('click', () => {
    alert('Ice Storm Warning\n\nThese conditions are expected to last until 1:00 PM, Monday, January 26.\n\nStay safe and avoid unnecessary travel.');
});

// Map interaction
document.querySelector('.precipitation-map')?.addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(0);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(0);
    console.log(`Map clicked at: ${x}%, ${y}%`);
});

// Temperature unit toggle (Fahrenheit/Celsius)
let isFahrenheit = true;

function toggleTemperatureUnit() {
    isFahrenheit = !isFahrenheit;
    updateAllTemperatures();
}

function fahrenheitToCelsius(f) {
    return Math.round((f - 32) * 5 / 9);
}

function celsiusToFahrenheit(c) {
    return Math.round(c * 9 / 5 + 32);
}

function updateAllTemperatures() {
    // This would update all temperature displays
    // For demo purposes, temperatures are static
    console.log(`Temperatures now in ${isFahrenheit ? 'Fahrenheit' : 'Celsius'}`);
}

// Accessibility: Keyboard navigation for cards
document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'region');

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.click();
        }
    });
});

// Log initialization
console.log('Weather Dashboard initialized');
