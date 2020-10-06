import Link from 'next/link'
import React from 'react'
import { Logo } from '../Logo'
import { Nav } from '../Nav'

export const Header = () => {
  return (
    <header>
      <Link href={'/'}>
        <a>
          <Logo />
        </a>
      </Link>
      <Nav />
    </header>
  )
}
