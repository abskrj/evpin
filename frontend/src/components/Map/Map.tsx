import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './Map.css';
import 'leaflet/dist/leaflet.css';

import PositionMarker from '../Markers';
import { useEffect, useState } from 'react';
import { CITY_LAT_LNG } from '@/constants/location';
import { EvStationModal } from '../ev-station-modal';
import { TSearchResult } from '@/types';

const API_KEY = import.meta.env.DEV
	? ''
	: 'd63bec6b-33e2-4dd3-995a-c668e31ccdec';

const TILE_URL = {
	DARK: `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${API_KEY}`,
	LIGHT: `https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${API_KEY}`,
};

interface IMapProps {
	userLocation: {
		latitude: number | null;
		longitude: number | null;
	};
	selectedLocation?: TSearchResult;
}

export default function Map({ userLocation, selectedLocation }: IMapProps) {
	const [tileUrl, setTileUrl] = useState(TILE_URL.LIGHT);
	const [selectedEVStation, setSelectedEVStation] = useState<
		string | undefined
	>();

	useEffect(() => {
		if (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		) {
			setTileUrl(TILE_URL.LIGHT);
		}
	}, []);

	const center: LatLngExpression | undefined =
		userLocation.latitude && userLocation.longitude
			? [userLocation.latitude, userLocation.longitude]
			: CITY_LAT_LNG.BLR;

	return (
		<div className="h-screen w-screen">
			<MapContainer
				center={center}
				zoomControl={false}
				attributionControl={false}
				zoom={13}
				bounceAtZoomLimits
			>
				<TileLayer
					minZoom={7}
					attribution="Stadia Maps | EvPin.in"
					url={tileUrl}
				/>
				<PositionMarker
					searchedEVStation={[]}
					userLocation={userLocation}
					selectedLocation={selectedLocation}
					onEVStationClick={setSelectedEVStation}
				/>
			</MapContainer>

			<EvStationModal
				onClose={() => setSelectedEVStation(undefined)}
				selectedEVStation={selectedEVStation}
			/>
		</div>
	);
}
