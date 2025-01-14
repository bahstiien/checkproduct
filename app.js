// Password verification logic
const correctPassword = "alltricks2025";

window.onload = () => {
    if (localStorage.getItem('passwordVerified') === 'true') {
        showMainContent();
    }
};

document.getElementById('submit-password').addEventListener('click', () => {
    const enteredPassword = document.getElementById('password').value;
    if (enteredPassword === correctPassword) {
        localStorage.setItem('passwordVerified', 'true');
        showMainContent();
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});

function showMainContent() {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'flex';
}

document.getElementById('password').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('submit-password').click();
    }
});

// Perplexity API call with detailed error handling
async function callPerplexityApi(bikeInfo, productUrl) {
    try {
        const response = await fetch('https://api.perplexity.ai/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_PERPLEXITY_API_KEY'
            },
            body: JSON.stringify({
                bikeInfo,
                productUrl
            })
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error: ${response.status} - ${errorDetails}`);
        }

        const result = await response.json();
        return result.message;
    } catch (error) {
        console.error('Error calling Perplexity API:', error);
        return `An error occurred: ${error.message}`;
    }
}

// Local JSON data fetch with corrected path
async function fetchData() {
    try {
        const response = await fetch('./data_bike_flux.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
}

// Form submission logic for Perplexity API
document.getElementById('submit-button').addEventListener('click', async () => {
    const bikeInfo = document.getElementById('bike-info').value;
    const productUrl = document.getElementById('product-url').value;

    if (!bikeInfo || !productUrl) {
        document.getElementById('response').innerText = 'Please fill out all fields.';
        return;
    }

    document.getElementById('response').innerText = 'Checking compatibility...';

    // Attempt to fetch JSON data
    const jsonData = await fetchData();
    if (jsonData) {
        console.log('JSON data found and loaded');
    } else {
        console.log('JSON data not found. Proceeding with Perplexity API call');
    }

    // Always call Perplexity API regardless of JSON fetch result
    const apiResponse = await callPerplexityApi(bikeInfo, productUrl);
    document.getElementById('response').innerText = apiResponse;
});

// Bug report form logic using Airtable API
document.getElementById('submit-bug-button').addEventListener('click', async () => {
    const bikeInfo = document.getElementById('bike-info').value;
    const productUrl = document.getElementById('product-url').value;
    const comment = document.getElementById('comment').value;

    if (!comment) {
        alert('Please add a comment before submitting.');
        return;
    }

    try {
        const response = await fetch('/api/secure-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bikeInfo,
                productUrl,
                comment
            })
        });

        const result = await response.json();
        alert(result.message || 'Bug report submitted successfully!');
    } catch (error) {
        alert('An error occurred while submitting the bug report.');
    }
});
