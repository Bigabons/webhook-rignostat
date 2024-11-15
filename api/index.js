export default async function handler(req, res) {
 if (req.method !== 'POST') {
   return res.status(405).json({ error: 'Method not allowed' });
 }

 try {
   const { ID: phoneNumber, COMMENTS: summary } = req.body;
   
   console.log('Searching for lead with phone:', phoneNumber);

   // Szukamy leada po TITLE (numer telefonu)
   const leadSearchUrl = `https://amso.bitrix24.pl/rest/73/udb28kntpkhnwq/crm.lead.list`;
   const searchBody = {
     filter: { 'TITLE': phoneNumber }
   };
   
   console.log('Search request:', JSON.stringify(searchBody));

   const searchResponse = await fetch(leadSearchUrl, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(searchBody)
   });

   const leadData = await searchResponse.json();
   console.log('Search response:', JSON.stringify(leadData));

   if (!leadData.result || leadData.result.length === 0) {
     return res.status(404).json({
       status: 'error',
       message: 'Lead not found',
       searchedPhone: phoneNumber
     });
   }

   const leadId = leadData.result[0].ID;
   console.log('Found lead ID:', leadId);

   // Aktualizujemy leada
   const updateUrl = `https://amso.bitrix24.pl/rest/73/udb28kntpkhnwq/crm.lead.update`;
   const updateBody = {
     id: leadId,
     fields: {
       'COMMENTS': summary
     },
     params: { "REGISTER_SONET_EVENT": "Y" }
   };

   console.log('Update request:', JSON.stringify(updateBody));

   const updateResponse = await fetch(updateUrl, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(updateBody)
   });

   const updateData = await updateResponse.json();
   console.log('Update response:', JSON.stringify(updateData));

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
     message: error.message,
     stack: error.stack
   });
 }
}
