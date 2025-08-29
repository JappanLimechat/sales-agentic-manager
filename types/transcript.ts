export interface Transcript {
  id: number
  company: string
  poc: string
  ae: string
  transcript: string
  timestamp: string
  custom_metadata: Record<string, any>
}

export interface TranscriptResponse {
  items: Transcript[]
  meta: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface TranscriptFilters {
  page?: number
  limit?: number
  company?: string
  ae?: string
  poc?: string
  start_date?: string
  end_date?: string
}

export interface CreateTranscriptData {
  company: string
  poc: string
  ae: string
  transcript: string
  custom_metadata?: Record<string, any>
}

export interface UpdateTranscriptData extends Partial<CreateTranscriptData> {
  id: number
}