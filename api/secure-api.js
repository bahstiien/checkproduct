import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bikeInfo, productUrl, comment } = req.body;

    // Appel à l'API Perplexity depuis le backend
    try {
        const perplexityResponse = await fetch('https://api.perplexity.ai/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
            },
            body: JSON.stringify({
                bikeInfo,
                productUrl
            })
        });

        if (!perplexityResponse.ok) {
            const errorDetails = await perplexityResponse.text();
            return res.status(perplexityResponse.status).json({ message: `Perplexity API Error: ${errorDetails}` });
        }

        const perplexityData = await perplexityResponse.json();

        // Retourner la réponse de Perplexity au frontend
        res.status(200).json({
            message: 'Perplexity API call successful!',
            data: perplexityData
        });
    } catch (error) {
        console.error('Error while calling Perplexity API:', error);
        res.status(500).json({ message: 'An unexpected error occurred while calling Perplexity.', error: error.message });
    }

    // Appel à l'API Airtable
    try {
        const airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblhAA1vA7rYLVhvQ`;
        const airtableOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
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

        const airtableResponse = await fetch(airtableUrl, airtableOptions);
        if (airtableResponse.ok) {
            res.status(200).json({
                message: 'Bug report submitted successfully!',
                perplexityResponse: perplexityData
            });
        } else {
            const errorData = await airtableResponse.json();
            res.status(400).json({ message: `Failed to submit bug report: ${errorData.error.message}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred while submitting to Airtable.', error: error.message });
    }
}
