import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { TSearchResult } from '@/types';
import { useCallback } from 'react';

interface MapSearchProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	isDropdownOpen: boolean;
	handleDropdown: (open: boolean) => void;
	setSelectedLocation: (location: TSearchResult) => void;
	searchResults: TSearchResult[];
	handleSearch: (query: string) => void;
}

export function MapSearch({
	searchQuery,
	setSearchQuery,
	isDropdownOpen,
	handleDropdown,
	searchResults,
	setSelectedLocation,
	handleSearch,
}: MapSearchProps) {
	const handleSearchWrapper = (e: React.FormEvent) => {
		e.preventDefault();
		handleSearch(searchQuery);
	};

	const handleDropDownOpen = () => {
		if (searchQuery.length > 2 && searchResults.length > 0) {
			handleDropdown(true);
		}
	};

	const handleDropDownClose = () => {
		setTimeout(() => {
			handleDropdown(false);
		}, 100);
	};

	const handleSelectedLocation = useCallback(
		(location: TSearchResult) => {
			setSelectedLocation(location);
		},
		[setSelectedLocation],
	);

	return (
		<div className="relative w-full bg-gray-200 z-[500]">
			<div className="absolute top-4 left-4 right-4 sm:w-80 md:w-96">
				<form onSubmit={handleSearchWrapper} className="relative">
					<Input
						type="search"
						placeholder="Search..."
						className="w-full pr-10 rounded-md shadow-lg"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onBlur={handleDropDownClose}
						onFocus={handleDropDownOpen}
					/>
					<Button
						type="submit"
						size="icon"
						className="absolute right-0 top-0 rounded-l-none"
					>
						<Search className="h-4 w-4" />
						<span className="sr-only">Search</span>
					</Button>
				</form>

				{/* Dropdown for search results */}
				{isDropdownOpen && (
					<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg max-h-6/5 overflow-auto">
						<ul className="py-1">
							{searchResults.map((result) => (
								<li
									role="button"
									onClick={() =>
										handleSelectedLocation(result)
									}
									key={result.id}
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
								>
									{result.title}
									<p className="text-sm text-gray-500">
										{result.description}
									</p>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
