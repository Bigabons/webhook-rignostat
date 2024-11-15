export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(
            JSON.stringify({ message: 'Metoda niedozwolona' }), 
            { 
                status: 405,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    try {
        const data = await request.json();
        
        console.log('Otrzymane dane:', data);

        return new Response(
            JSON.stringify({ 
                status: 'success', 
                message: 'Dane otrzymane',
                data: data 
            }), 
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Błąd:', error);
        return new Response(
            JSON.stringify({ 
                status: 'error', 
                message: 'Wystąpił błąd' 
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
