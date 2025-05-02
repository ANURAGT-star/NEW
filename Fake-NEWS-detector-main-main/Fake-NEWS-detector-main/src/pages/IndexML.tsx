import React, { useState } from "react";
import FactCheckFormML from "@/components/FactCheckFormML";
import { Separator } from "@/components/ui/separator";

const IndexML = () => {
  const [currentResult, setCurrentResult] = useState<any>(null);

  const handleResultReceived = (result: any) => {
    setCurrentResult(result);
  };

  return (
    <div>
      <div className="mt-6">
        <div className="flex flex-col items-center space-y-8">
          <FactCheckFormML onResultReceived={handleResultReceived} />
          {currentResult && (
            <>
              <Separator className="w-full max-w-5xl" />
              <div className="w-full max-w-5xl">
                <h2 className="text-xl font-bold mb-2">ML Model Prediction</h2>
                <div className="text-lg">
                  <strong>Result:</strong> {currentResult.result} <br />
                  <strong>Confidence:</strong> {(currentResult.confidence * 100).toFixed(2)}%
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexML;
