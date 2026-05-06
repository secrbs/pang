import { useEffect, useState } from 'react'
import MainScene from './scenes/MainScene'
import HowToPlayScene from './scenes/HowToPlayScene'
import GameScene from './scenes/GameScene'
import PauseOverlay from './scenes/PauseOverlay'

type Scene = 'main' | 'howtoplay' | 'game' | 'pause' | 'gameover'

export default function App() {
  const [scene, setScene] = useState<Scene>('main')

  useEffect(() => {
    if (scene !== 'game') return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setScene('pause')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [scene])

  if (scene === 'main') {
    return (
      <MainScene
        onStart={() => setScene('game')}
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
        <GameScene paused={scene === 'pause'} />
        {scene === 'pause' && (
          <PauseOverlay
            onResume={() => setScene('game')}
            onQuit={() => setScene('main')}
          />
        )}
      </>
    )
  }

  return null
}
