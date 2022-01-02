import { Post } from '@/types'
import { gql } from '@apollo/client'
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import keystoneClient from '../../lib/keystoneClient'

export interface Props {
  id: string
  title: string
  content: { document: DocumentRendererProps['document'] }
}

const Post: NextPage<Props> = ({ id, title, content: { document } }) => {
  return (
    <section>
      <h1>{title}</h1>
      <h2>{id}</h2>
      <DocumentRenderer document={document} />
    </section>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: { posts },
  } = await keystoneClient.query<{ posts: Post[] }>({
    query: gql`
      {
        posts {
          slug
        }
      }
    `,
  })

  console.log(posts)

  return {
    paths: posts.map(post => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params!.slug as string

  const {
    data: {
      posts: [post],
    },
  } = await keystoneClient.query<{
    posts: Post[]
  }>({
    query: gql`{
        posts(where: { slug: { equals: "${slug}" } }) {
          id
          title
          content {
            document
          }
        }
      }
    `,
  })

  return {
    props: post,
  }
}

export default Post
