import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Nav } from 'src/components/Nav'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Fever LTD</h1>
      <Nav />

    </div>
  )
}
