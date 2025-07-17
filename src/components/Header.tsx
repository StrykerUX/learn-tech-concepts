'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchBar from './SearchBar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Tech Wiki</span>
          </Link>

          {/* Búsqueda - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/categorias" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Categorías
            </Link>
            <Link 
              href="/progreso" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Mi Progreso
            </Link>
          </nav>

          {/* Menú móvil */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Búsqueda móvil */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>

        {/* Menú móvil expandido */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link 
                href="/categorias" 
                className="block px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Categorías
              </Link>
              <Link 
                href="/progreso" 
                className="block px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Mi Progreso
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}