export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bikeInfo, productUrl, comment } = req.body;

    // Récupérer les variables d'environnement
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/tblhAA1vA7rYLVhvQ`;

    const options = {
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

    try {
        const response = await fetch(airtableUrl, options);
        if (response.ok) {
            res.status(200).json({ message: 'Bug report submitted successfully!' });
        } else {
            const errorData = await response.json();
            res.status(400).json({ message: `Failed to submit bug report: ${errorData.error.message}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred.', error: error.message });
    }
}
