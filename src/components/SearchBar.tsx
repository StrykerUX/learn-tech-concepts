'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { Term } from '@/types'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Term[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [allTerms, setAllTerms] = useState<Term[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Memoizar Fuse para evitar recreación en cada render
  const fuse = useMemo(() => new Fuse(allTerms, {
    keys: ['metadata.title', 'metadata.tags', 'content'],
    threshold: 0.4,
    includeScore: true
  }), [allTerms])

  useEffect(() => {
    // En una implementación real, esto vendría de una API
    // Por ahora, simulamos algunos términos básicos
    const mockTerms: Term[] = [
      {
        slug: 'nextjs',
        metadata: {
          title: 'Next.js',
          category: 'frontend',
          difficulty: 'intermedio',
          tags: ['react', 'framework'],
          relacionados: ['react'],
          tiempo_lectura: 4
        },
        content: '',
        filePath: '/frontend/nextjs'
      },
      {
        slug: 'react',
        metadata: {
          title: 'React',
          category: 'frontend',
          difficulty: 'intermedio',
          tags: ['javascript', 'library'],
          relacionados: ['nextjs'],
          tiempo_lectura: 5
        },
        content: '',
        filePath: '/frontend/react'
      }
    ]
    setAllTerms(mockTerms)
  }, [])

  useEffect(() => {
    if (query.length > 2 && allTerms.length > 0) {
      const searchResults = fuse.search(query).slice(0, 5)
      setResults(searchResults.map(result => result.item))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, fuse, allTerms.length])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectResult = (term: Term) => {
    router.push(`/terminos${term.filePath}`)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar términos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((term) => (
            <button
              key={term.slug}
              onClick={() => handleSelectResult(term)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{term.metadata.title}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-2">
                <span className="capitalize">{term.metadata.category}</span>
                <span>•</span>
                <span>{term.metadata.difficulty}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {isOpen && query.length > 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-gray-500 text-center">No se encontraron resultados para &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  )
}