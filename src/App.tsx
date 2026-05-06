import { useEffect, useState } from 'react'
import MainScene from './scenes/MainScene'
import HowToPlayScene from './scenes/HowToPlayScene'
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000', color: '#fff', fontFamily: 'monospace', fontSize: 24 }}>
          GAME (Phase 2에서 구현)
        </div>
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
