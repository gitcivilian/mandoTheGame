# Mando The Game

A browser-based action game inspired by "The Mandalorian". Play as Mando, upgrade your abilities, and survive waves of enemies! Collect Beskar, upgrade your armor and weapons, and see how long you can last.

## Features

- Play as Mando with custom controls and visuals.
- Survive increasingly difficult waves of enemies.
- Upgrade your stats with in-game currency (Beskar).
- Custom HUD, overlays, and visual effects.
- Grogu (Baby Yoda) power-ups and effects.
- Multiple difficulty levels.
- Persistent save system using localStorage.

## Game Structure

- `index.html`: Main HTML entry point for the game.
- `script.js`: Core game logic, upgrades, menu navigation, localStorage persistence, difficulty settings.
- `style.css`: Visual styling, custom cursor (Mando-themed), overlays, HUD, animations.
- `assets/`: Game images and textures.
    - `bg.png`: Background image.
    - `grogu.png`: Grogu character image.
    - `mando.png`: Mando character image.
    - `mando-cursor.png`: Mando-themed cursor.
    - `textures/sand.png`: Sand texture for backgrounds/environment.
- Menus and UI:
    - Main menu, upgrade menu, settings menu, end screen, HUD.
    - Difficulty selection and upgrades for HP, heat drain, dash regeneration, and weapon damage.

## How to Play

1. Open `index.html` in a browser.
2. Use keyboard/mouse to control Mando.
3. Survive waves, defeat enemies, collect Beskar.
4. Upgrade your abilities in the upgrade menu.
5. Adjust settings (shake, minimap, particles) as needed.
6. Your progress is saved automatically in localStorage.

## Installation & Running

1. Clone the repository:
   ```
   git clone https://github.com/gitcivilian/mandoTheGame.git
   ```
2. Open `index.html` in your preferred web browser.

No additional dependencies; everything runs client-side.

## Project Structure

.
├── LICENSE
├── README.md
├── assets/
│   ├── bg.png
│   ├── grogu.png
│   ├── mando-cursor.png
│   ├── mando.png
│   └── textures/
│       └── sand.png
├── index.html
├── script.js
└── style.css

## Credits

- Inspired by "The Mandalorian" and Star Wars universe.
- Developed by dilukshan.

## License

Distributed under the MIT License. See `LICENSE` for more information.
