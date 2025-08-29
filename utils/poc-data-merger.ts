import type { POCRecord, TranscriptRecord } from '@/data/pocs';

export type EnhancedPOCRecord = POCRecord & {
  id?: number;
  poc?: string;
  transcript?: string;
  timestamp?: string;
  lastContact?: string;
  nextAction?: string;
  custom_metadata?: Record<string, any>;
};

/**
 * Merges static POC data with API transcript data
 * Priority: API data overrides static data when there's a company match
 */
export function mergePOCWithTranscriptData(
  staticPOCs: POCRecord[],
  transcriptData: TranscriptRecord[]
): EnhancedPOCRecord[] {
  // Create a map of transcript data by company for quick lookup
  const transcriptMap = new Map<string, TranscriptRecord>();
  transcriptData.forEach(transcript => {
    transcriptMap.set(transcript.company.toLowerCase(), transcript);
  });

  // First, enhance static POCs with transcript data where available
  const enhancedStaticPOCs: EnhancedPOCRecord[] = staticPOCs.map(poc => {
    const transcript = transcriptMap.get(poc.company.toLowerCase());
    
    if (transcript) {
      // Mark this transcript as used
      transcriptMap.delete(poc.company.toLowerCase());
      
      return {
        ...poc,
        id: transcript.id,
        poc: transcript.poc,
        transcript: transcript.transcript,
        timestamp: transcript.timestamp,
        lastContact: new Date(transcript.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        // Update stage and sentiment based on transcript if available
        stage: deriveStageFromTranscript(transcript.transcript) || poc.stage,
        sentiment: deriveSentimentFromTranscript(transcript.transcript) || poc.sentiment,
        nextAction: deriveNextActionFromStage(
          deriveStageFromTranscript(transcript.transcript) || poc.stage
        ),
        custom_metadata: transcript.custom_metadata
      };
    }

    // If no transcript data, return enhanced static POC with derived next action
    return {
      ...poc,
      nextAction: deriveNextActionFromStage(poc.stage),
      lastContact: 'N/A'
    };
  });

  // Then, add any remaining transcript data that doesn't match static POCs
  const additionalPOCs: EnhancedPOCRecord[] = Array.from(transcriptMap.values()).map(transcript => {
    const stage = deriveStageFromTranscript(transcript.transcript);
    const sentiment = deriveSentimentFromTranscript(transcript.transcript);
    
    return {
      company: transcript.company,
      sector: deriveSectorFromCompany(transcript.company),
      dealSizeINR: Math.floor(Math.random() * 30000000) + 5000000, // Mock deal size, could be enhanced
      city: deriveCityFromCompany(transcript.company),
      cityRegion: deriveRegionFromCity(deriveCityFromCompany(transcript.company)),
      stage,
      ae: transcript.ae,
      sentiment,
      id: transcript.id,
      poc: transcript.poc,
      transcript: transcript.transcript,
      timestamp: transcript.timestamp,
      lastContact: new Date(transcript.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      nextAction: deriveNextActionFromStage(stage),
      custom_metadata: transcript.custom_metadata
    };
  });

  return [...enhancedStaticPOCs, ...additionalPOCs];
}

/**
 * Derives stage from transcript content using keyword analysis
 */
function deriveStageFromTranscript(transcript: string): POCRecord['stage'] {
  const text = transcript.toLowerCase();
  
  if (text.includes('contract') || text.includes('agreement') || text.includes('signing')) {
    return 'Contract';
  } else if (text.includes('pilot') || text.includes('demo') || text.includes('trial')) {
    return 'Pilot';
  } else if (text.includes('negotiate') || text.includes('pricing') || text.includes('budget')) {
    return 'Negotiation';
  } else if (text.includes('proposal') || text.includes('quotation') || text.includes('offer')) {
    return 'Proposal';
  } else {
    return 'Discovery';
  }
}

/**
 * Derives sentiment from transcript content using keyword analysis
 */
function deriveSentimentFromTranscript(transcript: string): POCRecord['sentiment'] {
  const text = transcript.toLowerCase();
  
  // Positive indicators
  const positiveWords = ['excited', 'great', 'perfect', 'excellent', 'love', 'amazing', 'fantastic'];
  const negativeWords = ['concern', 'issue', 'problem', 'worried', 'disappointed', 'difficult'];
  
  const positiveCount = positiveWords.reduce((count, word) => 
    count + (text.includes(word) ? 1 : 0), 0
  );
  const negativeCount = negativeWords.reduce((count, word) => 
    count + (text.includes(word) ? 1 : 0), 0
  );
  
  if (positiveCount > negativeCount && positiveCount > 0) {
    return 'Progressing';
  } else if (negativeCount > 0) {
    return 'At-Risk';
  } else {
    return 'Engaged';
  }
}

/**
 * Derives next action based on stage
 */
function deriveNextActionFromStage(stage: POCRecord['stage']): string {
  const actionMap: Record<POCRecord['stage'], string> = {
    'Discovery': 'Schedule demo',
    'Proposal': 'Follow up proposal',
    'Negotiation': 'Send contract',
    'Pilot': 'Technical call',
    'Contract': 'Final approval'
  };
  
  return actionMap[stage];
}

/**
 * Derives sector from company name (basic heuristics)
 */
function deriveSectorFromCompany(company: string): POCRecord['sector'] {
  const text = company.toLowerCase();
  
  if (text.includes('bank') || text.includes('financial')) return 'BFSI';
  if (text.includes('retail') || text.includes('mart') || text.includes('store')) return 'Retail';
  if (text.includes('tech') || text.includes('software') || text.includes('systems')) return 'IT Services';
  if (text.includes('health') || text.includes('medical') || text.includes('pharma')) return 'Healthcare';
  if (text.includes('food') || text.includes('restaurant') || text.includes('delivery')) return 'FoodTech';
  if (text.includes('education') || text.includes('learning')) return 'EdTech';
  if (text.includes('logistics') || text.includes('transport')) return 'Logistics';
  if (text.includes('commerce') || text.includes('marketplace')) return 'E-commerce';
  
  return 'IT Services'; // Default
}

/**
 * Derives city from company name (basic heuristics - could be enhanced with a proper mapping)
 */
function deriveCityFromCompany(company: string): string {
  // This is a simplified approach - in real world, you'd have a proper company-to-city mapping
  const cities = ['Mumbai', 'Bengaluru', 'Delhi', 'Gurgaon', 'Pune', 'Chennai', 'Hyderabad'];
  return cities[Math.floor(Math.random() * cities.length)];
}

/**
 * Derives region from city
 */
function deriveRegionFromCity(city: string): POCRecord['cityRegion'] {
  const regionMap: Record<string, POCRecord['cityRegion']> = {
    'Mumbai': 'West',
    'Pune': 'West',
    'Bengaluru': 'South',
    'Chennai': 'South',
    'Hyderabad': 'South',
    'Delhi': 'North',
    'Gurgaon': 'North',
    'Faridabad': 'North'
  };
  
  return regionMap[city] || 'All India';
}