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

// Fetch JSON data
async function fetchData() {
    try {
        const response = await fetch('data_bike_flux.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
}

// Clean URL function
function cleanUrl(url) {
    return url.split('?')[0];
}

// Function to call secure API route
async function callSecureApi(bikeInfo, productUrl, comment) {
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
        return result.message;
    } catch (error) {
        console.error('Error calling secure API:', error);
        return 'An error occurred while calling the secure API.';
    }
}

// Form submission logic
document.getElementById('submit-button').addEventListener('click', async () => {
    const bikeInfo = document.getElementById('bike-info').value;
    const productUrl = document.getElementById('product-url').value;

    if (!bikeInfo || !productUrl) {
        document.getElementById('response').innerText = 'Please fill out all fields.';
        return;
    }

    const jsonData = await fetchData();
    const cleanedProductUrl = cleanUrl(productUrl.trim());
    let productFound = false;

    if (jsonData) {
        productFound = jsonData.find(item => cleanUrl(item.link) === cleanedProductUrl);
    }

    const apiResponse = await callSecureApi(bikeInfo, cleanedProductUrl, '');
    document.getElementById('response').innerText = apiResponse;

    if (productFound) {
        document.getElementById('response').innerText += '\nProduct found in JSON data.';
    }
});

// Bug report form logic
document.getElementById('report-bug-link').addEventListener('click', () => {
    document.getElementById('bug-form').style.display = 'block';
});

document.getElementById('submit-bug-button').addEventListener('click', async () => {
    const bikeInfo = document.getElementById('bike-info').value;
    const productUrl = document.getElementById('product-url').value;
    const comment = document.getElementById('comment').value;

    const apiResponse = await callSecureApi(bikeInfo, productUrl, comment);
    alert(apiResponse);
});
