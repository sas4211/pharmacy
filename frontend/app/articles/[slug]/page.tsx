import { notFound } from 'next/navigation'
import { getArticle, getAllArticles } from '@/lib/articles'
import ArticleClient from './ArticleClient'

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  const related = getAllArticles().filter(a => a.slug !== params.slug).slice(0, 4)

  return <ArticleClient article={article} related={related} />
}
