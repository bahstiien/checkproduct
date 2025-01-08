
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

// Perplexity API call
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

        const result = await response.json();
        return result.message;
    } catch (error) {
        console.error('Error calling Perplexity API:', error);
        return 'An error occurred while calling the Perplexity API.';
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

    const apiResponse = await callPerplexityApi(bikeInfo, productUrl);
    document.getElementById('response').innerText = apiResponse;
});

// Bug report form logic using secure-api
document.getElementById('submit-bug-button').addEventListener('click', async () => {
    const bikeInfo = document.getElementById('bike-info').value;
    const productUrl = document.getElementById('product-url').value;
    const comment = document.getElementById('comment').value;

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
        alert(result.message);
    } catch (error) {
        alert('An error occurred while submitting the bug report.');
    }
});
