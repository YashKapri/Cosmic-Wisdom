// NEW: Run checkLoginState on page load
window.onload = function() {
    checkLoginState();
    getDailyMantra();
};

// ------------ NEW: AUTHENTICATION & UI LOGIC ---------------
// (This section is unchanged from before)

// Mock user data storage
const MOCK_USER_DB = 'cosmicUser';

// NEW: Show/Hide Modals
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// NEW: Mock Registration
function register() {
    const user = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        dob: document.getElementById('reg-dob').value,
        sign: document.getElementById('reg-sign').value,
        tob: document.getElementById('reg-tob').value,
        pob: document.getElementById('reg-pob').value,
    };
    if (!user.name || !user.dob || !user.sign || !user.tob || !user.pob) {
        alert("Please fill out all fields!");
        return;
    }
    localStorage.setItem(MOCK_USER_DB, JSON.stringify(user));
    closeModal('register-modal');
    showDashboard(user);
    updateHeader(user.name);
}

// NEW: Mock Login
function login() {
    const user = JSON.parse(localStorage.getItem(MOCK_USER_DB));
    if (user) {
        closeModal('login-modal');
        showDashboard(user);
        updateHeader(user.name);
    } else {
        alert("No user found. Please register.");
    }
}

// NEW: Logout
function logout() {
    localStorage.removeItem(MOCK_USER_DB);
    showPublicView();
    updateHeader(null);
}

// NEW: Check login state on page load
function checkLoginState() {
    const user = JSON.parse(localStorage.getItem(MOCK_USER_DB));
    if (user) {
        showDashboard(user);
        updateHeader(user.name);
    } else {
        showPublicView();
        updateHeader(null);
    }
}

// NEW: Update Header UI
function updateHeader(name) {
    if (name) {
        document.getElementById('auth-links').classList.add('hidden');
        document.getElementById('user-links').classList.remove('hidden');
        document.getElementById('welcome-msg').textContent = `Welcome, ${name}`;
    } else {
        document.getElementById('auth-links').classList.remove('hidden');
        document.getElementById('user-links').classList.add('hidden');
        document.getElementById('welcome-msg').textContent = '';
    }
}

// NEW: Show Dashboard View
function showDashboard(user) {
    document.getElementById('public-tools').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('dash-name').textContent = user.name;
    document.getElementById('dash-sign').textContent = user.sign.charAt(0).toUpperCase() + user.sign.slice(1);
    document.getElementById('dash-horoscope').textContent = horoscopes[user.sign] || "Your horoscope is being divined...";
    const lifePath = calculateLifePathFromDOB(user.dob);
    const dayNum = calculateDayNumFromDOB(user.dob);
    document.getElementById('dash-lifepath').textContent = lifePath;
    document.getElementById('dash-daynum').textContent = dayNum;
    document.getElementById('dash-birth-details').textContent = 
        `${user.dob} at ${user.tob} in ${user.pob}`;
}

// NEW: Show Public View
function showPublicView() {
    document.getElementById('public-tools').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// ------------ NEW: SPIRITUAL ENHANCEMENTS ---------------
const mantras = [
    "I am aligned with the wisdom of the universe.",
    "I trust the path that is unfolding before me.",
    "I am open to receiving divine guidance.",
    "My energy is sacred, and I protect it.",
    "I am grateful for the lessons and blessings in my life.",
    "Peace begins within me.",
    "I radiate positive energy and attract positive outcomes.",
    "I am connected to all that is."
];
function getDailyMantra() {
    const randomIndex = Math.floor(Math.random() * mantras.length);
    document.getElementById('mantra-text').textContent = mantras[randomIndex];
}

// ------------ VEDIC CHART CALCULATIONS & SVG ---------------

// Map planet longitude (deg) to house number (1-12)
// This function remains the same.
function getHouseNumber(longitude) {
    // Calculates house number (1-12) from 0 to 360 degrees, mapping to 30-degree houses
    return ((Math.floor(longitude / 30)) % 12) + 1;
}

// SVG house coordinates in North Indian diamond style (starting from the top house 1)
const HOUSE_COORDS = [
    [125, 17],   // House 1 (Top middle)
    [220, 43],   // House 2 (Top right)
    [220, 130],  // House 3 (Right upper diamond)
    [220, 205],  // House 4 (Bottom right)
    [125, 233],  // House 5 (Bottom middle)
    [30, 205],   // House 6 (Bottom left)
    [30, 130],   // House 7 (Left upper diamond)
    [30, 43],    // House 8 (Top left)
    [78, 78],    // House 9 (Left up)
    [172, 78],   // House 10 (Right up)
    [172, 172],  // House 11 (Right down)
    [78, 172],   // House 12 (Left down)
];

// ##################################################################
// ###               UPDATED FUNCTION IS BELOW                    ###
// ##################################################################

// UPDATED: Now accepts lagnaRashi (the ascendant sign number, 1-12)
function renderNorthIndianChart(planets, lagnaRashi = 1) {
    let svg = `<svg width="250" height="250" viewBox="0 0 250 250" style="border:1px solid #ccc">`;
    svg += `
        <polygon points="125,17 220,130 125,233 30,130" style="fill:none;stroke:black;stroke-width:2"/>
        <polyline points="30,43 220,43" style="stroke:black;stroke-width:2;fill:none"/>
        <polyline points="30,205 220,205" style="stroke:black;stroke-width:2;fill:none"/>
        <polyline points="78,78 172,78 172,172 78,172 78,78" style="stroke:black;stroke-width:2;fill:none"/>
    `;
    
    // UPDATED: Draw Rashi (Zodiac Sign) numbers instead of house numbers
    for (let i = 0; i < 12; i++) {
        // This formula calculates the correct Rashi number for each house
        // (lagnaRashi + i - 1) % 12 gives a 0-11 index. +1 makes it 1-12.
        const rashiNumber = ( (lagnaRashi - 1 + i) % 12 ) + 1;
        
        svg += `<text x="${HOUSE_COORDS[i][0]}" y="${HOUSE_COORDS[i][1]}" font-size="11" text-anchor="middle" alignment-baseline="middle">${rashiNumber}</text>`;
    }

    // Place planets in houses
    for (const planet in planets) {
        let value = planets[planet];
        let longitude = 0;

        if (typeof value === "number") {
            longitude = value;
        } else if (Array.isArray(value) && value.length > 0) {
            longitude = Number(value[0]);
            if (isNaN(longitude)) {
                continue; // skip invalid values
            }
        } else {
            continue; // skip if value is invalid format
        }

        // IMPORTANT: We must calculate the house based on the Lagna's longitude
        // Get Lagna's longitude (should be the first planet)
        const lagnaLongitude = planets["Lagna"][0] || 0;

        // Calculate the house relative to the Lagna
        // 1. Normalize planet longitude relative to Lagna
        let relativeLongitude = longitude - lagnaLongitude;
        if (relativeLongitude < 0) {
            relativeLongitude += 360;
        }
        
        // 2. Get house number (1-12) based on this relative position
        let house = Math.floor(relativeLongitude / 30) + 1;
        
        let displayName = planet.replace('_longitude', '');
        let coords = HOUSE_COORDS[house - 1];

        // Add 'La' for Lagna for clarity
        if (displayName === "Lagna") displayName = "As (La)"; 

        svg += `<text x="${coords[0]}" y="${coords[1] + 14}" font-size="12" text-anchor="middle" fill="#c00" font-weight="bold">${displayName}</text>`;
    }
    svg += `</svg>`;
    return svg;
}

// ------------------- Horoscope Data -------------------
// (This section is unchanged)
const horoscopes = {
    aries: "Today will bring you new opportunities. Stay confident!",
    taurus: "Patience pays off today. Be calm and think before you act.",
    gemini: "Communication opens new doors. Stay flexible!",
    cancer: "Trust your intuition and spend time with loved ones.",
    leo: "Your leadership will shine today. Take bold steps.",
    virgo: "Focus on details. Organize your tasks for best results.",
    libra: "Seek balance and harmony. It’s a good day for relationships.",
    scorpio: "Powerful emotions surface. Channel your energy wisely.",
    sagittarius: "Adventure awaits! Be open to learning something new.",
    capricorn: "Hard work pays off. Persevere toward your goals.",
    aquarius: "Your creativity brings fresh ideas. Share them!",
    pisces: "Empathy and imagination guide you. Take time to dream."
};
function getHoroscope() {
    const sign = document.getElementById('sign-select').value;
    const result = document.getElementById('horoscope-result');
    if (!sign) {
        result.textContent = "Please select your zodiac sign!";
    } else {
        result.textContent = horoscopes[sign] || "Horoscope not found!";
    }
}

// ------------------- Compatibility Data -------------------
// (This section is unchanged)
const compatibilityMatrix = {
    aries_taurus: "Aries and Taurus can complement each other, but may have conflicts. Aries brings passion; Taurus brings patience.",
    aries_gemini: "Dynamic and stimulating, this pair is full of energy. Aries drives, Gemini adapts quickly.",
    // ... all other compatibility data
};
function checkCompatibility() {
    const sign1 = document.getElementById('zodiac1').value;
    const sign2 = document.getElementById('zodiac2').value;
    const result = document.getElementById('compatibility-result');
    if (!sign1 || !sign2) {
        result.textContent = "Please select both signs!";
    } else {
        const key = `${sign1}_${sign2}`;
        const reverseKey = `${sign2}_${sign1}`;
        result.textContent = compatibilityMatrix[key] || compatibilityMatrix[reverseKey] || "Compatibility info not found for this pair!";
    }
}

// ------------------- Numerology Calculators -------------------
// (This section is unchanged)
function reduceNumber(num) {
    if (num === 11 || num === 22 || num === 33) {
        return num;
    }
    let reduced = num;
    while (reduced > 9) {
        reduced = reduced.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return reduced;
}
function calculateLifePathFromDOB(dobString) {
    if (!dobString) return "N/A";
    const parts = dobString.split('-'); // [YYYY, MM, DD]
    if (parts.length !== 3) return "Invalid Date";
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return "Invalid Date";
    const reducedMonth = reduceNumber(month);
    const reducedDay = reduceNumber(day);
    const reducedYear = reduceNumber(year);
    let lifePath = reducedMonth + reducedDay + reducedYear;
    lifePath = reduceNumber(lifePath);
    return lifePath;
}
function calculateDayNumFromDOB(dobString) {
    if (!dobString) return "N/A";
    const parts = dobString.split('-');
    if (parts.length !== 3) return "Invalid Date";
    const day = parseInt(parts[2]);
    if (isNaN(day) || day < 1 || day > 31) return "Invalid Day";
    let userNumber = day;
    while (userNumber > 9) {
        userNumber = userNumber.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return userNumber;
}
function calculateLifePathNumber() {
    const dob = document.getElementById('dob').value;
    const result = document.getElementById('life-path-result'); 
    if (!dob) {
        result.textContent = "Please enter your date of birth!";
        return;
    }
    result.textContent = calculateLifePathFromDOB(dob);
}
function calculateDayNumber() {
    const dob = document.getElementById('dob').value;
    const result = document.getElementById('day-number-result'); 
    if (!dob) {
        result.textContent = "Please enter your date of birth!";
        return;
    }
    result.textContent = calculateDayNumFromDOB(dob);
}

// ------------------- Astrological Chart Fetcher -------------------
// (This section is unchanged)

// Function for the dashboard chart
async function generateUserChart() {
    const user = JSON.parse(localStorage.getItem(MOCK_USER_DB));
    if (!user) {
        alert("Please log in first.");
        return;
    }
    const result = document.getElementById('user-chart-result');
    await fetchChartData(user.dob, user.tob, user.pob, result);
}

// Function for the public/temporary chart
async function generateCharts() {
    const dob = document.getElementById('chart-dob').value;
    const tob = document.getElementById('chart-time').value;
    const location = document.getElementById('chart-location').value;
    const result = document.getElementById('chart-result');

    if (!dob || !tob || !location) {
        result.innerHTML = "<span style='color:red;'>Please enter your full birth details (date, time, location)!</span>";
        return;
    }
    await fetchChartData(dob, tob, location, result);
}

// ##################################################################
// ###               UPDATED FUNCTION IS BELOW                    ###
// ##################################################################

// UPDATED: This function now simulates a Libra Ascendant chart
async function fetchChartData(dob, tob, location, resultElement) {
    
    resultElement.innerHTML = "Connecting to the cosmos... Fetching chart data...";
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec delay

    // This is MOCK DATA for a Libra Ascendant (Sign #7)
    // Longitudes are 0-30 Aries, 30-60 Taurus, etc.
    // Libra is 180-210 degrees.
    const lagnaRashi = 7; // Libra
    const lagnaLongitude = 185.0; // 5 degrees into Libra

    const mockData = {
        planets: {
            // Planet: [Longitude]
            "Lagna": [lagnaLongitude],                 // House 1 (Libra)
            "Sun": [190.0],                            // House 1 (Libra)
            "Moon": [275.0],                           // House 4 (Capricorn)
            "Mars": [10.0],                            // House 7 (Aries)
            "Mercury": [215.0],                        // House 2 (Scorpio)
            "Jupiter": [100.0],                        // House 10 (Cancer)
            "Venus": [170.0],                          // House 12 (Virgo)
            "Saturn": [105.0],                         // House 10 (Cancer)
            "Rahu": [340.0],                           // House 6 (Pisces)
            "Ketu": [160.0]                            // House 12 (Virgo)
        },
        input: {
            date: dob,
            time: tob,
            location: location
        }
    };
    
    try {
        const data = mockData; 

        let chartTable = "<table border='1'><tr><th>Planet</th><th>Longitude (deg)</th></tr>";
        for (const planet in data.planets) {
            let value = data.planets[planet];
            if (typeof value === "number") {
                chartTable += `<tr><td>${planet}</td><td>${value.toFixed(2)}</td></tr>`;
            } else if (Array.isArray(value) && value.length > 0) {
                const numVal = Number(value[0]);
                if (!isNaN(numVal)) {
                    chartTable += `<tr><td>${planet}</td><td>${numVal.toFixed(2)}</td></tr>`;
                }
            }
        }
        chartTable += "</table>";

        // UPDATED: Pass the lagnaRashi to the render function
        const svgChart = renderNorthIndianChart(data.planets, lagnaRashi);

        resultElement.innerHTML = `
            <h3>North Indian D1 Chart (Demo)</h3>
            ${svgChart}
            <h3>D1 (Lagna) Data (Mock Data)</h3>
            ${chartTable}
            <pre>Input Details: ${JSON.stringify(data.input, null, 2)}</pre>
        `;
    } catch (err) {
        resultElement.innerHTML = `<span style='color:red;'>Error rendering chart: ${err.message}</span>`;
    }
}
// This is the updated function for your script.js

async function fetchChartData(dob, tob, location, resultElement) {
    
    resultElement.innerHTML = "Connecting to the cosmos... Fetching chart data...";
    
 // This is the REAL server call.
// It will call your Python server running on http://127.0.0.1:5000

try {
    // 1. Send the birth details to your Python server
    const response = await fetch("http://127.0.0.1:5000/api/v1/d1-chart", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            date: dob,
            time: tob,
            place: location // CHANGED: 'place' now holds the location string
            // REMOVED: hardcoded latitude and longitude
        })
    });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `Server returned status: ${response.status}`);
        }

        // 2. Get the REAL chart data back from Python!
        const data = await response.json();

        // 3. Draw the chart using the REAL data
        let chartTable = "<table border='1'><tr><th>Planet</th><th>Longitude (deg)</th></tr>";
        for (const planet in data.planets) {
            let value = data.planets[planet];
            if (Array.isArray(value) && value.length > 0) {
                const numVal = Number(value[0]);
                chartTable += `<tr><td>${planet}</td><td>${numVal.toFixed(2)}</td></tr>`;
            }
        }
        chartTable += "</table>";

        // 4. Get the Lagna Rashi number from the server
        const lagnaRashi = data.lagnaRashi || 1;

        // 5. Render the chart with the real data
        const svgChart = renderNorthIndianChart(data.planets, lagnaRashi);

        resultElement.innerHTML = `
            <h3>Your North Indian D1 Chart</h3>
            ${svgChart}
            <h3>D1 (Lagna) Data</h3>
            ${chartTable}
            <pre>Input Details: ${JSON.stringify(data.input, null, 2)}</pre>
        `;
        
    } catch (err) {
        // If it fails, it's likely the server isn't running
        resultElement.innerHTML = `<span style='color:red;'>
            <strong>API Error:</strong> ${err.message}<br><br>
            This means the Python server (server.py) is not running.
            Please run it in your terminal and try again.
        </span>`;
    }
}
