export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Metoda niedozwolona' });
    }

    try {
        const data = await request.json();
        
        console.log('Otrzymane dane:', data);

        return response.status(200).json({ 
            status: 'success', 
            message: 'Dane otrzymane',
            data: data 
        });

    } catch (error) {
        console.error('Błąd:', error);
        return response.status(500).json({ 
            status: 'error', 
            message: 'Wystąpił błąd' 
        });
    }
}
