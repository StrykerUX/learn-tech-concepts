export interface TermMetadata {
  title: string
  category: 'Frontend' | 'UX/UI' | 'Backend' | 'General' | 'Tools' | 'Concepts'
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  tags?: string[]
  relacionados?: string[]
  tiempo_lectura?: number
  descripcion_corta?: string
  description?: string
}

export interface Term {
  slug: string
  metadata: TermMetadata
  content: string
  filePath: string
}

export interface SearchResult {
  item: Term
  score?: number
}

export interface ProgressData {
  visitedTerms: string[]
  readingPaths: string[][]
  timeSpent: Record<string, number>
  lastVisit: string
  badges: string[]
}