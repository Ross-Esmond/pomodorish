import { useState } from 'react'
import { useTime, useTimeOnce } from './useTime.js'
import Button from 'react-bootstrap/Button'
import BreakTime from './BreakTime'
import './App.css';

function at(arr, pos = -1) {
  return arr[pos >= 0 ? pos : arr.length + pos]
}

let many = 0
function App() {
  const [events, setEvents] = useState([])
  const [seconds, getTime] = useTime(ms => null)

  function handleEvent() {
    setEvents(events => [...events, getTime()])
  }

  const working = events.length % 2 !== 0
  const lastWorked = events.length >= 2 && !working ? at(events) - at(events, -2) : null

  if (events.length === 0) {
    return (
      <div className="App">
        <Button onClick={handleEvent}>
          Start Working
        </Button>
      </div>
    );
  } else if (events.length % 2 === 0) {
    return (
      <div className="App">
        <BreakTime events={events} onStartWorking={handleEvent} />
      </div>
    );
  } else {
    return (
      <div className="App">
        <Button onClick={handleEvent}>
          Take a Break
        </Button>
      </div>
    );
  }
}

export default App;
