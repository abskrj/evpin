import { LatLng } from 'leaflet';

const BASE_URL = import.meta.env.DEV
	? 'http://localhost:8001/api/v1'
	: 'https://api.evpin.in/api/v1';

export const getEVStationNearby = async (location: LatLng) => {
	const url = new URL(`${BASE_URL}/ev-chargers/nearby`);
	url.searchParams.set('latitude', location.lat.toString());
	url.searchParams.set('longitude', location.lng.toString());
	url.searchParams.set('radius', '5000');

	const response = await fetch(url);
	return await response.json();
};

export const getLocationByQuery = async (
	query: string,
	latitude: number | null,
	longitude: number | null,
) => {
	const url = new URL(`${BASE_URL}/location/search`);
	url.searchParams.set('query', query);
	if (latitude && longitude) {
		url.searchParams.set('lat', latitude.toString());
		url.searchParams.set('lng', longitude.toString());
	}

	const response = await fetch(url);
	return await response.json();
};

export const getEVStationById = async (id: string) => {
	const url = new URL(`${BASE_URL}/ev-chargers/${id}`);
	const response = await fetch(url);
	return await response.json();
};
