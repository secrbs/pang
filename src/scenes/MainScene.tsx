import { useEffect, useState } from 'react'
import styles from './MainScene.module.css'

const MENU_ITEMS = ['GAME START', 'HOW TO PLAY'] as const

interface Props {
  onStart: () => void
  onHowToPlay: () => void
}

export default function MainScene({ onStart, onHowToPlay }: Props) {
  const [cursor, setCursor] = useState<0 | 1>(0)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') {
        setCursor(prev => (prev === 0 ? 1 : 0))
      } else if (e.key === 'ArrowDown') {
        setCursor(prev => (prev === 1 ? 0 : 1))
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (cursor === 0) onStart()
        if (cursor === 1) onHowToPlay()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [cursor, onStart, onHowToPlay])

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>P A N G</h1>
      <ul className={styles.menu}>
        {MENU_ITEMS.map((item, i) => (
          <li
            key={item}
            className={`${styles.item} ${cursor === i ? styles.selected : ''}`}
          >
            <span className={styles.cursor}>{cursor === i ? '▶' : '  '}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
