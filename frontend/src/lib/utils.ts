import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isPhone = () => {
	return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const openCoordinatesInMapsApp = (coordinates: [number, number]) => {
	if (isPhone()) {
		window.open(`geo:${coordinates[0]},${coordinates[1]}`, '_blank');
	} else {
		window.open(
			`http://www.google.com/maps/place/${coordinates[1]},${coordinates[0]}`,
			'_blank',
		);
	}
};
