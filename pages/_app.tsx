import React from 'react'
import App from 'next/app'

import '../styles/globals.css'
import { AppProvider } from 'src/context/App'
import { buildMenuItems } from 'src/util/props'
import { IMenuItem, IMenuItemResult } from 'src/types'
import { getData } from 'src/util/fetch'
import { ContentfulCollection } from 'contentful'

interface IPageProps {
  menuItems: IMenuItem[]
}

class Application extends App<IPageProps> {
  render() {
    const {
      Component,
      pageProps,
      pageProps: { menuItems },
    } = this.props

    return (
      <AppProvider menuItems={menuItems}>
        <Component {...pageProps} />
      </AppProvider>
    )
  }
}

Application.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)

  const menu = await getData<ContentfulCollection<IMenuItemResult>>('menu/main')
  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      menuItems: buildMenuItems(menu.items),
    },
  }
}

export default Application
