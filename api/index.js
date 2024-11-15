export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ID: phoneNumber, COMMENTS: summary } = req.body;
    
    console.log('Otrzymane dane:', {
      numer_telefonu: phoneNumber,
      podsumowanie: summary
    });

    return res.status(200).json({
      status: 'success',
      received_data: {
        numer_telefonu: phoneNumber,
        podsumowanie: summary
      }
    });

  } catch (error) {
    console.error('Błąd:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
