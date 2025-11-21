# 🎮 Neon Tetris 3D

A stunning 3D Tetris game built with Three.js and Vite, featuring a futuristic neon aesthetic and smooth gameplay.

## 🚀 Live Demo

Play the game now: **[https://jashan-ai-sys.github.io/first_app/](https://jashan-ai-sys.github.io/first_app/)**

## ✨ Features

- **3D Graphics**: Immersive 3D gameplay powered by Three.js
- **Neon Aesthetic**: Vibrant neon colors and futuristic design
- **Smooth Animations**: Fluid piece movements and rotations
- **Classic Tetris Mechanics**: All the gameplay you know and love
- **Responsive Controls**: Keyboard controls for precise movements

## 🎯 How to Play

- **Arrow Keys**: Move pieces left/right and rotate
- **Down Arrow**: Soft drop (move piece down faster)
- **Space Bar**: Hard drop (instantly drop piece)
- **Goal**: Complete horizontal lines to score points and clear the board

## 🛠️ Tech Stack

- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **Vanilla JavaScript** - Pure JS, no frameworks
- **CSS3** - Modern styling with animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jashan-ai-sys/first_app.git
   cd first_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🏗️ Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

## 🚀 Deployment

This project is configured for GitHub Pages deployment:

```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch.

## 📁 Project Structure

```
first_app/
├── src/
│   ├── main.js          # Entry point
│   ├── Game.js          # Game logic and state management
│   ├── Grid.js          # Game grid implementation
│   ├── Piece.js         # Tetris piece logic
│   └── Renderer.js      # Three.js rendering
├── public/              # Static assets
├── index.html           # Main HTML file
├── style.css            # Styling
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🎨 Customization

### Changing Colors
Edit the neon colors in `style.css` and the piece colors in `src/Piece.js`.

### Adjusting Game Speed
Modify the drop speed in `src/Game.js` to make the game easier or harder.

### Grid Size
Change the grid dimensions in `src/Grid.js` (default is 10x20).

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Three.js](https://threejs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Inspired by classic Tetris gameplay

## 📧 Contact

Created by [@Jashan-ai-sys](https://github.com/Jashan-ai-sys)

---

**Enjoy the game!** 🎮✨
