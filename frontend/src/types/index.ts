export type TSearchResult = {
	id: string;
	title: string;
	description: string;
	location: {
		lat: number;
		lng: number;
	};
};

export interface IOlaMapsLocation {
	place_id: string;
	structured_formatting: {
		main_text: string;
		secondary_text: string;
	};
	geometry: {
		location: {
			lat: number;
			lng: number;
		};
	};
}
