import { useCallback, useEffect, useState } from 'react';
import Map from './components/Map';
import { MapSearch } from './components/map-search';
import { useDebounce, useGeolocation } from '@uidotdev/usehooks';
import { getLocationByQuery } from './api/getEVStationByPoint';
import { IOlaMapsLocation, TSearchResult } from './types';

function App() {
	const [searchQuery, setSearchQuery] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchResults, setSearchResults] = useState<TSearchResult[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<
		TSearchResult | undefined
	>(undefined);

	const { latitude, longitude } = useGeolocation({
		enableHighAccuracy: true,
	});

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const searchAPI = useCallback(
		async (query: string) => {
			getLocationByQuery(query, latitude, longitude).then((data) => {
				const results = data.map((item: IOlaMapsLocation) => ({
					id: item.place_id,
					title: item.structured_formatting.main_text,
					description: item.structured_formatting.secondary_text,
					location: item.geometry.location,
				}));
				setSearchResults(results);
				setIsDropdownOpen(true);
			});
		},
		[latitude, longitude],
	);

	useEffect(() => {
		if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
			searchAPI(debouncedSearchQuery);
		} else {
			setIsDropdownOpen(false);
		}
	}, [debouncedSearchQuery, searchAPI]);

	const handleSearch = useCallback(
		(query: string) => {
			if (query.length > 2) {
				searchAPI(query);
			}
		},
		[searchAPI],
	);

	const handleSelectedLocation = useCallback(
		(location: TSearchResult) => {
			setSelectedLocation(location);
		},
		[setSelectedLocation],
	);

	return (
		<>
			<MapSearch
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				isDropdownOpen={isDropdownOpen}
				handleDropdown={setIsDropdownOpen}
				setSelectedLocation={handleSelectedLocation}
				searchResults={searchResults}
				handleSearch={handleSearch}
			/>
			<Map
				userLocation={{ latitude, longitude }}
				selectedLocation={selectedLocation}
			/>
		</>
	);
}

export default App;
