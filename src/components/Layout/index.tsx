import React from 'react'
import { Footer } from '../Footer'
import { Header } from '../Header'

export const Layout: React.FC = (props) => {
  const { children } = props

  return (
    <>
      <div className="content">
        <Header />
        {children}
      </div>
      <Footer />
    </>
  )
}
