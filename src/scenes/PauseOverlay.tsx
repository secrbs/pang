import { useEffect, useState } from 'react'
import styles from './PauseOverlay.module.css'

interface Props {
  onResume: () => void
  onQuit: () => void
}

export default function PauseOverlay({ onResume, onQuit }: Props) {
  const [cursor, setCursor] = useState<0 | 1>(0) // 0: YES, 1: NO

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setCursor(prev => (prev === 0 ? 1 : 0))
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (cursor === 0) onQuit()
        else onResume()
      } else if (e.key === 'Escape') {
        onResume()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [cursor, onResume, onQuit])

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <p className={styles.message}>메인 화면으로 돌아가시겠습니까?</p>
        <div className={styles.buttons}>
          <span className={`${styles.btn} ${cursor === 0 ? styles.selected : ''}`}>
            YES
          </span>
          <span className={`${styles.btn} ${cursor === 1 ? styles.selected : ''}`}>
            NO
          </span>
        </div>
      </div>
    </div>
  )
}
