import Link from 'next/link'
import { getAllTerms, getTermUrl } from '@/lib/content'

export default function CategoriasPage() {
  const allTerms = getAllTerms()
  
  const categories = [
    {
      name: 'Frontend',
      slug: 'frontend',
      icon: '💻',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      description: 'Tecnologías del lado del cliente como React, HTML, CSS',
      terms: allTerms.filter(t => t.filePath.startsWith('/frontend/'))
    },
    {
      name: 'UX/UI',
      slug: 'ux-ui',
      icon: '🎨',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      description: 'Diseño de experiencia e interfaz de usuario',
      terms: allTerms.filter(t => t.filePath.startsWith('/ux-ui/'))
    },
    {
      name: 'Backend',
      slug: 'backend',
      icon: '⚙️',
      color: 'bg-green-50 border-green-200 text-green-800',
      description: 'Tecnologías del lado del servidor y APIs',
      terms: allTerms.filter(t => t.filePath.startsWith('/backend/'))
    },
    {
      name: 'General',
      slug: 'general',
      icon: '📚',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      description: 'Conceptos generales de tecnología y desarrollo',
      terms: allTerms.filter(t => t.filePath.startsWith('/general/'))
    },
    {
      name: 'Herramientas',
      slug: 'herramientas',
      icon: '🔧',
      color: 'bg-gray-50 border-gray-200 text-gray-800',
      description: 'Herramientas de desarrollo como Git, Docker, editores',
      terms: allTerms.filter(t => t.filePath.startsWith('/tools/'))
    },
    {
      name: 'Conceptos',
      slug: 'conceptos',
      icon: '💡',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      description: 'Conceptos fundamentales de programación y protocolos web',
      terms: allTerms.filter(t => t.filePath.startsWith('/concepts/'))
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Todas las Categorías</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explora todos los conceptos organizados por área de conocimiento
        </p>
      </div>

      <div className="grid gap-8">
        {categories.map((category) => (
          <div key={category.slug} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className={`p-6 border-l-4 ${category.color}`}>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.terms.length} término{category.terms.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              {category.terms.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {category.terms.slice(0, 6).map((term) => (
                      <Link
                        key={term.slug}
                        href={getTermUrl(term.filePath)}
                        className="block p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-gray-900 mb-1">{term.metadata.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <span className={`px-2 py-1 rounded-full ${
                            term.metadata.difficulty === 'Principiante' ? 'bg-green-100 text-green-800' :
                            term.metadata.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {term.metadata.difficulty}
                          </span>
                          <span>⏱️ {term.metadata.tiempo_lectura || 5} min</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {category.terms.length > 6 && (
                    <Link
                      href={`/categorias/${category.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver todos los {category.terms.length} términos
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">Próximamente se agregarán términos a esta categoría</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}