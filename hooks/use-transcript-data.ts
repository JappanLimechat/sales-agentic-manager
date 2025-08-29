"use client"

import { useQuery } from '@tanstack/react-query'
import type { TranscriptRecord } from '@/data/pocs'

interface TranscriptResponse {
  items: TranscriptRecord[]
  meta: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function useTranscriptData() {
  return useQuery({
    queryKey: ['transcripts'],
    queryFn: async (): Promise<TranscriptResponse> => {
      const response = await fetch('https://3f47e4fc6dbd.ngrok-free.app/transcripts', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}