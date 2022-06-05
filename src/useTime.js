import { useId, useState, useEffect } from 'react'
const callbacks = new Map()
let masterStart = null
let last = 0
let id = null
let keepRunning = true
function run(ms) {
  last = ms
  if (masterStart == null) {
    masterStart = Date.now() - last
  }

  for (let cb of callbacks.values()) {
    const { start, result, fn, setResult } = cb
    const next = fn(masterStart + last)
    if (next !== result) {
      cb.result = next
      setResult(next)
    }
  }

  if (keepRunning) id = requestAnimationFrame(run)
}
if (window?.requestAnimationFrame != null) {
  id = requestAnimationFrame(run)
}

export function freezeTime() {
  cancelAnimationFrame(id)
  keepRunning = false
  if (masterStart == null) masterStart = Date.now()
}

export function waitFor(ms) {
  if (ms > 0) run(last + ms)
}

export function useTimeOnce() {
  const [start, _] = useState(masterStart + last)
  return start
}

function getFreshResult() {
  return masterStart + last
}

export function useTime(fn) {
  const me = useId()
  let start = null
  
  const [result, setResult] = useState(() => {
    start = last
    return fn(masterStart + last)
  })

  useEffect(() => {
    callbacks.set(me, {
      start,
      fn,
      result,
      setResult
    })
    return () => {
      callbacks.delete(me)
    }
  }, [])

  return [result, getFreshResult]
}
