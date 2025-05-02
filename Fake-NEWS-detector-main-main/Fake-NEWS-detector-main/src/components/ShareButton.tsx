
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Twitter,
  Facebook,
  Copy,
  Share2,
  Mail,
  Printer,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { FactCheckResult } from "@/services/databaseService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ShareButtonProps {
  result: FactCheckResult;
  resultRef: React.RefObject<HTMLDivElement>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ result, resultRef }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const shareUrl = window.location.origin;
  
  const shareText = `Fact Check Result: ${result.result.rating} - ${result.query}`;
  
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
    toast.success("Opened Twitter to share");
  };
  
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
    toast.success("Opened Facebook to share");
  };
  
  const shareByEmail = () => {
    const subject = encodeURIComponent("Fact Check Result");
    const body = encodeURIComponent(`${shareText}\n\nCheck it out at: ${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success("Opened email client");
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\nCheck it out at: ${shareUrl}`);
    toast.success("Copied to clipboard");
  };
  
  const printResult = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const exportToPDF = async () => {
    if (!resultRef.current) return;
    
    try {
      setIsExporting(true);
      toast.info("Preparing PDF export...");
      
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to fit the image properly on the page
      const imgWidth = 190; // slightly smaller than A4 width
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Add footer with date and URL
      const footerText = `Generated from Fake News Detector - ${new Date().toLocaleString()}`;
      pdf.setFontSize(8);
      pdf.text(footerText, 10, pageHeight - 10);
      
      pdf.save(`fact-check-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={shareToTwitter}>
          <Twitter className="h-4 w-4 mr-2" />
          <span>Share on Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook}>
          <Facebook className="h-4 w-4 mr-2" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareByEmail}>
          <Mail className="h-4 w-4 mr-2" />
          <span>Share by Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          <span>Copy to Clipboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={printResult}>
          <Printer className="h-4 w-4 mr-2" />
          <span>Print Result</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          <span>{isExporting ? "Exporting..." : "Export as PDF"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
