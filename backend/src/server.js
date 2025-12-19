import dotenv from 'dotenv'
import { createApp } from './app.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = createApp()

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`)
});
