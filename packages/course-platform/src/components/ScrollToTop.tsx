import { useLanguage } from '../hooks/useLanguage'
import { useScrollToTop } from '../hooks/useScrollToTop'

import styles from './ScrollToTop.module.css'

export function ScrollToTop() {
  const { t } = useLanguage()
  const scrollToTop = useScrollToTop()

  return (
    <button onClick={scrollToTop} className={styles.button}>
      <span>↑</span>
      <span>{t('scroll.top')}</span>
    </button>
  )
}
