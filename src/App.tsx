import { useEffect, useState } from 'react'
import MainScene from './scenes/MainScene'
import HowToPlayScene from './scenes/HowToPlayScene'
import GameScene from './scenes/GameScene'
import GameOverScene from './scenes/GameOverScene'
import StageClearScene from './scenes/StageClearScene'
import PauseOverlay from './scenes/PauseOverlay'

type Scene = 'main' | 'howtoplay' | 'game' | 'pause' | 'stageclear' | 'gameover'

const INITIAL_LIVES = 5

export default function App() {
  const [scene, setScene] = useState<Scene>('main')
  const [lives, setLives] = useState(INITIAL_LIVES)

  useEffect(() => {
    if (scene !== 'game') return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setScene('pause')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [scene])

  function handleStart() {
    setLives(INITIAL_LIVES)
    setScene('game')
  }

  function handlePlayerDead() {
    if (lives <= 1) {
      setScene('gameover')
    } else {
      setLives(l => l - 1)
    }
  }

  if (scene === 'main') {
    return (
      <MainScene
        onStart={handleStart}
        onHowToPlay={() => setScene('howtoplay')}
      />
    )
  }

  if (scene === 'howtoplay') {
    return <HowToPlayScene onBack={() => setScene('main')} />
  }

  if (scene === 'game' || scene === 'pause') {
    return (
      <>
        <GameScene
          lives={lives}
          paused={scene === 'pause'}
          onPlayerDead={handlePlayerDead}
          onStageClear={() => setScene('stageclear')}
        />
        {scene === 'pause' && (
          <PauseOverlay
            onResume={() => setScene('game')}
            onQuit={() => setScene('main')}
          />
        )}
      </>
    )
  }

  if (scene === 'stageclear') {
    return <StageClearScene onNext={() => setScene('main')} />
  }

  if (scene === 'gameover') {
    return <GameOverScene onBack={() => { setLives(INITIAL_LIVES); setScene('main') }} />
  }

  return null
}
