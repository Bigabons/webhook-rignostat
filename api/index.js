export default async function handler(req, res) {
  try {
    const { ID: phoneNumber, COMMENTS: summary } = req.body;
    console.log(`Otrzymane dane - Numer: ${phoneNumber}, Komentarz: ${summary}`);

    const leadSearchUrl = `https://amso.bitrix24.pl/rest/73/audb28knfpklnuwq/crm.lead.list`;
    const searchBody = {
      filter: { 'TITLE': phoneNumber }
    };

    const searchResponse = await fetch(leadSearchUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchBody)
    });

    const leadData = await searchResponse.json();
    console.log('Odpowiedź z wyszukiwania:', leadData);

    if (!leadData.result || leadData.result.length === 0) {
      throw new Error(`Nie znaleziono leada dla numeru ${phoneNumber}`);
    }

    const leadId = leadData.result[0].ID;
    const updateUrl = `https://amso.bitrix24.pl/rest/73/audb28knfpklnuwq/crm.lead.update`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: leadId,
        fields: { 'COMMENTS': summary }
      })
    });

    const updateResult = await updateResponse.json();
    console.log('Wynik aktualizacji:', updateResult);

    return res.status(200).json({
      status: 'success',
      leadId,
      updateResult
    });

  } catch (error) {
    console.error('Błąd:', error);
    return res.status(500).json({ error: error.message });
  }
}
