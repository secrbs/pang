import { useEffect } from 'react'
import shared from './scene.module.css'
import styles from './StageClearScene.module.css'

interface Props {
  onNext: () => void
}

export default function StageClearScene({ onNext }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onNext])

  return (
    <div className={shared.screen}>
      <h1 className={styles.title}>S T A G E  C L E A R</h1>
      <p className={shared.hint}>[ ENTER ] 계속하기</p>
    </div>
  )
}
