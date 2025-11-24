import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const flightIata = searchParams.get('flight_iata');

    if (!flightIata) {
        return NextResponse.json({ error: 'Flight IATA code is required' }, { status: 400 });
    }

    const API_KEY = process.env.NEXT_PUBLIC_AVIATION_API_KEY;

    if (!API_KEY) {
        console.error('Missing API Key');
        return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }

    try {
        const url = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightIata}&limit=1`;
        console.log(`Fetching from: ${url.replace(API_KEY, '***')}`);

        const response = await fetch(url);
        const responseText = await response.text();

        console.log('Upstream status:', response.status);
        // console.log('Upstream response:', responseText); // Uncomment for full debug if needed

        if (!response.ok) {
            throw new Error(`Upstream API error: ${response.status} ${response.statusText} - ${responseText.substring(0, 100)}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Invalid JSON from upstream: ${responseText.substring(0, 100)}...`);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Flight API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch flight data' }, { status: 500 });
    }
}
