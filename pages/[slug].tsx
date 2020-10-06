import React from 'react'
import { IPageItem } from 'src/types'
import { NextPage } from 'next'
import { ContentfulCollection } from 'contentful'
import { getData } from 'src/util/fetch'
import { Layout } from 'src/components/Layout'
import styles from '../styles/Page.module.css'

interface IPage {
  data: ContentfulCollection<IPageItem>
}

const Page: NextPage<IPage> = (props) => {
  const { data } = props
  const page = data?.items[0]

  return (
    <div className={styles.container}>
      <Layout className={styles.page}>
        <article className={styles.pageContent}>
          <h1 className={styles.pageTitle}>{page.title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: page.body,
            }}
          />
        </article>
      </Layout>
    </div>
  )
}

Page.getInitialProps = async (context) => {
  const {
    query: { slug },
  } = context

  const data = await getData<ContentfulCollection<IPageItem>>(`page/${slug as string}`)

  return {
    data,
  }
}

export default Page
