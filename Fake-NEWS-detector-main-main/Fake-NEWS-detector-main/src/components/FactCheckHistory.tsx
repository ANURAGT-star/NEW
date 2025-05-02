
import React, { useState, useEffect } from "react";
import { databaseService, FactCheckResult } from "@/services/databaseService";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { X, Trash, FileCog2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import SearchFilterBar from "./SearchFilterBar";

interface FactCheckHistoryProps {
  onSelectResult: (result: FactCheckResult) => void;
}

const FactCheckHistory: React.FC<FactCheckHistoryProps> = ({ onSelectResult }) => {
  const [history, setHistory] = useState<FactCheckResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  const loadHistory = () => {
    setHistory(databaseService.getHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = () => {
    databaseService.clearHistory();
    setHistory([]);
    toast.success("History cleared");
  };

  const handleDeleteFactCheck = (id: string) => {
    databaseService.deleteFactCheck(id);
    loadHistory();
    toast.success("Fact check removed from history");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRatingFilter("all");
    setDateRange({ from: undefined, to: undefined });
  };

  // Apply filters
  const filteredHistory = history.filter((item) => {
    // Text search
    const matchesSearch = searchTerm === "" || 
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.result.claim?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Rating filter
    const matchesRating = ratingFilter === "all" || item.result.rating === ratingFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from) {
      const checkDate = new Date(item.timestamp);
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = checkDate >= fromDate && checkDate <= toDate;
      } else {
        matchesDateRange = checkDate >= fromDate;
      }
    }
    
    return matchesSearch && matchesRating && matchesDateRange;
  });

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Your Fact Check History</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Trash className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your fact check history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* Fixed: Removed variant prop from AlertDialogAction */}
                <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, clear history
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onReset={resetFilters}
        />
        
        {filteredHistory.length > 0 ? (
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-3">
              {filteredHistory.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start justify-between p-3 rounded-md border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelectResult(result)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          result.result.rating === "True"
                            ? "bg-factcheck-green/10 text-factcheck-green dark:bg-green-500/20 dark:text-green-400"
                            : result.result.rating === "False"
                            ? "bg-factcheck-red/10 text-factcheck-red dark:bg-red-500/20 dark:text-red-400"
                            : result.result.rating === "Mixed"
                            ? "bg-factcheck-yellow/10 text-factcheck-yellow dark:bg-yellow-500/20 dark:text-yellow-400"
                            : "bg-factcheck-gray/10 text-factcheck-gray dark:bg-gray-500/20 dark:text-gray-400"
                        }
                      >
                        {result.result.rating || "Unknown"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(result.result.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm font-medium truncate" title={result.query}>
                      {result.query}
                    </p>
                    <div className="flex items-center mt-1 space-x-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </p>
                      {result.isUrl ? (
                        <Badge variant="outline" className="text-xs text-muted-foreground">URL</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Claim</Badge>
                      )}
                      <FileCog2 className="h-3 w-3 ml-1 text-muted-foreground" />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFactCheck(result.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              {history.length === 0
                ? "No fact checks in history yet. Start by checking a claim or URL."
                : "No results match your filters. Try changing or resetting your search filters."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FactCheckHistory;
