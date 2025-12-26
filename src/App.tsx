import { useState } from 'react'
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
      const playersOnSquare = players.filter(p => p.position === num)
      
      rowSquares.push(
        <div 
          key={num} 
          className={`square ${playersOnSquare.length > 0 ? 'has-player' : ''} ${hasSnake ? 'snake' : ''} ${hasLadder ? 'ladder' : ''}`}
        >
          <span className="square-number">{num}</span>
          {playersOnSquare.length > 0 && (
            <div className="players-container">
              {playersOnSquare.map(p => (
                <div 
                  key={p.id} 
                  className="player-piece" 
                  style={{ 
                    backgroundColor: PLAYER_COLORS[p.id % PLAYER_COLORS.length],
                    transform: `scale(${0.7 + (1 / (playersOnSquare.length + 1))})`
                  }}
                />
              ))}
            </div>
          )}
          {hasSnake && <div className="snake-head">🐍</div>}
          {hasLadder && <div className="ladder-bottom">🪜</div>}
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
  const [rolling, setRolling] = useState(false)
  const [message, setMessage] = useState('Roll the dice to start!')
  const [gameStarted, setGameStarted] = useState(false)

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
    setGameStarted(true)
  }

  const rollDice = () => {
    const currentPlayer = players[currentPlayerIndex]
    if (currentPlayer.won) {
      setMessage(`Player ${currentPlayer.id + 1} already won! Next player's turn.`)
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
        
        let newPosition = currentPlayer.position + finalValue
        if (newPosition > 100) {
          setMessage(`Player ${currentPlayer.id + 1} rolled ${finalValue}. Need exactly ${100 - currentPlayer.position} to win!`)
        } else {
          const updatedPlayers = [...players]
          updatedPlayers[currentPlayerIndex] = { ...currentPlayer, position: newPosition }
          setPlayers(updatedPlayers)
          
          if (SNAKES[newPosition]) {
            setTimeout(() => {
              const finalPlayers = [...updatedPlayers]
              finalPlayers[currentPlayerIndex] = { ...currentPlayer, position: SNAKES[newPosition] }
              setPlayers(finalPlayers)
              setMessage(`Oh no! Player ${currentPlayer.id + 1} bitten by snake! Going down to ${SNAKES[newPosition]}`)
            }, 500)
          } else if (LADDERS[newPosition]) {
            setTimeout(() => {
              const finalPlayers = [...updatedPlayers]
              finalPlayers[currentPlayerIndex] = { ...currentPlayer, position: LADDERS[newPosition] }
              setPlayers(finalPlayers)
              setMessage(`Yay! Player ${currentPlayer.id + 1} found a ladder! Going up to ${LADDERS[newPosition]}`)
            }, 500)
          } else {
            setMessage(`Player ${currentPlayer.id + 1} rolled ${finalValue}. Moved to ${newPosition}`)
          }
          
          const checkWin = (pos: number) => {
            return pos === 100 || (LADDERS[pos] && LADDERS[pos] === 100) || (SNAKES[pos] && SNAKES[pos] === 100)
          }
          
          if (checkWin(newPosition)) {
            setTimeout(() => {
              const winPlayers = [...players]
              winPlayers[currentPlayerIndex] = { ...currentPlayer, position: newPosition, won: true }
              setPlayers(winPlayers)
              setMessage(`🎉 Congratulations Player ${currentPlayer.id + 1}! You won! 🎉`)
            }, 700)
          } else {
            setTimeout(() => {
              setCurrentPlayerIndex((prev) => (prev + 1) % numPlayers)
            }, 1000)
          }
        }
      }
    }, 100)
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
          <Dice value={diceValue} onRoll={rollDice} rolling={rolling} />
          
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
