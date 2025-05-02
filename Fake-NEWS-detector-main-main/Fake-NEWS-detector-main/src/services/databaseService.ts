// Simple database service using localStorage for this MVP version
// This would be replaced with a proper backend DB in production
import { FactCheckSource } from "./factCheckService";

export interface FactCheckReview {
  publisher: {
    name?: string;
    site?: string;
  };
  url?: string;
  title?: string;
  reviewDate?: string;
  textualRating?: string;
  languageCode?: string;
}

export interface FactCheckClaim {
  text: string;
  claimant?: string;
  claimDate?: string;
  claimReview: FactCheckReview[];
}

export interface FactCheckResult {
  id: string;
  query: string;
  isUrl: boolean;
  result: {
    claims: FactCheckClaim[];
    confidence: number;
    rating: string;
  };
  timestamp: number;
}

class DatabaseService {
  private STORAGE_KEY = 'factcheck-history';
  
  // Save a fact check result to history
  saveFactCheck(factCheck: Omit<FactCheckResult, 'id' | 'timestamp'>): FactCheckResult {
    const history = this.getHistory();
    
    const newEntry: FactCheckResult = {
      ...factCheck,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newEntry);
    
    // Limit history to last 50 entries
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedHistory));
    return newEntry;
  }
  
  // Get all saved fact checks
  getHistory(): FactCheckResult[] {
    const savedHistory = localStorage.getItem(this.STORAGE_KEY);
    if (!savedHistory) {
      return [];
    }
    
    try {
      return JSON.parse(savedHistory);
    } catch (error) {
      console.error('Error parsing history:', error);
      return [];
    }
  }
  
  // Clear all history
  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  // Delete a specific fact check by ID
  deleteFactCheck(id: string): void {
    const history = this.getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
  }
}

// Create and export a singleton instance
export const databaseService = new DatabaseService();
