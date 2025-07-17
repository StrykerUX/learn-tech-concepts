'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProgressData, Term } from '@/types'

export default function ProgresoPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [allTerms, setAllTerms] = useState<Term[]>([])

  // Mock terms data - en una app real esto vendría de una API
  useEffect(() => {
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
      },
      {
        slug: 'wireframe',
        metadata: {
          title: 'Wireframe',
          category: 'ux-ui',
          difficulty: 'facil',
          tags: ['diseño', 'prototipo'],
          relacionados: ['mockup'],
          tiempo_lectura: 3
        },
        content: '',
        filePath: '/ux-ui/wireframe'
      },
      {
        slug: 'api',
        metadata: {
          title: 'API',
          category: 'general',
          difficulty: 'facil',
          tags: ['backend', 'comunicacion'],
          relacionados: ['rest'],
          tiempo_lectura: 4
        },
        content: '',
        filePath: '/general/api'
      },
      {
        slug: 'html',
        metadata: {
          title: 'HTML',
          category: 'frontend',
          difficulty: 'facil',
          tags: ['markup', 'estructura'],
          relacionados: ['css'],
          tiempo_lectura: 3
        },
        content: '',
        filePath: '/frontend/html'
      }
    ]
    setAllTerms(mockTerms)
  }, [])

  useEffect(() => {
    // Obtener progreso del localStorage
    const savedProgress = localStorage.getItem('techWiki_progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    } else {
      // Crear progreso inicial
      const initialProgress: ProgressData = {
        visitedTerms: [],
        readingPaths: [],
        timeSpent: {},
        lastVisit: new Date().toISOString(),
        badges: []
      }
      setProgress(initialProgress)
      localStorage.setItem('techWiki_progress', JSON.stringify(initialProgress))
    }
  }, [])

  if (!progress) {
    return <div className="text-center py-12">Cargando progreso...</div>
  }

  const visitedTerms = allTerms.filter(term => progress.visitedTerms.includes(term.slug))
  const progressPercentage = Math.round((progress.visitedTerms.length / allTerms.length) * 100)
  
  const categoryCounts = {
    frontend: visitedTerms.filter(t => t.metadata.category === 'frontend').length,
    'ux-ui': visitedTerms.filter(t => t.metadata.category === 'ux-ui').length,
    backend: visitedTerms.filter(t => t.metadata.category === 'backend').length,
    general: visitedTerms.filter(t => t.metadata.category === 'general').length
  }

  const totalReadingTime = visitedTerms.reduce((acc, term) => acc + term.metadata.tiempo_lectura, 0)

  const availableBadges = [
    {
      id: 'first_step',
      name: 'Primer Paso',
      description: 'Lee tu primer término',
      icon: '🎯',
      earned: progress.visitedTerms.length >= 1
    },
    {
      id: 'frontend_explorer',
      name: 'Frontend Explorer',
      description: 'Lee 3 términos de Frontend',
      icon: '💻',
      earned: categoryCounts.frontend >= 3
    },
    {
      id: 'ux_enthusiast',
      name: 'UX Enthusiast',
      description: 'Lee 3 términos de UX/UI',
      icon: '🎨',
      earned: categoryCounts['ux-ui'] >= 3
    },
    {
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Lee 10 términos en total',
      icon: '📚',
      earned: progress.visitedTerms.length >= 10
    },
    {
      id: 'rabbit_hole',
      name: 'Rabbit Hole Master',
      description: 'Sigue 5 enlaces consecutivos',
      icon: '🐰',
      earned: progress.readingPaths.some(path => path.length >= 5)
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu Progreso de Aprendizaje</h1>
        <p className="text-gray-600">
          Sigue tu progreso mientras exploras conceptos de desarrollo y UX/UI
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{progress.visitedTerms.length}</div>
          <div className="text-gray-600">Términos Leídos</div>
          <div className="text-sm text-gray-500">de {allTerms.length} disponibles</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{progressPercentage}%</div>
          <div className="text-gray-600">Completado</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{width: `${progressPercentage}%`}}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{totalReadingTime}</div>
          <div className="text-gray-600">Minutos de Lectura</div>
          <div className="text-sm text-gray-500">tiempo invertido</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {availableBadges.filter(b => b.earned).length}
          </div>
          <div className="text-gray-600">Badges Ganados</div>
          <div className="text-sm text-gray-500">de {availableBadges.length} disponibles</div>
        </div>
      </div>

      {/* Progreso por categoría */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Progreso por Categoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => {
            const categoryTerms = allTerms.filter(t => t.metadata.category === category).length
            const percentage = categoryTerms > 0 ? Math.round((count / categoryTerms) * 100) : 0
            
            const categoryInfo = {
              frontend: { name: 'Frontend', icon: '💻', color: 'text-blue-600' },
              'ux-ui': { name: 'UX/UI', icon: '🎨', color: 'text-purple-600' },
              backend: { name: 'Backend', icon: '⚙️', color: 'text-green-600' },
              general: { name: 'General', icon: '📚', color: 'text-orange-600' }
            }
            
            const info = categoryInfo[category as keyof typeof categoryInfo]
            
            return (
              <div key={category} className="text-center">
                <div className="text-2xl mb-2">{info.icon}</div>
                <div className="font-medium text-gray-900">{info.name}</div>
                <div className={`text-lg font-bold ${info.color}`}>
                  {count}/{categoryTerms}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      category === 'frontend' ? 'bg-blue-600' :
                      category === 'ux-ui' ? 'bg-purple-600' :
                      category === 'backend' ? 'bg-green-600' : 'bg-orange-600'
                    }`}
                    style={{width: `${percentage}%`}}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{percentage}%</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Badges */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Logros y Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableBadges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                badge.earned 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="font-medium mb-1">{badge.name}</div>
              <div className="text-sm">{badge.description}</div>
              {badge.earned && (
                <div className="mt-2 text-xs font-medium text-green-600">✓ Completado</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Términos recientes */}
      {visitedTerms.length > 0 && (
        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Términos Leídos Recientemente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitedTerms.slice(-6).reverse().map((term) => (
              <Link
                key={term.slug}
                href={`/terminos${term.filePath}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 mb-2">{term.metadata.title}</h3>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <span className="capitalize">{term.metadata.category}</span>
                  <span>•</span>
                  <span>{term.metadata.difficulty}</span>
                  <span>•</span>
                  <span>⏱️ {term.metadata.tiempo_lectura} min</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to action */}
      {progress.visitedTerms.length === 0 && (
        <div className="text-center py-12 bg-blue-50 rounded-lg">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Comienza tu aprendizaje!</h2>
          <p className="text-gray-600 mb-4">
            Explora nuestro catálogo de términos y comienza a ganar badges
          </p>
          <Link 
            href="/categorias"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
          >
            <span>Explorar Categorías</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}