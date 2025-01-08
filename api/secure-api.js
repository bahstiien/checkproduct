import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Ajout des en-têtes CORS pour toutes les réponses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Gestion des pré-requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
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
