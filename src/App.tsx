import { useState, useEffect } from 'react'
import './App.css'

const SNAKES: Record<number, number> = {
  16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
}

const LADDERS: Record<number, number> = {
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
}

const PLAYER_COLORS = ['#667eea', '#ff6b6b', '#4ecdc4', '#f9ca24', '#6c5ce7', '#00b894']

interface Player {
  id: number
  position: number
  won: boolean
  animatingTo?: number
  jumpType?: 'snake' | 'ladder' | null
}

function Board({ players }: { players: Player[] }) {
  const squares: JSX.Element[] = []
  
  for (let row = 9; row >= 0; row--) {
    const rowSquares: JSX.Element[] = []
    const isEvenRow = row % 2 === 0
    const startCol = isEvenRow ? 0 : 9
    const endCol = isEvenRow ? 10 : -1
    const step = isEvenRow ? 1 : -1
    
    for (let col = startCol; col !== endCol; col += step) {
      const num = row * 10 + col + 1
      const hasSnake = SNAKES[num]
      const hasLadder = LADDERS[num]
      const playersOnSquare = players.filter(p => p.position === num || (p.animatingTo && p.animatingTo === num))
      
      rowSquares.push(
        <div 
          key={num} 
          className={`square ${playersOnSquare.length > 0 ? 'has-player' : ''} ${hasSnake ? 'snake' : ''} ${hasLadder ? 'ladder' : ''}`}
        >
          <span className="square-number">{num}</span>
          {hasSnake && (
            <div className="snake-indicator">
              <span className="snake-icon">🐍</span>
              <span className="destination">→ {SNAKES[num]}</span>
            </div>
          )}
          {hasLadder && (
            <div className="ladder-indicator">
              <span className="ladder-icon">🪜</span>
              <span className="destination">→ {LADDERS[num]}</span>
            </div>
          )}
          {playersOnSquare.length > 0 && (
            <div className="players-container">
              {playersOnSquare.map(p => (
                <div 
                  key={p.id} 
                  className={`player-piece ${p.animatingTo && p.animatingTo === num ? 'animating' : ''} ${p.jumpType ? `${p.jumpType}-jump` : ''}`}
                  style={{ 
                    backgroundColor: PLAYER_COLORS[p.id % PLAYER_COLORS.length],
                    transform: `scale(${0.7 + (1 / (playersOnSquare.length + 1))})`
                  }}
                >
                  <span className="player-number">{p.id + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    squares.push(<div key={row} className="board-row">{rowSquares}</div>)
  }
  
  return <div className="board">{squares}</div>
}

function Dice({ value, onRoll, rolling }: { value: number; onRoll: () => void; rolling: boolean }) {
  return (
    <div className="dice-container">
      <div className={`dice ${rolling ? 'rolling' : ''}`}>
        <div className="dice-face">{value}</div>
      </div>
      <button onClick={onRoll} disabled={rolling}>
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  )
}

function App() {
  const [numPlayers, setNumPlayers] = useState(2)
  const [players, setPlayers] = useState<Player[]>(() => {
    const initialPlayers: Player[] = []
    for (let i = 0; i < 2; i++) {
      initialPlayers.push({ id: i, position: 1, won: false })
    }
    return initialPlayers
  })
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [diceValue, setDiceValue] = useState(1)
  const [rolledValue, setRolledValue] = useState<number | null>(null)
  const [rolling, setRolling] = useState(false)
  const [moving, setMoving] = useState(false)
  const [message, setMessage] = useState('Roll the dice to start!')
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (gameStarted && !rolling && !moving && rolledValue === null) {
      setMessage(`Player ${players[currentPlayerIndex]?.id + 1}'s turn!`)
    }
  }, [currentPlayerIndex, gameStarted, rolling, moving, rolledValue, players])

  const startGame = (num: number) => {
    setNumPlayers(num)
    const initialPlayers: Player[] = []
    for (let i = 0; i < num; i++) {
      initialPlayers.push({ id: i, position: 1, won: false })
    }
    setPlayers(initialPlayers)
    setCurrentPlayerIndex(0)
    setDiceValue(1)
    setMessage(`Player 1's turn! Roll the dice!`)
    setRolledValue(null)
    setGameStarted(true)
  }

  const animateMovement = (playerIndex: number, start: number, end: number, onComplete: () => void) => {
    let currentStep = start
    const stepDelay = 300
    setMoving(true)
    
    const moveStep = () => {
      if (start < end) {
        currentStep++
      } else if (start > end) {
        currentStep--
      } else {
        onComplete()
        return
      }
      
      setPlayers(prevPlayers => {
        const updatedPlayers = [...prevPlayers]
        updatedPlayers[playerIndex] = { 
          ...updatedPlayers[playerIndex], 
          position: currentStep,
          animatingTo: currentStep 
        }
        return updatedPlayers
      })
      
      const stepsLeft = Math.abs(end - currentStep)
      if (stepsLeft > 0) {
        setTimeout(moveStep, stepDelay)
      } else {
        setTimeout(() => {
          setPlayers(prevPlayers => {
            const finalPlayers = [...prevPlayers]
            finalPlayers[playerIndex] = { ...finalPlayers[playerIndex], animatingTo: undefined }
            return finalPlayers
          })
          setMoving(false)
          onComplete()
        }, stepDelay)
      }
    }
    
    moveStep()
  }

  const rollDice = () => {
    const currentPlayer = players[currentPlayerIndex]
    if (currentPlayer.won || moving || rolling) {
      if (currentPlayer.won) {
        setMessage(`Player ${currentPlayer.id + 1} already won! Next player's turn.`)
      }
      return
    }

    setRolling(true)
    setMessage(`Player ${currentPlayer.id + 1} rolling...`)
    
    const rolls = []
    for (let i = 0; i < 10; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1)
    }
    
    let rollIndex = 0
    const rollInterval = setInterval(() => {
      if (rollIndex < rolls.length) {
        setDiceValue(rolls[rollIndex])
        rollIndex++
      } else {
        clearInterval(rollInterval)
        setRolling(false)
        const finalValue = rolls[rolls.length - 1]
        setDiceValue(finalValue)
        setRolledValue(finalValue)
        
        let newPosition = currentPlayer.position + finalValue
        if (newPosition > 100) {
          setMessage(`Player ${currentPlayer.id + 1} rolled ${finalValue}. Need exactly ${100 - currentPlayer.position} to win!`)
          setTimeout(() => {
            setRolledValue(null)
            setCurrentPlayerIndex((prev) => (prev + 1) % numPlayers)
          }, 1000)
        } else {
          setMessage(`Player ${currentPlayer.id + 1} rolled ${finalValue}. Moving...`)
          
          animateMovement(currentPlayerIndex, currentPlayer.position, newPosition, () => {
            setPlayers(prevPlayers => {
              const updatedPlayers = [...prevPlayers]
              const playerAfterMove = updatedPlayers[currentPlayerIndex]
              
              if (SNAKES[newPosition]) {
                setMessage(`Oh no! Snake! Going down to ${SNAKES[newPosition]}`)
                
                const finalPlayers = [...updatedPlayers]
                finalPlayers[currentPlayerIndex] = { 
                  ...playerAfterMove, 
                  position: SNAKES[newPosition],
                  animatingTo: SNAKES[newPosition],
                  jumpType: 'snake'
                }
                setPlayers(finalPlayers)
                
                setTimeout(() => {
                  setPlayers(prevSnakePlayers => {
                    const snakePlayers = [...prevSnakePlayers]
                    snakePlayers[currentPlayerIndex] = { 
                      ...snakePlayers[currentPlayerIndex],
                      animatingTo: undefined,
                      jumpType: null
                    }
                    return snakePlayers
                  })
                  
                  checkWinAndNextTurn(SNAKES[newPosition], finalValue)
                }, 500)
              } else if (LADDERS[newPosition]) {
                setMessage(`Yay! Ladder! Going up to ${LADDERS[newPosition]}`)
                
                const finalPlayers = [...updatedPlayers]
                finalPlayers[currentPlayerIndex] = { 
                  ...playerAfterMove, 
                  position: LADDERS[newPosition],
                  animatingTo: LADDERS[newPosition],
                  jumpType: 'ladder'
                }
                setPlayers(finalPlayers)
                
                setTimeout(() => {
                  setPlayers(prevLadderPlayers => {
                    const ladderPlayers = [...prevLadderPlayers]
                    ladderPlayers[currentPlayerIndex] = { 
                      ...ladderPlayers[currentPlayerIndex],
                      animatingTo: undefined,
                      jumpType: null
                    }
                    return ladderPlayers
                  })
                  
                  checkWinAndNextTurn(LADDERS[newPosition], finalValue)
                }, 500)
              } else {
                setMessage(`Player ${currentPlayer.id + 1} moved to ${newPosition}`)
                checkWinAndNextTurn(newPosition, finalValue)
              }
              
              return updatedPlayers
            })
          })
        }
      }
    }, 100)
  }

  const checkWinAndNextTurn = (finalPos: number, diceRoll: number) => {
    const checkWin = (pos: number) => {
      return pos === 100
    }
    
    if (checkWin(finalPos)) {
      setPlayers(prevPlayers => {
        const winPlayers = [...prevPlayers]
        const winPlayerIndex = winPlayers.findIndex(p => p.id === currentPlayerIndex)
        winPlayers[winPlayerIndex] = { ...winPlayers[winPlayerIndex], won: true }
        return winPlayers
      })
      setRolledValue(null)
      setMessage(`🎉 Congratulations Player ${currentPlayerIndex + 1}! You won! 🎉`)
    } else {
      setTimeout(() => {
        setRolledValue(null)
        if (diceRoll === 6) {
          setMessage(`Player ${currentPlayerIndex + 1} rolled 6! Roll again!`)
        } else {
          const nextPlayer = (currentPlayerIndex + 1) % numPlayers
          setCurrentPlayerIndex(nextPlayer)
          setMessage(`Player ${nextPlayer + 1}'s turn!`)
        }
      }, 500)
    }
  }

  const resetGame = () => {
    const initialPlayers: Player[] = []
    for (let i = 0; i < numPlayers; i++) {
      initialPlayers.push({ id: i, position: 1, won: false })
    }
    setPlayers(initialPlayers)
    setCurrentPlayerIndex(0)
    setDiceValue(1)
    setMessage(`Player 1's turn! Roll the dice!`)
  }

  const currentPlayer = players[currentPlayerIndex]

  if (!gameStarted) {
    return (
      <div className="game-container">
        <h1>Snake and Ladder</h1>
        <div className="setup-container">
          <h2>Select Number of Players</h2>
          <div className="player-buttons">
            {[2, 3, 4, 5, 6].map(num => (
              <button 
                key={num} 
                className="player-select-btn"
                onClick={() => startGame(num)}
              >
                {num} Players
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <h1>Snake and Ladder</h1>
      <div className="game-content">
        <Board players={players} />
        <div className="sidebar">
          <div className="message">{message}</div>
          <Dice value={diceValue} onRoll={rollDice} rolling={rolling || moving} />
          
          <div className="current-player">
            <div 
              className="player-indicator"
              style={{ backgroundColor: PLAYER_COLORS[currentPlayer.id % PLAYER_COLORS.length] }}
            />
            <span>Current Turn: Player {currentPlayer.id + 1}</span>
          </div>
          
          <div className="players-list">
            <h3>Players</h3>
            {players.map(player => (
              <div 
                key={player.id} 
                className={`player-item ${player.id === currentPlayer.id ? 'active' : ''} ${player.won ? 'won' : ''}`}
                style={{ 
                  borderLeftColor: PLAYER_COLORS[player.id % PLAYER_COLORS.length]
                }}
              >
                <span className="player-name">Player {player.id + 1}</span>
                <span className="player-pos">Pos: {player.position}</span>
                {player.won && <span className="winner-badge">🏆</span>}
              </div>
            ))}
          </div>
          
          <button className="reset-btn" onClick={resetGame}>
            Reset Game
          </button>
          
          <button className="change-players-btn" onClick={() => setGameStarted(false)}>
            Change Players
          </button>
          
          <div className="legend">
            <h3>Legend:</h3>
            <div className="legend-item">
              <span className="legend-icon">🐍</span> Snake (go down)
            </div>
            <div className="legend-item">
              <span className="legend-icon">🪜</span> Ladder (go up)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
