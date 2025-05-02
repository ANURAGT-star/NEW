import React, { useState } from "react";
import FactCheckForm from "@/components/FactCheckForm";
import FactCheckResult from "@/components/FactCheckResult";
import FactCheckHistory from "@/components/FactCheckHistory";
import BrowserExtension from "@/components/BrowserExtension";
import type { FactCheckResult as FactCheckResultType } from "@/services/databaseService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Search, History, Laptop } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("check");

  const handleResultReceived = (result: any) => {
    setCurrentResult(result);
  };

  const handleSelectFromHistory = (result: FactCheckResultType) => {
    setCurrentResult({ googleResult: result, wolframAnswer: null });
    setActiveTab("check");
  };

  return (
    <div>
      <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
        <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        <AlertTitle className="text-amber-700 dark:text-amber-300">Important</AlertTitle>
        <AlertDescription className="text-amber-600 dark:text-amber-400">
          You need a Google Fact Check API key to use this application. Enter your API key in the form below.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="check" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Fact Check
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="extension" className="flex-1">
            <Laptop className="h-4 w-4 mr-2" />
            Chrome Extension
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="check" className="space-y-6">
            <div className="flex flex-col items-center space-y-8">
              <FactCheckForm onResultReceived={handleResultReceived} />
              {currentResult && (
                <>
                  <Separator className="w-full max-w-5xl" />
                  <div className="w-full max-w-5xl">
                    <h2 className="text-xl font-bold mb-2">Google Fact Check</h2>
                    <FactCheckResult result={currentResult.googleResult} />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="flex justify-center">
              <FactCheckHistory onSelectResult={handleSelectFromHistory} />
            </div>
          </TabsContent>
          <TabsContent value="extension">
            <div className="flex justify-center">
              <BrowserExtension />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
