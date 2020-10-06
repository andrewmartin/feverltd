import React from 'react'
import Head from 'next/head'
import { INewsItem } from 'src/types'
import { NextPage } from 'next'
import { getData } from 'src/util/fetch'
import { NewsItem } from 'src/components/NewsItem'
import { Layout } from 'src/components/Layout'
import styles from '../../styles/Home.module.css'

interface IHome {
  news: INewsItem
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
        <NewsItem key={news.body} {...news} />
      </Layout>
    </div>
  )
}

Page.getInitialProps = async (context) => {
  const {
    query: { id },
  } = context

  const news = await getData<{
    item: INewsItem
  }>(`news/byId/${id as string}`)

  return {
    news: news.item,
  }
}

export default Page
