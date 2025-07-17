export interface TermMetadata {
  title: string
  category: 'frontend' | 'ux-ui' | 'backend' | 'general'
  difficulty: 'facil' | 'intermedio' | 'avanzado'
  tags: string[]
  relacionados: string[]
  tiempo_lectura: number
  descripcion_corta?: string
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