import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const flightIata = searchParams.get('flight_iata');

    if (!flightIata) {
        return NextResponse.json({ error: 'Flight IATA code is required' }, { status: 400 });
    }

    const API_KEY = process.env.NEXT_PUBLIC_AVIATION_API_KEY;

    if (!API_KEY) {
        return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightIata}&limit=1`
        );

        if (!response.ok) {
            throw new Error(`Upstream API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Flight API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch flight data' }, { status: 500 });
    }
}
