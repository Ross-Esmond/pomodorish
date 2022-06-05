import { useState } from 'react'
import { useTime, useTimeOnce } from './useTime.js'
import Button from 'react-bootstrap/Button'
import './App.css';

function at(arr, pos = -1) {
  return arr[pos >= 0 ? pos : arr.length + pos]
}

function getSpans(events) {
  const spans = []
  for (let i = 0; i < Math.floor(events.length/2); i++) {
    spans.push(events[(i*2)+1] - events[(i*2)])
  }
  return spans
}

export default function BreakTime({ events, onStartWorking }) {
  const [now, getTime] = useTime(ms => Math.floor(ms/1000)*1000)
  const lastWorked = events.length >= 2 ? at(events) - at(events, -2) : null
  const totalWorked = getSpans(events).reduce((a, b) => a + b, 0)
  const breakLength = now - at(events)
  const shortBreakMax = lastWorked*0.2
  const shortBreakRemaining = Math.floor(Math.max(shortBreakMax - breakLength, 0))
  const longBreakMax = totalWorked*0.3
  const longBreakRemaining = Math.floor(Math.max(longBreakMax - breakLength, 0))

  return (
    <div>
      <div>
        {lastWorked != null ?
          `You worked for ${Math.floor(lastWorked/60000)} minutes straight!` :
          null}
      </div>
      <div>
        {`You have ${Math.floor(shortBreakRemaining/60000)} minutes left for a short break.`}
      </div>
      <div>
        {`You have ${Math.floor(longBreakRemaining/60000)} minutes left for a long break.`}
      </div>
      <Button onClick={onStartWorking}>
        Start Working
      </Button>
    </div>
  );
}

