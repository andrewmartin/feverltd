import React from 'react'
import { INewsItem } from 'src/types'

import styles from './NewsItem.module.css'

export const NewsItem: React.FC<INewsItem> = (props) => {
  const { title, body } = props

  return (
    <div className={styles.newsItem}>
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: body }}></div>
    </div>
  )
}
