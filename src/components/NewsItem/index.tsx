import Link from 'next/link'
import React from 'react'
import { INewsItem } from 'src/types'

import styles from './NewsItem.module.css'

export const NewsItem: React.FC<INewsItem> = (props) => {
  const { title, body, id } = props

  return (
    <div className={styles.newsItem}>
      <h2>
        <Link passHref href={`/news/${id}`}>
          <a>{title}</a>
        </Link>
      </h2>
      <div dangerouslySetInnerHTML={{ __html: body }}></div>
    </div>
  )
}
