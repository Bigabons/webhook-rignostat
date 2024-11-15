export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle POST requests
    if (req.method === 'POST') {
        try {
            const data = req.body;
            console.log('Received data:', data);
            
            return res.status(200).json({
                status: 'success',
                message: 'Data received',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Return 405 for non-POST requests
    return res.status(405).json({
        status: 'error',
        message: 'Method not allowed'
    });
}
