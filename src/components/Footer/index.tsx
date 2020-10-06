import React from 'react'
import { Nav } from '../Nav'

import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Nav className={styles.footerNav} />
    </footer>
  )
}
