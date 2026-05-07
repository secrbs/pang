import { useEffect, useState } from 'react'
import MainScene from './scenes/MainScene'
import HowToPlayScene from './scenes/HowToPlayScene'
import GameScene from './scenes/GameScene'
import GameOverScene from './scenes/GameOverScene'
import StageClearScene from './scenes/StageClearScene'
import MissionClearScene from './scenes/MissionClearScene'
import PauseOverlay from './scenes/PauseOverlay'
import { MISSION1_STAGES } from './game/stageData'

type Scene = 'main' | 'howtoplay' | 'game' | 'pause' | 'stageclear' | 'missionclear' | 'gameover'

const INITIAL_LIVES = 5

export default function App() {
  const [scene, setScene] = useState<Scene>('main')
  const [lives, setLives] = useState(INITIAL_LIVES)
  const [stageIndex, setStageIndex] = useState(0)
  const [stageKey, setStageKey] = useState(0)
  const [cheatMode, setCheatMode] = useState(false)

  useEffect(() => {
    if (scene !== 'game' && scene !== 'pause') return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setScene(s => s === 'game' ? 'pause' : s)
      if (e.key === 'q' || e.key === 'Q') setCheatMode(c => !c)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [scene])

  function handleStart() {
    setLives(INITIAL_LIVES)
    setStageIndex(0)
    setStageKey(0)
    setCheatMode(false)
    setScene('game')
  }

  function handlePlayerDead() {
    if (lives <= 1) {
      setScene('gameover')
    } else {
      setLives(l => l - 1)
    }
  }

  function handleStageClear() {
    if (stageIndex < MISSION1_STAGES.length - 1) {
      setScene('stageclear')
    } else {
      setScene('missionclear')
    }
  }

  function handleNextStage() {
    setStageIndex(s => s + 1)
    setStageKey(k => k + 1)
    setScene('game')
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
          key={stageKey}
          stageData={MISSION1_STAGES[stageIndex]}
          lives={lives}
          cheat={cheatMode}
          paused={scene === 'pause'}
          onPlayerDead={handlePlayerDead}
          onStageClear={handleStageClear}
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
    return <StageClearScene onNext={handleNextStage} />
  }

  if (scene === 'missionclear') {
    return <MissionClearScene onBack={() => { setLives(INITIAL_LIVES); setScene('main') }} />
  }

  if (scene === 'gameover') {
    return <GameOverScene onBack={() => { setLives(INITIAL_LIVES); setScene('main') }} />
  }

  return null
}
