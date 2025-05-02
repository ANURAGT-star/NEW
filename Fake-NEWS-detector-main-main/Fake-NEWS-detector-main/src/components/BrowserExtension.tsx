import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chrome, Globe, Laptop, Code } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// TypeScript interface for Chrome's webstore API
interface ChromeWebstore {
  install: (
    url: string,
    successCallback: () => void,
    failureCallback: (error: string) => void
  ) => void;
}

// Extend Window interface to include chrome property
interface ExtendedWindow extends Window {
  chrome?: {
    webstore?: ChromeWebstore;
  };
}

const BrowserExtension: React.FC = () => {
  const extensionUrl = "https://chrome.google.com/webstore/detail/fact-checker-extension/dummyextensionid"; // Update this if you publish to the store

  // Function to handle extension installation
  const handleInstallExtension = () => {
    // For now, just open the Chrome Web Store or show instructions
    window.open(extensionUrl, '_blank');
    toast.info("If you haven't published the extension, use 'Load unpacked' in chrome://extensions to load it manually.");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chrome Extension</CardTitle>
        <CardDescription>
          Install our Chrome extension to fact-check any web page or text with a right-click
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://via.placeholder.com/200x150?text=Chrome+Extension" 
            alt="Chrome Extension Preview" 
            className="rounded-md border"
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleInstallExtension}
          >
            <Chrome className="h-4 w-4 mr-2" />
            Add to Chrome
          </Button>
          <Alert>
            <AlertDescription>
              Check facts instantly while browsing with our Chrome extension. 
              Right-click on any text or page to verify information.<br/>
              <strong>To install for development:</strong> Go to <code>chrome://extensions</code>, enable Developer Mode, and click "Load unpacked" to select the <code>chrome-extension/</code> folder.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowserExtension;
