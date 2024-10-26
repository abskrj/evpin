import { Icon, LatLng, LatLngExpression } from 'leaflet';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

import UserLocationMarker from '@/assets/user-location.png';
import EvLocationMarker from '@/assets/fuel-station.png';

import { CITY_LAT_LNG } from '@/constants/location';
import { getEVStationNearby } from '@/api/getEVStationByPoint';

interface EVStation {
	_id: string;
	title: string;
	location: {
		coordinates: [number, number];
	};
}

const getLatLng = (coordinates: [number, number]) => {
	const lng = coordinates[0];
	const lat = coordinates[1];
	return [lat, lng] as LatLngExpression;
};

export default function UserMarker() {
	const [position, setPosition] = useState<LatLng | null>(null);
	const [evStation, setEvStation] = useState<EVStation[]>([]);
	const evStationIdSet = useRef(new Set<string>());
	const deferredPosition = useDeferredValue(position);

	const map = useMapEvents({
		async locationfound(e) {
			setPosition(e.latlng);
			map.flyTo(e.latlng, map.getZoom());
		},
	});

	useEffect(() => {
		map.locate();
	}, [map]);

	useEffect(() => {
		if (deferredPosition) {
			getEVStationNearby(deferredPosition).then((evStation) => {
				const _evStation: EVStation[] = [];
				for (const station of evStation.data) {
					if (evStationIdSet.current.has(station._id)) continue;
					evStationIdSet.current.add(station._id);
					_evStation.push(station);
				}
				setEvStation((prev) => [...prev, ..._evStation]);
			});
		}
	}, [deferredPosition]);

	const [userLocationIcon, evLocationIcon] = useMemo(
		() => [
			new Icon({
				iconUrl: UserLocationMarker,
				iconSize: [32, 32],
			}),
			new Icon({
				iconUrl: EvLocationMarker,
				iconSize: [34, 34],
			}),
		],
		[],
	);

	const getUserMarker = () =>
		position === null ? null : (
			<Marker position={position} icon={userLocationIcon} />
		);

	const getEvStationMarker = useMemo(
		() =>
			evStation.map((station) => (
				<Marker
					key={station._id}
					position={getLatLng(station.location.coordinates)}
					icon={evLocationIcon}
				/>
			)),
		[evStation, evLocationIcon],
	);

	return (
		<>
			{getUserMarker()}
			{getEvStationMarker}
			<Marker
				eventHandlers={{
					click: console.log,
				}}
				position={CITY_LAT_LNG.EV}
				icon={evLocationIcon}
			/>
		</>
	);
}
