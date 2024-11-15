export default async function handler(req, res) {
  try {
    const { ID: phoneNumber, COMMENTS: summary } = req.body;
    
    // Formatowanie numeru telefonu - usuwamy wszystkie znaki oprócz cyfr
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    console.log(`Oryginalny numer: ${phoneNumber}, Sformatowany: ${formattedPhone}`);

    // Różne warianty formatu numeru
    const phoneVariants = [
      formattedPhone,
      `+${formattedPhone}`,
      formattedPhone.replace(/^48/, ''), // bez prefiksu kraju
      `+48${formattedPhone.replace(/^48/, '')}` // z prefiksem kraju
    ];

    // Szukanie leada po wszystkich wariantach numeru
    const leadSearchUrl = `https://amso.bitrix24.pl/rest/73/audb28knfpklnuwq/crm.lead.list`;
    let leadId = null;

    for (const phoneVariant of phoneVariants) {
      const searchResponse = await fetch(leadSearchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filter: { 'TITLE': phoneVariant }
        })
      });

      const leadData = await searchResponse.json();
      if (leadData.result?.length) {
        leadId = leadData.result[0].ID;
        break;
      }
    }

    if (!leadId) {
      return res.status(404).json({
        error: `Nie znaleziono leada dla numeru ${phoneNumber}`
      });
    }

    // Dodawanie komentarza
    const commentUrl = `https://amso.bitrix24.pl/rest/73/audb28knfpklnuwq/crm.timeline.comment.add`;
    const commentResponse = await fetch(commentUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          ENTITY_ID: leadId,
          ENTITY_TYPE: 'lead',
          COMMENT: summary
        }
      })
    });

    const commentResult = await commentResponse.json();
    
    return res.status(200).json({
      status: 'success',
      leadId,
      commentResult,
      usedPhoneFormat: leadId ? phoneVariants.find(p => p === phoneNumber) : null
    });

  } catch (error) {
    console.error('Błąd:', error);
    return res.status(500).json({ error: error.message });
  }
}
