import { MapContainer, TileLayer } from 'react-leaflet';

import './Map.css';
import 'leaflet/dist/leaflet.css';

import { CITY_LAT_LNG } from '../../constants/location';
import UserMarker from '../UserMarker';

export default function Map() {
	return (
		<div className="h-screen w-screen">
			<MapContainer
				center={CITY_LAT_LNG.BLR}
				zoomControl={false}
				zoom={13}
			>
				<TileLayer
					minZoom={7}
					attribution="OpenStreetMap"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<UserMarker />
			</MapContainer>
		</div>
	);
}
