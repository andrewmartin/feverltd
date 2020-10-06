import Head from 'next/head'
import React from 'react'
import { meta } from 'src/util/meta'
import { Footer } from '../Footer'
import { Header } from '../Header'

export const Layout: React.FC<{
  className?: string
}> = (props) => {
  const { children, className = '' } = props

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`content ${className}`}>
        <Header />
        {children}
      </div>
      <Footer />
    </>
  )
}
