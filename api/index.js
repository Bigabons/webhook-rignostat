export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ID: phoneNumber, COMMENTS: summary } = req.body;
    
    // Szukamy leada po TITLE (numer telefonu)
    const leadSearchUrl = `https://srmo.bitrix24.pl/rest/73/udb28kntpkhnwq/crm.lead.list`;
    const searchResponse = await fetch(leadSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: { 'TITLE': phoneNumber }
      })
    });
    const leadData = await searchResponse.json();

    if (!leadData.result || leadData.result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Lead not found'
      });
    }

    const leadId = leadData.result[0].ID;

    // Aktualizujemy leada
    const updateUrl = `https://srmo.bitrix24.pl/rest/73/udb28kntpkhnwq/crm.lead.update`;
    await fetch(updateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: leadId,
        fields: {
          'COMMENTS': summary
        },
        params: { "REGISTER_SONET_EVENT": "Y" }
      })
    });

    return res.status(200).json({
      status: 'success',
      message: 'Lead updated',
      details: {
        leadId,
        phoneNumber,
        summary
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
