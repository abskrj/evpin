import { Icon, LatLng, LatLngExpression } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

import UserLocationMarker from '@/assets/user-location.png';
import EvLocationMarker from '@/assets/fuel-station.png';
import LocationMarker from '@/assets/pin.png';

import { getEVStationNearby } from '@/api/getEVStationByPoint';
import { useDebounce } from '@uidotdev/usehooks';
import { TSearchResult } from '@/types';

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

interface PositionMarkerProps {
	searchedEVStation: EVStation[];
	selectedLocation?: TSearchResult;
	userLocation: {
		latitude: number | null;
		longitude: number | null;
	};
	onEVStationClick: (id: string) => void;
}

export default function PositionMarker({
	searchedEVStation,
	userLocation,
	selectedLocation,
	onEVStationClick,
}: PositionMarkerProps) {
	const map = useMapEvents({
		locationfound(e) {
			map.setView(e.latlng, map.getZoom());
		},
	});

	useEffect(() => {
		map.locate();
	}, [map]);

	useEffect(() => {
		if (selectedLocation) {
			const loc = new LatLng(
				selectedLocation.location.lat,
				selectedLocation.location.lng,
			);
			map.setView(loc, map.getZoom());
			getEVStationNearby(loc).then((evStation) => {
				const _evStation: EVStation[] = [];
				for (const station of evStation.data) {
					if (evStationIdSet.current.has(station._id)) continue;
					evStationIdSet.current.add(station._id);
					_evStation.push(station);
				}
				setEvStation((prev) => [...prev, ..._evStation]);
			});
		}
	}, [selectedLocation, map]);

	const [position, setPosition] = useState<LatLng | null>(null);
	const [evStation, setEvStation] = useState<EVStation[]>([]);
	const evStationIdSet = useRef(new Set<string>());
	const deferredPosition = useDebounce(position, 500);

	useEffect(() => {
		if (userLocation.latitude && userLocation.longitude) {
			setPosition(
				new LatLng(userLocation.latitude, userLocation.longitude),
			);
		}
	}, [userLocation]);

	useEffect(() => {
		setEvStation((prev) => [...prev, ...searchedEVStation]);
	}, [searchedEVStation]);

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

	const [userLocationIcon, evLocationIcon, selectedLocationIcon] = useMemo(
		() => [
			new Icon({
				iconUrl: UserLocationMarker,
				iconSize: [32, 32],
			}),
			new Icon({
				iconUrl: EvLocationMarker,
				iconSize: [34, 34],
			}),
			new Icon({
				iconUrl: LocationMarker,
				iconSize: [32, 32],
			}),
		],
		[],
	);

	const renderedUserMarker = useMemo(
		() =>
			position === null ? null : (
				<Marker position={position} icon={userLocationIcon} />
			),
		[position, userLocationIcon],
	);

	const renderedEvStationMarker = useMemo(
		() =>
			evStation.map((station) => (
				<Marker
					key={station._id}
					position={getLatLng(station.location.coordinates)}
					icon={evLocationIcon}
					eventHandlers={{
						click: () => onEVStationClick(station._id),
					}}
				/>
			)),
		[evStation, evLocationIcon, onEVStationClick],
	);

	const renderedSelectedLocationMarker = useMemo(
		() =>
			selectedLocation ? (
				<Marker
					position={
						new LatLng(
							selectedLocation.location.lat,
							selectedLocation.location.lng,
						)
					}
					icon={selectedLocationIcon}
				/>
			) : null,
		[selectedLocation, selectedLocationIcon],
	);

	return (
		<>
			{renderedUserMarker}
			{renderedEvStationMarker}
			{renderedSelectedLocationMarker}
		</>
	);
}
