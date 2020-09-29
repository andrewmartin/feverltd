import React from 'react'

const PAGES = ['about', 'news', 'releases', 'shop', 'culture']

export const Nav = () => {
  return (
    <ul>
      {PAGES.map((page) => {
        return (
          <li key={page}>
            <a href="#">{page}</a>
          </li>
        )
      })}
    </ul>
  )
}
