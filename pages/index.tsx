import React from 'react'
import Head from 'next/head'
import { INewsItem } from 'src/types'
import { NextPage } from 'next'
import { ContentfulCollection } from 'contentful'
import { getData } from 'src/util/fetch'
import { NewsItem } from 'src/components/NewsItem'
import { Layout } from 'src/components/Layout'
import styles from '../styles/Home.module.css'

interface IHome {
  news: ContentfulCollection<INewsItem>
}

const Page: NextPage<IHome> = (props) => {
  const { news } = props

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {news?.items.map((i) => {
          return <NewsItem key={i.body} {...i} />
        })}
      </Layout>
    </div>
  )
}

Page.getInitialProps = async () => {
  const news = await getData<ContentfulCollection<INewsItem>>('news')

  return {
    news,
  }
}

export default Page
