'use client';

import { useState } from 'react';
import { Flight } from '@/types/flight';
import { Plane, MapPin, Clock, Search, AlertCircle, Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface FlightSearchProps {
    dictionary: any;
    lang: string;
}

export default function FlightSearch({ dictionary, lang }: FlightSearchProps) {
    const [flightNumber, setFlightNumber] = useState('');
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flightNumber.trim()) return;

        setLoading(true);
        setError('');
        setFlight(null);

        try {
            const response = await fetch(`/api/flights?flight_iata=${flightNumber}`);
            const data = await response.json();

            if (data.error) {
                console.error('Aviationstack API Error:', data.error);
                throw new Error(dictionary.errorFetch);
            }

            if (!data.data || data.data.length === 0) {
                throw new Error(dictionary.errorNotFound);
            }

            const flightData = data.data[0];

            const mappedFlight: Flight = {
                flightNumber: flightData.flight.iata,
                startTime: flightData.departure.scheduled,
                endTime: flightData.arrival.scheduled,
                departureTimeZone: flightData.departure.timezone,
                arrivalTimeZone: flightData.arrival.timezone,
                startLocation: `${flightData.departure.iata} (${flightData.departure.airport})`,
                endLocation: `${flightData.arrival.iata} (${flightData.arrival.airport})`,
            };

            setFlight(mappedFlight);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchLanguage = (newLang: string) => {
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        router.push(newPath);
    };

    return (
        <main className="container">
            <div className="absolute top-4 right-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => switchLanguage('en-US')}
                        className={`px-3 py-1 rounded-full text-sm ${lang === 'en-US' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'}`}
                        style={{ width: 'auto' }}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => switchLanguage('fr')}
                        className={`px-3 py-1 rounded-full text-sm ${lang === 'fr' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'}`}
                        style={{ width: 'auto' }}
                    >
                        FR
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="header">
                    <Plane className="icon-large" />
                    <h1>{dictionary.title}</h1>
                </div>

                <form onSubmit={handleSearch} className="form-group">
                    <div className="input-wrapper">
                        <Search className="input-icon" size={20} />
                        <input
                            type="text"
                            placeholder={dictionary.searchPlaceholder}
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <span className="loading-text">{dictionary.searching}</span>
                        ) : (
                            <>
                                {dictionary.searchButton}
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {flight && (
                    <div className="result-card">
                        <div className="flight-header">
                            <div className="flight-number">
                                <Plane className="rotate-icon" />
                                <span>{flight.flightNumber}</span>
                            </div>
                        </div>

                        <div className="flight-grid">
                            <div className="flight-item">
                                <div className="label-with-icon">
                                    <MapPin size={16} />
                                    <span className="label">{dictionary.departure}</span>
                                </div>
                                <span className="value">{flight.startLocation}</span>
                            </div>

                            <div className="flight-item">
                                <div className="label-with-icon">
                                    <MapPin size={16} />
                                    <span className="label">{dictionary.arrival}</span>
                                </div>
                                <span className="value">{flight.endLocation}</span>
                            </div>

                            <div className="flight-item">
                                <div className="label-with-icon">
                                    <Clock size={16} />
                                    <span className="label">{dictionary.departureTime}</span>
                                </div>
                                <span className="value">
                                    {new Date(flight.startTime).toLocaleString(lang)}
                                    <span className="sub-text">({flight.departureTimeZone})</span>
                                </span>
                            </div>

                            <div className="flight-item">
                                <div className="label-with-icon">
                                    <Clock size={16} />
                                    <span className="label">{dictionary.arrivalTime}</span>
                                </div>
                                <span className="value">
                                    {new Date(flight.endTime).toLocaleString(lang)}
                                    <span className="sub-text">({flight.arrivalTimeZone})</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
