import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getTermBySlug, getAllTerms, getTermUrl } from '@/lib/content'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const allTerms = getAllTerms()
  
  return allTerms.map((term) => ({
    category: term.metadata.category,
    slug: term.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params
  const term = getTermBySlug(category, slug)
  
  if (!term) {
    return {
      title: 'Término no encontrado'
    }
  }

  return {
    title: `${term.metadata.title} - Tech Wiki`,
    description: term.metadata.description || `Aprende sobre ${term.metadata.title}`,
  }
}

const components = {
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className="text-blue-600 hover:text-blue-800 underline" {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline" 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props}
      >
        {children}
      </a>
    )
  },
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
}

export default async function TermPage({ params }: PageProps) {
  const { category, slug } = await params
  const term = getTermBySlug(category, slug)

  if (!term) {
    notFound()
  }

  const allTerms = getAllTerms()
  const relatedTerms = allTerms.filter(t => 
    t.slug !== term.slug && (
      (term.metadata.relacionados && term.metadata.relacionados.includes(t.slug)) ||
      (term.metadata.tags && t.metadata.tags && t.metadata.tags.some(tag => term.metadata.tags!.includes(tag)))
    )
  ).slice(0, 4)

  const categoryColors: Record<string, string> = {
    'Frontend': 'bg-blue-50 text-blue-800 border-blue-200',
    'UX/UI': 'bg-purple-50 text-purple-800 border-purple-200',
    'Backend': 'bg-green-50 text-green-800 border-green-200',
    'General': 'bg-orange-50 text-orange-800 border-orange-200',
    'Tools': 'bg-gray-50 text-gray-800 border-gray-200',
    'Concepts': 'bg-indigo-50 text-indigo-800 border-indigo-200'
  }

  const difficultyColors: Record<string, string> = {
    'Principiante': 'bg-green-100 text-green-800',
    'Intermedio': 'bg-yellow-100 text-yellow-800',
    'Avanzado': 'bg-red-100 text-red-800'
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>→</span>
        <Link href={`/categorias/${term.metadata.category}`} className="hover:text-gray-700 capitalize">
          {term.metadata.category}
        </Link>
        <span>→</span>
        <span className="text-gray-900">{term.metadata.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900">{term.metadata.title}</h1>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[term.metadata.category]}`}>
              {term.metadata.category.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[term.metadata.difficulty]}`}>
              {term.metadata.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span>⏱️ {term.metadata.tiempo_lectura || 5} min de lectura</span>
          {term.metadata.tags && <span>🏷️ {term.metadata.tags.join(', ')}</span>}
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-lg max-w-none mb-12">
        <MDXRemote
          source={term.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </article>

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Términos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTerms.map((relatedTerm) => (
              <Link
                key={relatedTerm.slug}
                href={getTermUrl(relatedTerm.filePath)}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{relatedTerm.metadata.title}</h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="capitalize">{relatedTerm.metadata.category}</span>
                  <span>⏱️ {relatedTerm.metadata.tiempo_lectura || 5} min</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}