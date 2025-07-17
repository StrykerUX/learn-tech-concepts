import Link from 'next/link'
import { getAllTerms, getTermUrl } from '@/lib/content'

export default function HomePage() {
  const allTerms = getAllTerms()
  const recentTerms = allTerms.slice(0, 6)
  
  const categories = [
    {
      name: 'Frontend',
      slug: 'frontend',
      icon: '💻',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      count: allTerms.filter(t => t.filePath.startsWith('/frontend/')).length
    },
    {
      name: 'UX/UI',
      slug: 'ux-ui',
      icon: '🎨',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      count: allTerms.filter(t => t.filePath.startsWith('/ux-ui/')).length
    },
    {
      name: 'Backend',
      slug: 'backend',
      icon: '⚙️',
      color: 'bg-green-50 border-green-200 text-green-800',
      count: allTerms.filter(t => t.filePath.startsWith('/backend/')).length
    },
    {
      name: 'Herramientas',
      slug: 'herramientas',
      icon: '🔧',
      color: 'bg-gray-50 border-gray-200 text-gray-800',
      count: allTerms.filter(t => t.filePath.startsWith('/tools/')).length
    },
    {
      name: 'Conceptos',
      slug: 'conceptos',
      icon: '💡',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      count: allTerms.filter(t => t.filePath.startsWith('/concepts/')).length
    },
    {
      name: 'General',
      slug: 'general',
      icon: '📚',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      count: allTerms.filter(t => t.filePath.startsWith('/general/')).length
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Aprende Desarrollo y UX/UI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Diccionario interactivo de conceptos, tecnologías y terminología 
          del desarrollo web y diseño de experiencias.
        </p>
        <div className="mt-8">
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
      </div>

      {/* Categorías */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${category.color}`}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-sm opacity-75 mb-3">
                {category.count} término{category.count !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Términos Recientes */}
      {recentTerms.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Términos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTerms.map((term) => (
              <Link
                key={term.slug}
                href={getTermUrl(term.filePath)}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">{term.metadata.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    term.metadata.difficulty === 'Principiante' ? 'bg-green-100 text-green-800' :
                    term.metadata.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {term.metadata.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {term.metadata.descripcion_corta || term.metadata.description || 'Sin descripción disponible'}
                </p>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span className="capitalize">{term.metadata.category}</span>
                  <span>⏱️ {term.metadata.tiempo_lectura || 5} min</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Estadísticas */}
      <section className="bg-white p-8 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{allTerms.length}</div>
            <div className="text-gray-600">Términos Disponibles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-gray-600">Categorías</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-gray-600">Términos Leídos</div>
          </div>
        </div>
      </section>
    </div>
  )
}
