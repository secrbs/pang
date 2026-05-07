import { useEffect } from 'react'
import styles from './MissionClearScene.module.css'

interface Props {
  onBack: () => void
}

export default function MissionClearScene({ onBack }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') onBack()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onBack])

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>M I S S I O N  C L E A R</h1>
      <p className={styles.hint}>[ ENTER ] 메인으로 돌아가기</p>
    </div>
  )
}
