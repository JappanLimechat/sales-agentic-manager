"use client"

import { useQuery } from '@tanstack/react-query'

interface TranscriptInsights {
  meeting_quality_index: number
  company_sentiment: number
  feature_requests: Record<string, number>
  competitor_mentions: Record<string, number>
  prospect_blockers: Record<string, number>
  summary: string
}

export function useTranscriptInsights(insightId: number | string | null) {
  return useQuery({
    queryKey: ['transcript-insights', insightId],
    queryFn: async (): Promise<TranscriptInsights> => {
      if (!insightId) {
        throw new Error('No insight ID provided')
      }
      
      const response = await fetch(
        `https://3f47e4fc6dbd.ngrok-free.app/transcript/insight?insight_id=${insightId}`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    },
    enabled: !!insightId, // Only run query if insightId exists
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })
}