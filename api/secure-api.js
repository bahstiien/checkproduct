import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bikeInfo, productUrl, comment } = req.body;

    // Récupérer les variables d'environnement
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/tblhAA1vA7rYLVhvQ`;

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    const perplexityUrl = 'https://api.perplexity.ai/endpoint';

    const airtableOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            records: [
                {
                    fields: {
                        "Bike Info": bikeInfo,
                        "Product URL": productUrl,
                        "Comment": comment
                    }
                }
            ]
        })
    };

    const perplexityOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bikeInfo,
            productUrl
        })
    };

    try {
        // Appel à l'API Perplexity
        const perplexityResponse = await fetch(perplexityUrl, perplexityOptions);
        if (!perplexityResponse.ok) {
            const errorDetails = await perplexityResponse.text();
            throw new Error(`Perplexity API Error: ${perplexityResponse.status} - ${errorDetails}`);
        }

        const perplexityData = await perplexityResponse.json();
        console.log('Perplexity Response:', perplexityData);

        // Appel à l'API Airtable
        const airtableResponse = await fetch(airtableUrl, airtableOptions);
        if (airtableResponse.ok) {
            res.status(200).json({ message: 'Bug report submitted successfully!', perplexityResponse: perplexityData });
        } else {
            const errorData = await airtableResponse.json();
            res.status(400).json({ message: `Failed to submit bug report: ${errorData.error.message}` });
        }
    } catch (error) {
        console.error('Error while processing the request:', error);
        res.status(500).json({ message: 'An unexpected error occurred.', error: error.message });
    }
}
