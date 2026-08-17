# RE:BUILD — Real Frontend

This is the production-style frontend for the RE:BUILD invention engine. It is plain HTML/CSS/JavaScript so it can be opened directly with VS Code + Live Server.

## What it does

- Cinematic pixel-art-inspired RE:BUILD intro
- Craft Mode / Tech Mode
- Material selection (no photo upload)
- Purpose selection
- Budget selection
- Difficulty selection
- Time selection
- Animated generation screen
- Connects to the working Express backend
- Handles the backend's `tooDoof` response
- Displays the generated invention, materials, steps, cost, time and tips
- Lets the user edit inputs or build another invention
- Responsive layout for smaller screens

## Backend connection

The frontend sends:

`POST http://localhost:3000/api/generate`

with:

```json
{
  "mode": "craft",
  "materials": ["Cardboard Box", "Plastic Bottle", "Ice-Cream Sticks"],
  "purpose": "Organization",
  "budget": 50,
  "difficulty": "Easy",
  "time": "30 minutes"
}
```

If your backend is not on port 3000, edit the first line of `script.js`:

```js
const API_BASE = "http://localhost:3000";
```

## Run it

1. Start the backend first:

```bash
node server.js
```

2. Make sure the backend says it is running on port 3000.
3. Open this folder in VS Code.
4. Use **Live Server** on `index.html`.
5. The browser should open on the RE:BUILD intro screen.

No npm install is required for the frontend.
