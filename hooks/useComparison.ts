"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnalysisComparisonResult, AnalysisRunMetadata } from "@/types/comparison";

interface UseComparisonProps {
  reportId?: string;
  initialBaseRunId?: string;
  initialTargetRunId?: string;
}

export function useComparison({
  reportId,
  initialBaseRunId,
  initialTargetRunId,
}: UseComparisonProps) {
  const [comparison, setComparison] = useState<AnalysisComparisonResult | null>(null);
  const [availableRuns, setAvailableRuns] = useState<AnalysisRunMetadata[]>([]);
  const [hasMultipleRuns, setHasMultipleRuns] = useState(false);
  const [baseRunId, setBaseRunId] = useState<string | undefined>(initialBaseRunId);
  const [targetRunId, setTargetRunId] = useState<string | undefined>(initialTargetRunId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    if (!reportId) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (baseRunId) params.set("baseRunId", baseRunId);
      if (targetRunId) params.set("targetRunId", targetRunId);

      const qs = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/analysis/${reportId}/compare${qs}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load analysis comparison");
      }

      const data = await res.json();
      if (data.success) {
        setComparison(data.comparison || null);
        setAvailableRuns(data.availableRuns || []);
        setHasMultipleRuns(data.hasMultipleRuns ?? Boolean(data.availableRuns?.length > 1));
      }
    } catch (err: unknown) {
      console.warn("[USE COMPARISON] Error fetching comparison:", err);
      setError(err instanceof Error ? err.message : "Failed to load comparison");
    } finally {
      setIsLoading(false);
    }
  }, [reportId, baseRunId, targetRunId]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const selectRuns = (newBaseId: string, newTargetId: string) => {
    setBaseRunId(newBaseId);
    setTargetRunId(newTargetId);
  };

  return {
    comparison,
    availableRuns,
    hasMultipleRuns,
    baseRunId,
    targetRunId,
    isLoading,
    error,
    selectRuns,
    refetch: fetchComparison,
  };
}
