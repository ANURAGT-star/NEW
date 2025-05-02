import React, { useState, useEffect, useRef } from "react";

// Modal for voting reason
function VoteReasonModal({ open, voteType, reason, setReason, onCancel, onSubmit }: {
  open: boolean;
  voteType: 'correct'|'incorrect';
  reason: string;
  setReason: (r: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 w-full max-w-md" role="document">
        <div className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
          {voteType === 'correct' ? 'Why is this evidence correct?' : 'Why is this evidence incorrect?'} <span className="font-normal text-gray-500">(optional)</span>
        </div>
        <textarea
          ref={textareaRef}
          className="w-full min-h-[64px] p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          placeholder="Add your reasoning..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          aria-label="Reason for your vote"
        />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-600" onClick={onCancel} type="button">Cancel</button>
          <button className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={onSubmit} type="button">Submit</button>
        </div>
      </div>
    </div>
  );
}

import { getUserId } from "./userId";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { checkFakeNewsML } from "@/services/factCheckServiceML";

interface FactCheckFormMLProps {
  onResultReceived: (result: any) => void;
}

const FactCheckFormML: React.FC<FactCheckFormMLProps> = ({ onResultReceived }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<{ word: string; weight: number }[] | null>(null);
  const [showCommunitySection, setShowCommunitySection] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Please enter some text to fact check");
      return;
    }
    setLoading(true);
    setResult(null);
    setConfidence(null);
    setIsFallbackMode(false);
    try {
      const res = await checkFakeNewsML(query.trim());
      setResult(res.result);
      setConfidence(res.confidence);
      setExplanation(res.explanation || null);
      setShowCommunitySection(true);
      setIsFallbackMode(!!res.isFallback);
      onResultReceived(res);
    } catch (error) {
      alert("Failed to check facts using ML model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>ML Fake News Detector</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Input
            type="text"
            placeholder="Enter news text to check..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={loading}
          />
          {result && (
            <div className="mt-4 text-lg">
              {isFallbackMode && (
                <div className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-3 py-2 rounded-md mb-2 text-sm">
                  ⚠️ Using simplified offline detection. Results may be less accurate than the full ML model.
                </div>
              )}
              <strong>Result:</strong> {result} <br />
              <strong>Confidence:</strong> {(confidence! * 100).toFixed(2)}%
              {explanation && explanation.length > 0 && (
  <div className="mt-3">
    <strong className="text-lg text-blue-700 dark:text-blue-300">Why this result?</strong>
    <div className="flex flex-wrap gap-2 mt-2">
      {explanation.filter(item => item.weight > 0).map((item, idx) => (
        <span
          key={"pos-"+idx}
          title={`Positive influence: ${item.weight.toFixed(3)}`}
          style={{background: `rgba(255, 221, 51, ${0.5 + 0.5 * Math.min(Math.abs(item.weight), 1)})`, color: '#111', border: '2px solid #222', borderRadius: '6px', padding: '2px 8px', fontWeight: 700, fontSize: '1em', boxShadow: '0 1px 4px rgba(0,0,0,0.15)'}}>
          {item.word}
        </span>
      ))}
      {explanation.filter(item => item.weight < 0).map((item, idx) => (
        <span
          key={"neg-"+idx}
          title={`Negative influence: ${item.weight.toFixed(3)}`}
          style={{background: `rgba(0, 255, 255, ${0.5 + 0.5 * Math.min(Math.abs(item.weight), 1)})`, color: '#111', border: '2px solid #222', borderRadius: '6px', padding: '2px 8px', fontWeight: 700, fontSize: '1em', boxShadow: '0 1px 4px rgba(0,0,0,0.15)'}}>
          {item.word}
        </span>
      ))}
    </div>
    <div className="text-xs text-gray-500 mt-1">Yellow: supports verdict, Cyan: contradicts</div>
  </div>
)}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Check with ML Model"}
          </Button>
        </CardFooter>
      </form>
      {/* Only show feedback and evidence sections after ML check */}
      {showCommunitySection && (
        <>
          <FeedbackSection query={query} result={result || ""} />
          <CrowdsourceEvidenceSection query={query} />
        </>
      )}
    </Card>
  );
};

// --- Feedback Section ---

interface Feedback {
  query: string;
  result: string;
  feedback: 'correct' | 'incorrect';
  timestamp: number;
}

function getFeedbackKey(query: string, result: string) {
  return `ml-feedback:${query}:${result}`;
}

const FeedbackSection: React.FC<{ query: string; result: string }> = ({ query, result }) => {
  const [submitted, setSubmitted] = React.useState<boolean>(() => {
    const key = getFeedbackKey(query, result);
    return Boolean(localStorage.getItem(key));
  });
  const [thanks, setThanks] = React.useState(false);

  const handleFeedback = (feedback: 'correct' | 'incorrect') => {
    const key = getFeedbackKey(query, result);
    if (!localStorage.getItem(key)) {
      const entry: Feedback = {
        query,
        result,
        feedback,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(entry));
      setSubmitted(true);
      setThanks(true);
      setTimeout(() => setThanks(false), 2000);
    }
  };

  if (!query || !result) return null;
  if (submitted)
    return (
      <div className="mt-3 text-green-600 dark:text-green-400 font-semibold">Thank you for your feedback!</div>
    );

  return (
    <div className="mt-3">
      <span>Was this prediction correct? </span>
      <button
        className="ml-2 px-3 py-1 bg-green-500 hover:bg-green-700 text-white rounded shadow"
        onClick={() => handleFeedback('correct')}
        aria-label="Mark as correct"
      >
        Correct
      </button>
      <button
        className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded shadow"
        onClick={() => handleFeedback('incorrect')}
        aria-label="Mark as incorrect"
      >
        Incorrect
      </button>
      {thanks && (
        <span className="ml-3 text-green-600 dark:text-green-400 font-semibold">Thank you!</span>
      )}
    </div>
  );
};

import { CommunityVerdictSummary } from "./CommunityVerdictSummary";
// --- Crowdsourced Evidence Section ---

interface Vote {
  user_id: string;
  reason: string;
}
interface Evidence {
  text: string;
  url?: string;
  timestamp: number;
  user_id: string;
  verdict: "Fake" | "Real";
  correct_votes?: Vote[];
  incorrect_votes?: Vote[];
}

function getEvidenceKey(query: string) {
  return `ml-evidence:${query}`;
}

const CrowdsourceEvidenceSection: React.FC<{ query: string }> = ({ query }) => {
  const [evidenceText, setEvidenceText] = React.useState("");
  const [evidenceUrl, setEvidenceUrl] = React.useState("");
  const [verdict, setVerdict] = React.useState<"Fake" | "Real">("Fake");
  const [submitted, setSubmitted] = React.useState(false);
  const [allEvidence, setAllEvidence] = useState<Evidence[]>([]);
  const [voteModal, setVoteModal] = useState<{ open: boolean, idx: number, voteType: 'correct'|'incorrect', reason: string } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  
  // Get a storage key for this query
  const storageKey = `local-evidence-${query}`;
  
  // Track user's votes for this query (to prevent double voting)
  const [userVotes, setUserVotes] = React.useState<{ [idx: number]: 'approve' | 'correct' | null }>({});
  const [editingIdx, setEditingIdx] = React.useState<number | null>(null);
  const [editText, setEditText] = React.useState("");
  const [editUrl, setEditUrl] = React.useState("");
  const [editVerdict, setEditVerdict] = React.useState<"Fake" | "Real">("Fake");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch evidence from localStorage
  React.useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    
    try {
      // Get data from localStorage
      const storedData = localStorage.getItem(storageKey);
      const data: Evidence[] = storedData ? JSON.parse(storedData) : [];
      
      setAllEvidence(data);
      // Set userVotes from evidence
      const votes: { [idx: number]: 'approve' | 'correct' | null } = {};
      data.forEach((ev: any, idx: number) => {
        if (ev.correct_votes?.some(v => v.user_id === getUserId())) {
          votes[idx] = 'approve';
        } else if (ev.incorrect_votes?.some(v => v.user_id === getUserId())) {
          votes[idx] = 'correct';
        } else {
          votes[idx] = null;
        }
      });
      setUserVotes(votes);
    } catch (error) {
      setError("Failed to fetch evidence.");
      console.error("Error fetching evidence:", error);
    } finally {
      setLoading(false);
    }
  }, [query, submitted, storageKey]);

  // Handle voting for evidence
  async function handleVote(idx: number, voteType: 'correct'|'incorrect', reason: string, retract: boolean) {
    const storedData = localStorage.getItem(storageKey);
    const data: Evidence[] = storedData ? JSON.parse(storedData) : [];
    
    if (!data[idx]) return;
    
    // Initialize the arrays if they don't exist
    if (!data[idx].correct_votes) data[idx].correct_votes = [];
    if (!data[idx].incorrect_votes) data[idx].incorrect_votes = [];
    
    const userId = getUserId();
    
    if (retract) {
      // Remove vote
      if (voteType === 'correct') {
        data[idx].correct_votes = data[idx].correct_votes?.filter(v => v.user_id !== userId);
      } else {
        data[idx].incorrect_votes = data[idx].incorrect_votes?.filter(v => v.user_id !== userId);
      }
    } else {
      // Add vote
      const vote = { user_id: userId, reason };
      
      // First remove any existing votes from this user
      data[idx].correct_votes = data[idx].correct_votes?.filter(v => v.user_id !== userId);
      data[idx].incorrect_votes = data[idx].incorrect_votes?.filter(v => v.user_id !== userId);
      
      // Then add the new vote
      if (voteType === 'correct') {
        data[idx].correct_votes?.push(vote);
      } else {
        data[idx].incorrect_votes?.push(vote);
      }
    }
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    // Update state
    setAllEvidence([...data]);
  }

  // Submit new evidence
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceText.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      // Create new evidence
      const newEvidence: Evidence = {
        text: evidenceText.trim(),
        url: evidenceUrl.trim() || undefined,
        timestamp: Date.now(),
        user_id: getUserId(),
        verdict,
        correct_votes: [],
        incorrect_votes: []
      };
      
      // Get existing data
      const storedData = localStorage.getItem(storageKey);
      const data: Evidence[] = storedData ? JSON.parse(storedData) : [];
      
      // Add new evidence
      data.push(newEvidence);
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Update UI
      setEvidenceText("");
      setEvidenceUrl("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      
      // Update the list
      setAllEvidence([...data]);
    } catch (err) {
      setError("Failed to submit evidence.");
      console.error("Error submitting evidence:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete evidence
  const handleDelete = async (idx: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get existing data
      const storedData = localStorage.getItem(storageKey);
      const data: Evidence[] = storedData ? JSON.parse(storedData) : [];
      
      // Check if user is the author
      if (data[idx]?.user_id !== getUserId()) {
        throw new Error("You can only delete your own evidence");
      }
      
      // Remove the evidence
      data.splice(idx, 1);
      
      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Update the list
      setAllEvidence([...data]);
    } catch (error) {
      setError("Failed to delete evidence.");
      console.error("Error deleting evidence:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit evidence
  const handleEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditText(allEvidence[idx].text);
    setEditUrl(allEvidence[idx].url || "");
    setEditVerdict(allEvidence[idx].verdict);
  };

  const handleEditSubmit = async (idx: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get existing data
      const storedData = localStorage.getItem(storageKey);
      const data: Evidence[] = storedData ? JSON.parse(storedData) : [];
      
      // Check if user is the author
      if (data[idx]?.user_id !== getUserId()) {
        throw new Error("You can only edit your own evidence");
      }
      
      // Update the evidence
      data[idx] = {
        ...data[idx],
        text: editText.trim(),
        url: editUrl.trim() || undefined,
        verdict: editVerdict
      };
      
      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Reset edit state
      setEditingIdx(null);
      setEditText("");
      setEditUrl("");
      
      // Update the list
      setAllEvidence([...data]);
    } catch (error) {
      setError("Failed to update evidence.");
      console.error("Error updating evidence:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingIdx(null);
    setEditText("");
    setEditUrl("");
  };

  if (!query) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="font-semibold mb-2">Contribute Your Own Fact-Check or Evidence</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-2">
        <div className="flex gap-3 items-center">
          <label className="font-semibold">Your verdict:</label>
          <label className="flex items-center gap-1">
            <input type="radio" name="verdict" value="Fake" checked={verdict === "Fake"} onChange={() => setVerdict("Fake")}/>
            <span className="text-yellow-500 font-bold">Fake</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="verdict" value="Real" checked={verdict === "Real"} onChange={() => setVerdict("Real")}/>
            <span className="text-cyan-400 font-bold">Real</span>
          </label>
        </div>
        <textarea
          className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={2}
          placeholder="Write your evidence, fact-check, or supporting info..."
          value={evidenceText}
          onChange={e => setEvidenceText(e.target.value)}
          required
        />
        <input
          className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="url"
          placeholder="Optional: Source URL (https://...)"
          value={evidenceUrl}
          onChange={e => setEvidenceUrl(e.target.value)}
        />
        <button
          type="submit"
          className="self-start px-4 py-1 bg-blue-600 hover:bg-blue-800 text-white rounded shadow"
          disabled={!evidenceText.trim()}
        >
          Submit Evidence
        </button>
      </form>
      <div className="mt-2">
        {/* Community verdict summary */}
        <CommunityVerdictSummary evidence={allEvidence} />
        <div className="font-semibold mb-1">User-Submitted Evidence for this Claim:</div>
          <div className="flex flex-col gap-4">
            {allEvidence
              .map((ev, idx) => ({ ...ev, idx }))
              .sort((a, b) => {
                // Sort by (correct_votes-incorrect_votes), then recency
                const aScore = (a.correct_votes?.length || 0) - (a.incorrect_votes?.length || 0);
                const bScore = (b.correct_votes?.length || 0) - (b.incorrect_votes?.length || 0);
                if (bScore !== aScore) return bScore - aScore;
                return b.timestamp - a.timestamp;
              })
              .map((ev, _orderIdx) => {
                const idx = ev.idx;
                const isMine = ev.user_id === getUserId();
                const hasCorrect = ev.correct_votes?.some(v => v.user_id === getUserId());
                const hasIncorrect = ev.incorrect_votes?.some(v => v.user_id === getUserId());
                const correctList = ev.correct_votes || [];
                const incorrectList = ev.incorrect_votes || [];
                return (
                  <div key={idx} className="relative rounded-2xl bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-neutral-800 p-0 overflow-hidden mb-4">
                    {/* X-style consensus banner */}
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 text-sm px-5 py-2 font-semibold border-b border-blue-200 dark:border-blue-800">
                      <span className="align-middle">Readers added context they thought people might want to know.</span>
                    </div>
                    {/* Community Note main text */}
                    <div className="px-5 pt-4 pb-2">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Community Note</div>
                      <div className="bg-gray-100 dark:bg-neutral-800 rounded-xl px-4 py-3 text-xl text-gray-800 dark:text-gray-200 font-medium mb-3 leading-snug">
                        {ev.text}
                      </div>
                    </div>
                    {/* Avatars for correct/incorrect votes */}
                    <div className="px-5 flex flex-col gap-2 mb-2">
                      {/* Correct voters */}
                      {correctList.length > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-700 dark:text-green-300 font-bold">Helpful:</span>
                            {correctList.map((v, i) => (
                              <span
                                key={v.user_id}
                                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mr-1 shadow-sm border-2 border-white dark:border-neutral-900 ${i % 2 === 0 ? 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100' : 'bg-green-300 dark:bg-green-800 text-green-900 dark:text-green-100'}`}
                                title={v.reason ? `${v.user_id === getUserId() ? 'You' : v.user_id.slice(0,8)}: ${v.reason}` : (v.user_id === getUserId() ? 'You' : v.user_id.slice(0,8))}
                              >
                                {(v.user_id === getUserId() ? 'Y' : v.user_id[0]?.toUpperCase() || '?')}
                              </span>
                            ))}
                          </div>
                          <div className="mt-1 ml-2 flex flex-col gap-1">
                            {correctList.map((v) => (
                              <div key={v.user_id} className="text-xs text-green-900 dark:text-green-100">
                                <span className="font-semibold">{v.user_id === getUserId() ? 'You' : v.user_id.slice(0,8)}</span>
                                {': '}
                                {v.reason ? <span className="italic">{v.reason}</span> : <span className="text-gray-400">No reason provided.</span>}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {/* Incorrect voters */}
                      {incorrectList.length > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-700 dark:text-red-300 font-bold">Not Helpful:</span>
                            {incorrectList.map((v, i) => (
                              <span
                                key={v.user_id}
                                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mr-1 shadow-sm border-2 border-white dark:border-neutral-900 ${i % 2 === 0 ? 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100' : 'bg-red-300 dark:bg-red-800 text-red-900 dark:text-red-100'}`}
                                title={v.reason ? `${v.user_id === getUserId() ? 'You' : v.user_id.slice(0,8)}: ${v.reason}` : (v.user_id === getUserId() ? 'You' : v.user_id.slice(0,8))}
                              >
                                {(v.user_id === getUserId() ? 'Y' : v.user_id[0]?.toUpperCase() || '?')}
                              </span>
                            ))}
                          </div>
                          <div className="mt-1 ml-2 flex flex-col gap-1">
                            {incorrectList.map((v) => (
                              <div key={v.user_id} className="text-xs text-red-900 dark:text-red-100">
                                <span className="font-semibold">{v.user_id === getUserId() ? 'You' : v.user_id.slice(0,8)}</span>
                                {': '}
                                {v.reason ? <span className="italic">{v.reason}</span> : <span className="text-gray-400">No reason provided.</span>}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {/* Verdict, author, timestamp row */}
                    <div className="px-5 pb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${ev.verdict === 'Fake' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-700 dark:text-cyan-100'}`}>{ev.verdict === 'Fake' ? 'Fake' : 'Real'}</span>
                      <span>{isMine ? 'You' : ev.user_id.slice(0, 8)}</span>
                      <span className="ml-2">{new Date(ev.timestamp).toLocaleString()}</span>
                      {ev.url && (
                        <a href={ev.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 underline">Source</a>
                      )}
                    </div>
                    {/* Action buttons */}
                    <div className="px-5 pb-4 flex gap-3 mt-2">
                      <button
                        className={`px-5 py-1 rounded-full font-semibold shadow-sm border transition-colors duration-150 ${hasCorrect ? 'bg-green-600 text-white border-green-700' : 'bg-gray-50 dark:bg-neutral-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-800'}`}
                        onClick={() => {
                          if (hasCorrect) {
                            handleVote(idx, 'correct', '', true);
                          } else {
                            setVoteModal({ open: true, idx, voteType: 'correct', reason: '' });
                          }
                        }}
                        type="button"
                      >
                        👍 Mark as Helpful
                      </button>
                      <button
                        className={`px-5 py-1 rounded-full font-semibold shadow-sm border transition-colors duration-150 ${hasIncorrect ? 'bg-red-600 text-white border-red-700' : 'bg-gray-50 dark:bg-neutral-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-800'}`}
                        onClick={() => {
                          if (hasIncorrect) {
                            handleVote(idx, 'incorrect', '', true);
                          } else {
                            setVoteModal({ open: true, idx, voteType: 'incorrect', reason: '' });
                          }
                        }}
                        type="button"
                      >
                        ✗ Mark as Not Helpful
                      </button>
                      {voteModal && (
                        <VoteReasonModal
                          open={voteModal.open}
                          voteType={voteModal.voteType}
                          reason={voteModal.reason}
                          setReason={r => setVoteModal(v => v ? { ...v, reason: r } : v)}
                          onCancel={() => setVoteModal(null)}
                          onSubmit={() => {
                            if (voteModal) {
                              handleVote(voteModal.idx, voteModal.voteType, voteModal.reason, false);
                              setVoteModal(null);
                            }
                          }}
                        />
                      )}
                      {isMine && (
                        <>
                          <button className="ml-2 px-2 py-1 bg-yellow-400 hover:bg-yellow-600 text-black rounded" onClick={() => handleEdit(idx)} type="button">Edit</button>
                          <button className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded" onClick={() => handleDelete(idx)} type="button">Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      
    </div>
  );
};

export default FactCheckFormML;
