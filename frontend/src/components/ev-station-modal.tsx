import { Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { getEVStationById } from '@/api/getEVStationByPoint';
import { useEffect } from 'react';
import { openCoordinatesInMapsApp } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface EVStationModalProps {
	selectedEVStation: string | undefined;
	onClose: () => void;
}

export function EvStationModal({
	selectedEVStation,
	onClose = () => {},
}: EVStationModalProps) {
	const [isLoading, setIsLoading] = useState(true);

	const [evStation, setEvStation] = useState<
		| {
				_id: string;
				title: string;
				description: string;
				address: string;
				location: {
					type: string;
					coordinates: [number, number];
				};
				closingTime: string;
				openingTime: string;
		  }
		| undefined
	>(undefined);

	useEffect(() => {
		if (selectedEVStation) {
			setIsLoading(true);
			getEVStationById(selectedEVStation)
				.then(setEvStation)
				.finally(() => setIsLoading(false));
		}
	}, [selectedEVStation]);

	const onGetDirections = () => {
		if (evStation?.location.coordinates) {
			openCoordinatesInMapsApp(evStation.location.coordinates);
		}
	};

	return (
		<Dialog open={!!selectedEVStation} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				{isLoading ? (
					<>
						<DialogHeader>
							<Skeleton className="h-4 w-full" />
						</DialogHeader>
						<Skeleton className="h-[100px] w-full" />
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle className="pr-8">
								{evStation?.title}
							</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							{evStation?.description && (
								<DialogDescription>
									{evStation?.description}
								</DialogDescription>
							)}
							{evStation?.address && (
								<div className="grid grid-cols-4 items-center gap-4">
									<span className="col-span-4 font-semibold">
										Address:
									</span>
									<span className="col-span-4">
										{evStation?.address}
									</span>
								</div>
							)}
							{/* {evStation?.supportedPins && (
						<div className="grid grid-cols-4 items-center gap-4">
							<span className="col-span-4 font-semibold">
								Supported Pins:
							</span>
							<div className="col-span-4 flex flex-wrap gap-2">
								{supportedPins.map((pin) => (
									<span
										key={pin}
										className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground"
									>
										{pin}
									</span>
								))}
							</div>
						</div>
					)} */}
							{evStation?.openingTime &&
								evStation?.closingTime && (
									<div className="grid grid-cols-4 items-center gap-4">
										<span className="col-span-4 font-semibold">
											Open Hours:
										</span>
										<span className="col-span-4">
											{`${evStation?.openingTime} - ${evStation?.closingTime}`}
										</span>
									</div>
								)}

							{/* <div className="col-span-4 flex items-center space-x-4">
							<span>Total: {totalSlots}</span>
							<div className="flex items-center space-x-2">
								<span>Available: {availableSlots}</span>
								<span className="relative flex h-3 w-3">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
								</span>
							</div>
						</div> */}
						</div>
						<Separator className="my-4" />
						<DialogFooter>
							<Button
								onClick={onGetDirections}
								className="w-full"
							>
								<Map className="mr-2 h-4 w-4" />
								Get Directions
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
