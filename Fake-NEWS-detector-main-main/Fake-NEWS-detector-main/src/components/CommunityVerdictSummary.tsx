import React from "react";

interface Evidence {
  verdict: "Fake" | "Real";
}

export const CommunityVerdictSummary: React.FC<{ evidence: Evidence[] }> = ({ evidence }) => {
  if (!evidence.length) return null;
  const fakeCount = evidence.filter(ev => ev.verdict === "Fake").length;
  const realCount = evidence.filter(ev => ev.verdict === "Real").length;
  const total = fakeCount + realCount;
  const fakePct = ((fakeCount / total) * 100).toFixed(1);
  const realPct = ((realCount / total) * 100).toFixed(1);
  let verdict = "No clear consensus";
  if (fakeCount > realCount) verdict = "Fake";
  if (realCount > fakeCount) verdict = "Real";
  return (
    <div className="mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 flex items-center gap-2">
      <span className="font-semibold">Community verdict:</span>
      <span className="text-yellow-500 font-bold">Fake {fakePct}%</span>
      <span className="text-cyan-400 font-bold">Real {realPct}%</span>
      <span className="ml-2 px-2 py-1 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold">{verdict}</span>
    </div>
  );
};
