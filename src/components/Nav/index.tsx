import React from 'react'
import Link from 'next/link'
import { useAppState } from 'src/context/App'

import styles from './Nav.module.css'

interface INav {
  className?: string
}

export const Nav: React.FC<INav> = (props) => {
  const { className } = props
  const { menuItems } = useAppState()

  return (
    <ul className={className || styles.navList}>
      {menuItems?.map((page) => {
        if (`url` in page) {
          return (
            <li key={page.name}>
              <a href={page.url}>{page.name}</a>
            </li>
          )
        }

        return (
          <li key={page.name}>
            <Link href={`/${page.page.fields.slug}`}>{page.name}</Link>
          </li>
        )
      })}
    </ul>
  )
}
