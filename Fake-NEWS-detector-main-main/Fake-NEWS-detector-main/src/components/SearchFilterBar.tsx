
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  ratingFilter: string;
  setRatingFilter: React.Dispatch<React.SetStateAction<string>>;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: React.Dispatch<React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>>;
  onReset: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  ratingFilter,
  setRatingFilter,
  dateRange,
  setDateRange,
  onReset
}) => {
  const { from, to } = dateRange;
  
  const formatDateRange = () => {
    if (!from) return "Select date range";
    if (!to) return `From ${format(from, "MMM d, yyyy")}`;
    return `${format(from, "MMM d")} - ${format(to, "MMM d, yyyy")}`;
  };

  // Fix: Add a handler to properly convert between the types
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange({
        from: range.from,
        to: range.to
      });
    } else {
      setDateRange({ from: undefined, to: undefined });
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="search" className="sr-only">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by query or claim..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="rating-filter" className="sr-only">Filter by Rating</Label>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger id="rating-filter">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="True">True</SelectItem>
              <SelectItem value="False">False</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
              <SelectItem value="Error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date-range" className="sr-only">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" id="date-range">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={from}
                selected={{ from, to }}
                onSelect={handleDateRangeSelect} // Fixed: Use the handler to bridge the type gap
                numberOfMonths={2}
              />
              <div className="p-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                >
                  Clear Range
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
