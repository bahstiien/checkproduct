import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.setHeader('Access-Control-Allow-Origin', '*').status(405).json({ message: 'Method Not Allowed' });
    }

    // Gestion des en-têtes CORS pour les pré-requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(204).end();
    }

    const { bikeInfo, productUrl, comment } = req.body;

    // Appel direct à l'API Perplexity depuis le backend
    const perplexityUrl = 'https://api.perplexity.ai/endpoint';

    try {
        // Appel à l'API Perplexity
        const perplexityResponse = await fetch(perplexityUrl, {
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
            return res.setHeader('Access-Control-Allow-Origin', '*').status(perplexityResponse.status).json({ message: `Perplexity API Error: ${errorDetails}` });
        }

        const perplexityData = await perplexityResponse.json();

        // Retourner la réponse de Perplexity au frontend
        return res.setHeader('Access-Control-Allow-Origin', '*').status(200).json({
            message: 'Perplexity API call successful!',
            data: perplexityData
        });
    } catch (error) {
        console.error('Error while calling Perplexity API:', error);
        return res.setHeader('Access-Control-Allow-Origin', '*').status(500).json({ message: 'An unexpected error occurred while calling Perplexity.', error: error.message });
    }
}
