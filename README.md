# Snake and Ladder Game

A modern, interactive Snake and Ladder board game built with React, TypeScript, and Vite. This classic board game features smooth animations, multiplayer support, and a fully responsive design.

## Features

- 🎮 **Multiplayer Support**: Play with 2-6 players
- 🎯 **Step-by-Step Movement**: Realistic step-by-step player movement animations
- 🐍 **Visual Snake Indicators**: Clear indicators showing snake positions and destinations
- 🪜 **Visual Ladder Indicators**: Clear indicators showing ladder positions and destinations
- 🎲 **Animated Dice**: Smooth dice rolling animation
- 🎨 **Player Pieces**: Color-coded player pieces with numbered indicators
- 📱 **Fully Responsive**: Optimized layout that works on desktop, tablet, and mobile devices
- 🔄 **Turn-Based Gameplay**: Proper turn alternation with roll-6 rule
- ✨ **Smooth Animations**: Bounce effects for player movement, jump animations for snakes and ladders
- 🎉 **Win Celebration**: Celebratory message when a player reaches square 100

## Game Rules

1. **Objective**: Be the first player to reach square 100
2. **Movement**: Roll the dice and move your piece the corresponding number of squares
3. **Turn System**: Players take turns in order (Player 1 → Player 2 → ... → Player 1)
4. **Roll 6 Rule**: If you roll a 6, you get an extra turn
5. **Snakes**: If you land on a snake's head, you slide down to its tail
6. **Ladders**: If you land on a ladder's bottom, you climb up to its top
7. **Win Condition**: Reach exactly square 100 to win

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd snake-ladder
```

2. Install dependencies:
```bash
pnpm install
```

## Running the Project

### Development Mode
```bash
pnpm dev
```

The game will be available at `http://localhost:5173`

### Build for Production
```bash
pnpm build
```

The optimized production build will be created in the `dist` directory.

### Preview Production Build
```bash
pnpm preview
```

## Technologies Used

- **React 18**: Modern React with Hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **CSS3**: Custom styling with responsive design and animations

## Game Board Layout

- **Board Size**: 10x10 grid (100 squares)
- **Snakes**: 10 snakes placed at various positions
- **Ladders**: 9 ladders placed at various positions
- **Player Colors**: 6 distinct colors for player identification

## Snake Positions

| Start | End |
|-------|------|
| 16    | 6    |
| 47    | 26   |
| 49    | 11   |
| 56    | 53   |
| 62    | 19   |
| 64    | 60   |
| 87    | 24   |
| 93    | 73   |
| 95    | 75   |
| 98    | 78   |

## Ladder Positions

| Start | End |
|-------|------|
| 1     | 38   |
| 4     | 14   |
| 9     | 31   |
| 21    | 42   |
| 28    | 84   |
| 36    | 44   |
| 51    | 67   |
| 71    | 91   |
| 80    | 100  |

## Project Structure

```
snake-ladder/
├── src/
│   ├── App.tsx          # Main game component
│   ├── App.css          # Game styles
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── README.md          # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Future Enhancements

- [ ] Sound effects for dice rolling and player movement
- [ ] Game history and statistics
- [ ] Customizable board layout
- [ ] AI opponents
- [ ] Online multiplayer support
- [ ] Leaderboard and high scores

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
