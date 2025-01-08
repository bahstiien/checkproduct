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
        return res.status(200).json({
            message: 'Perplexity API call successful!',
            data: perplexityData
        });
    } catch (error) {
        console.error('Error while calling Perplexity API:', error);
        return res.status(500).json({ message: 'An unexpected error occurred while calling Perplexity.', error: error.message });
    }
}
