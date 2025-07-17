import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTermsByCategory, getTermUrl } from '@/lib/content'

interface PageProps {
  params: Promise<{
    category: string
  }>
}

const categoryInfo: Record<string, { name: string; icon: string; description: string; folder: string }> = {
  'frontend': {
    name: 'Frontend',
    icon: '💻',
    description: 'Tecnologías del lado del cliente como React, HTML, CSS, JavaScript y frameworks modernos',
    folder: 'frontend'
  },
  'ux-ui': {
    name: 'UX/UI',
    icon: '🎨',
    description: 'Diseño de experiencia e interfaz de usuario, wireframes, prototipos y metodologías de diseño',
    folder: 'ux-ui'
  },
  'backend': {
    name: 'Backend',
    icon: '⚙️',
    description: 'Tecnologías del lado del servidor, APIs, bases de datos y arquitectura de sistemas',
    folder: 'backend'
  },
  'general': {
    name: 'General',
    icon: '📚',
    description: 'Conceptos generales de tecnología, desarrollo de software y metodologías',
    folder: 'general'
  },
  'herramientas': {
    name: 'Herramientas',
    icon: '🔧',
    description: 'Herramientas de desarrollo como Git, Docker, editores y utilidades para programadores',
    folder: 'tools'
  },
  'conceptos': {
    name: 'Conceptos',
    icon: '💡',
    description: 'Conceptos fundamentales de programación, protocolos web y principios de desarrollo',
    folder: 'concepts'
  }
}

export async function generateStaticParams() {
  return Object.keys(categoryInfo).map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params
  const info = categoryInfo[category]
  
  if (!info) {
    return {
      title: 'Categoría no encontrada'
    }
  }

  return {
    title: `${info.name} - Tech Wiki`,
    description: info.description,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const info = categoryInfo[category]
  
  if (!info) {
    notFound()
  }

  const terms = getTermsByCategory(info.folder)

  const difficultyGroups = {
    'Principiante': terms.filter(t => t.metadata.difficulty === 'Principiante'),
    'Intermedio': terms.filter(t => t.metadata.difficulty === 'Intermedio'),
    'Avanzado': terms.filter(t => t.metadata.difficulty === 'Avanzado')
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>→</span>
        <Link href="/categorias" className="hover:text-gray-700">Categorías</Link>
        <span>→</span>
        <span className="text-gray-900">{info.name}</span>
      </nav>

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">{info.icon}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{info.name}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          {info.description}
        </p>
        <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
          <span>{terms.length} término{terms.length !== 1 ? 's' : ''} disponible{terms.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{Math.round(terms.reduce((acc, term) => acc + (term.metadata.tiempo_lectura || 5), 0))} min de lectura total</span>
        </div>
      </div>

      {terms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h2>
          <p className="text-gray-600">
            Estamos trabajando en agregar términos a esta categoría. ¡Vuelve pronto!
          </p>
        </div>
      ) : (
        <>
          {/* Por dificultad */}
          {Object.entries(difficultyGroups).map(([difficulty, difficultyTerms]) => {
            if (difficultyTerms.length === 0) return null
            
            const difficultyConfig = {
              'Principiante': { name: 'Principiante', color: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-800' },
              'Intermedio': { name: 'Intermedio', color: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' },
              'Avanzado': { name: 'Avanzado', color: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-800' }
            }
            
            const config = difficultyConfig[difficulty as keyof typeof difficultyConfig]
            
            return (
              <section key={difficulty}>
                <div className="flex items-center space-x-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{config.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badge}`}>
                    {difficultyTerms.length} término{difficultyTerms.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {difficultyTerms.map((term) => (
                    <Link
                      key={term.slug}
                      href={getTermUrl(term.filePath)}
                      className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${config.color}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{term.metadata.title}</h3>
                        <span className="text-xs text-gray-500">⏱️ {term.metadata.tiempo_lectura || 5} min</span>
                      </div>
                      
                      {(term.metadata.descripcion_corta || term.metadata.description) && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {term.metadata.descripcion_corta || term.metadata.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {term.metadata.tags && term.metadata.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-white bg-opacity-60 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {term.metadata.tags && term.metadata.tags.length > 3 && (
                          <span className="px-2 py-1 bg-white bg-opacity-60 text-xs rounded-full">
                            +{term.metadata.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}