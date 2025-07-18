'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const categories = [
  {
    name: 'Frontend',
    slug: 'frontend',
    icon: '💻',
    description: 'Tecnologías del lado del cliente'
  },
  {
    name: 'UX/UI',
    slug: 'ux-ui',
    icon: '🎨',
    description: 'Diseño de experiencia y interfaz'
  },
  {
    name: 'Backend',
    slug: 'backend',
    icon: '⚙️',
    description: 'Tecnologías del lado del servidor'
  },
  {
    name: 'General',
    slug: 'general',
    icon: '📚',
    description: 'Conceptos generales de tecnología'
  },
  {
    name: 'Herramientas',
    slug: 'tools',
    icon: '🔧',
    description: 'Herramientas de desarrollo'
  },
  {
    name: 'Conceptos',
    slug: 'concepts',
    icon: '💡',
    description: 'Conceptos fundamentales'
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden lg:block">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h2>
        
        <nav className="space-y-2">
          {categories.map((category) => {
            const isActive = mounted && pathname?.includes(`/categorias/${category.slug}`)
            
            return (
              <Link
                key={category.slug}
                href={`/categorias/${category.slug}`}
                className={`block p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{category.icon}</span>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.description}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">🎯 Tu Progreso</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Términos leídos: <span className="font-medium">0/30</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}