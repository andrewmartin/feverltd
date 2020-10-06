import React from 'react'

import type { AppContext, AppProps } from 'next/app'
import { AppProvider } from 'src/context/App'
import { ContentfulCollection } from 'contentful'
import { IMenuItem, IMenuItemResult } from 'src/types'
import { getData } from 'src/util/fetch'
import { buildMenuItems } from 'src/util/props'

import '../styles/globals.css'

interface IPageProps {
  menuItems: IMenuItem[]
}

function MyApp(props: AppProps<IPageProps>) {
  const { Component, pageProps } = props

  return (
    <AppProvider menuItems={pageProps.menuItems}>
      <Component {...pageProps} />
    </AppProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const menu = await getData<ContentfulCollection<IMenuItemResult>>('menu/main')
  //   const appProps = await App.getInitialProps(appContext)

  let pageProps

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  return {
    pageProps: {
      ...pageProps,
      menuItems: buildMenuItems(menu?.items),
    },
  }
}

export default MyApp
