export default async function handler(req, res) {
    // Zezwól na CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Tylko metoda POST jest dozwolona' })
    }

    try {
        const data = req.body
        console.log('Otrzymane dane:', data)

        return res.status(200).json({
            status: 'success',
            message: 'Dane otrzymane poprawnie',
            receivedData: data
        })
    } catch (error) {
        console.error('Błąd:', error)
        return res.status(500).json({
            status: 'error',
            message: 'Wystąpił błąd podczas przetwarzania żądania'
        })
    }
}
