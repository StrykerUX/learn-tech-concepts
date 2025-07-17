import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Term, TermMetadata } from '@/types'

const contentDirectory = path.join(process.cwd(), 'content')

export function getAllTerms(): Term[] {
  const terms: Term[] = []

  // Leer todas las categorías disponibles dinámicamente
  if (!fs.existsSync(contentDirectory)) return terms

  const categories = fs.readdirSync(contentDirectory).filter(item => {
    const categoryPath = path.join(contentDirectory, item)
    return fs.statSync(categoryPath).isDirectory()
  })

  categories.forEach(category => {
    const categoryPath = path.join(contentDirectory, category)
    
    if (!fs.existsSync(categoryPath)) return

    const files = fs.readdirSync(categoryPath)
    
    files.forEach(fileName => {
      if (!fileName.endsWith('.mdx')) return

      const filePath = path.join(categoryPath, fileName)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      
      const slug = fileName.replace('.mdx', '')
      
      terms.push({
        slug,
        metadata: {
          ...data,
          category: data.category || category
        } as TermMetadata,
        content,
        filePath: `/${category}/${slug}`
      })
    })
  })

  return terms.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))
}

export function getTermBySlug(category: string, slug: string): Term | null {
  try {
    const filePath = path.join(contentDirectory, category, `${slug}.mdx`)
    
    if (!fs.existsSync(filePath)) return null

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      metadata: {
        ...data,
        category: data.category || category
      } as TermMetadata,
      content,
      filePath: `/${category}/${slug}`
    }
  } catch (error) {
    console.error('Error reading term:', error)
    return null
  }
}

export function getTermsByCategory(category: string): Term[] {
  const categoryPath = path.join(contentDirectory, category)
  
  if (!fs.existsSync(categoryPath)) return []

  const files = fs.readdirSync(categoryPath)
  const terms: Term[] = []

  files.forEach(fileName => {
    if (!fileName.endsWith('.mdx')) return

    const filePath = path.join(categoryPath, fileName)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    const slug = fileName.replace('.mdx', '')
    
    terms.push({
      slug,
      metadata: {
        ...data,
        category: data.category || category
      } as TermMetadata,
      content,
      filePath: `/${category}/${slug}`
    })
  })

  return terms.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))
}

export function processInternalLinks(content: string): string {
  // Convierte [término](/categoria/slug) en enlaces internos
  return content.replace(
    /\[([^\]]+)\]\(\/([^)]+)\)/g, 
    '<a href="/terminos/$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
  )
}

export function getTermUrl(filePath: string): string {
  // Asegura que la URL del término tenga el formato correcto
  const cleanPath = filePath.startsWith('/') ? filePath : '/' + filePath
  return `/terminos${cleanPath}`
}