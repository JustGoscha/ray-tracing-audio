# Ray Tracing Audio

A sound engine for the web with sound propagation simulation with binaural capabilities. In early development!

See live demo here:
https://justgoscha.github.io/ray-tracing-audio/

https://github.com/user-attachments/assets/1526e4f9-4a53-44aa-b299-3d05975732a6


## Description

Ray Tracing Audio is a web-based sound propagation engine that simulates how sound travels through spaces. It uses ray tracing techniques to model sound reflections and propagation, with binaural audio output capabilities for immersive 3D audio experiences.

## Features

- Sound ray tracing for realistic audio propagation
- Binaural audio rendering
- Real-time visualization of sound rays
- Interactive environment for testing audio propagation

## Requirements

- Node.js and npm

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ray-tracing-audio.git
   cd ray-tracing-audio
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Project

1. Build the project:
   ```
   npm run build
   ```

2. For development with automatic rebuilds:
   ```
   npm run watch
   ```

3. To build and get instructions for viewing:
   ```
   npm start
   ```

4. Open `index.html` in a browser to see the visualization and hear the audio.

## Project Structure

- `js/` - Source JavaScript files
  - `webaudio/` - Web Audio API implementation
  - `main.js` - Application entry point
- `build/` - Compiled JavaScript (created by the build process)
- `style/` - CSS styles
- `lib/` - External libraries
- `assets/` - Media files

## Development

The project uses:
- Gulp for building
- Babel for ES6+ transpilation
- Browserify for bundling
- Prettier for code formatting

### Code Formatting

The project uses Prettier for consistent code formatting. To format your code:

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

## License

MIT License - See LICENSE file for details
