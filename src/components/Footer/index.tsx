import React from 'react'
import { Nav } from '../Nav'

import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer>
      <Nav className={styles.footerNav} />
    </footer>
  )
}
