export interface Analysis {
  id: string;
  documentId: string;
  summary: string;
  topics: string[];
  insights: string;
  createdAt: string;
  document?: {
    id: string;
    title: string;
    filename: string;
  };
}

export interface CreateAnalysisRequest {
  documentId: string;
  groqApiKey: string;
  customPrompt?: string;
}

export interface AnalysisStats {
  totalAnalyses: number;
  recentAnalyses: number;
  mostFrequentTopics: Array<{
    topic: string;
    count: number;
  }>;
}
