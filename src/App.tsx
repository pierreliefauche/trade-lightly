import './App.css'
import { Grid } from './Chain/Grid'

function App() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      }}
    >
      <Grid symbol='MSFT' />
    </div>
  )
}

export default App
