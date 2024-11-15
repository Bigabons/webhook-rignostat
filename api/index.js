export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ID: phoneNumber, COMMENTS: summary } = req.body;
    
    console.log('Received phone number:', phoneNumber);

    // Pobierz wszystkie leady bez filtra
    const leadSearchUrl = `https://srmo.bitrix24.pl/rest/73/udb28kntpkhnwq/crm.lead.list`;
    const searchResponse = await fetch(leadSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const leadData = await searchResponse.json();
    console.log('All leads:', leadData);

    // Sprawdź czy mamy jakieś leady i wyświetl ich TITLE
    if (leadData.result && leadData.result.length > 0) {
      const titles = leadData.result.map(lead => lead.TITLE);
      console.log('Available lead titles:', titles);
    }

    return res.status(200).json({
      status: 'debug',
      leads: leadData,
      searchedPhone: phoneNumber
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
}
