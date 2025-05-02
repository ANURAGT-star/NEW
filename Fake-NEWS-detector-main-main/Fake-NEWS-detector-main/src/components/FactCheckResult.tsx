import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info, ExternalLink, Calendar, User, Link2 } from "lucide-react";
import type { FactCheckResult as FactCheckResultType } from "@/services/databaseService";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ShareButton from "./ShareButton";

interface FactCheckResultProps {
  result: FactCheckResultType | null;
}

const FactCheckResult: React.FC<FactCheckResultProps> = ({ result }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  
  if (!result) return null;

  const { claims, confidence, rating } = result.result;
  
  // Define rating colors and labels
  const getRatingInfo = (rating: string | undefined) => {
    const ratingMap: Record<string, { color: string; bg: string; darkColor: string; darkBg: string; label: string }> = {
      "True": { 
        color: "text-factcheck-green", 
        bg: "bg-factcheck-green/10", 
        darkColor: "dark:text-green-400", 
        darkBg: "dark:bg-green-500/20", 
        label: "True" 
      },
      "False": { 
        color: "text-factcheck-red", 
        bg: "bg-factcheck-red/10", 
        darkColor: "dark:text-red-400", 
        darkBg: "dark:bg-red-500/20", 
        label: "False" 
      },
      "Mixed": { 
        color: "text-factcheck-yellow", 
        bg: "bg-factcheck-yellow/10", 
        darkColor: "dark:text-yellow-300", 
        darkBg: "dark:bg-yellow-500/20", 
        label: "Mixed" 
      },
      "Unknown": { 
        color: "text-factcheck-gray", 
        bg: "bg-factcheck-gray/10", 
        darkColor: "dark:text-gray-300", 
        darkBg: "dark:bg-gray-500/20", 
        label: "Unknown" 
      },
      "Error": { 
        color: "text-destructive", 
        bg: "bg-destructive/10", 
        darkColor: "dark:text-red-400", 
        darkBg: "dark:bg-red-900/20", 
        label: "Error" 
      },
    };
    
    // Default to unknown if rating is not recognized
    return ratingMap[rating || "Unknown"] || ratingMap.Unknown;
  };

  const ratingInfo = getRatingInfo(rating);
  
  return (
    <Card className="w-full max-w-5xl dark:border-slate-700 print:border print:shadow-none" ref={resultRef}>
      <CardHeader className={`${ratingInfo.bg} ${ratingInfo.darkBg} border-b dark:border-slate-700 print:bg-white print:text-black`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Fact Check Results</CardTitle>
          <Badge className={`${ratingInfo.color} ${ratingInfo.darkColor} ${ratingInfo.bg} ${ratingInfo.darkBg} text-sm px-3 py-1 print:border print:border-current`}>
            {ratingInfo.label}
          </Badge>
        </div>
        <CardDescription className="dark:text-slate-300 print:text-gray-700">
          {result.isUrl ? "URL checked" : "Claim checked"}
          {claims.length > 0 && ` • ${claims.length} claim${claims.length > 1 ? 's' : ''} found`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Verification Confidence</h3>
            <span className="text-sm">{Math.round(confidence * 100)}%</span>
          </div>
          <Progress value={confidence * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">
            <Info className="h-3 w-3 inline mr-1" />
            Confidence based on number and quality of fact checks found
          </p>
        </div>
        
        <Separator className="dark:bg-slate-700" />
        
        {claims.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No fact-checks found for this query.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {claims.map((claim, i) => (
              <div key={i} className="border rounded-lg p-4 dark:border-slate-700 bg-card">
                <div className="mb-2">
                  <span className="font-semibold text-base">Claim:</span>
                  <span className="ml-2">{claim.text}</span>
                </div>
                {claim.claimant && (
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Claimed by:</span>
                    <span className="font-medium">{claim.claimant}</span>
                  </div>
                )}
                {claim.claimReview.length === 0 ? (
                  <div className="text-xs text-muted-foreground">No reviews for this claim.</div>
                ) : (
                  <div className="space-y-3">
                    {claim.claimReview.map((review, j) => (
                      <div key={j} className="border rounded-md p-3 dark:border-slate-700 bg-background">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{review.publisher?.name || "Unknown Source"}</span>
                          {review.reviewDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        {review.textualRating && (
                          <Badge className="mt-2 text-xs">{review.textualRating}</Badge>
                        )}
                        {review.title && (
                          <div className="mt-2 text-sm font-medium">{review.title}</div>
                        )}
                        {review.url && (
                          <Button variant="outline" size="sm" className="mt-2 text-xs" asChild>
                            <a href={review.url} target="_blank" rel="noopener noreferrer">
                              View Original Fact Check
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t dark:border-slate-700 pt-4 print:hidden">
        <div className="w-full flex justify-end">
          <ShareButton result={result} resultRef={resultRef} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default FactCheckResult;
