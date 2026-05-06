import { useEffect } from 'react'
import styles from './HowToPlayScene.module.css'

interface Props {
  onBack: () => void
}

export default function HowToPlayScene({ onBack }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') onBack()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onBack])

  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>HOW TO PLAY</h2>
      <ul className={styles.list}>
        <li>
          <span className={styles.key}>← →</span>
          캐릭터를 좌우로 이동합니다
        </li>
        <li>
          <span className={styles.key}>SPACE</span>
          위쪽으로 와이어를 발사합니다
        </li>
        <li>
          <span className={styles.key}>목표</span>
          모든 버블을 와이어로 터뜨려 제거하세요
        </li>
        <li>
          <span className={styles.key}>주의</span>
          버블에 닿으면 게임 오버입니다
        </li>
      </ul>
      <p className={styles.hint}>[ ENTER ] 메인으로 돌아가기</p>
    </div>
  )
}
