import { render, screen, fireEvent, act } from '@testing-library/react';
import { freezeTime, waitFor } from './useTime.js'
import App from './App';

test('start button exists by default', () => {
  render(<App />);
  const button = screen.getByText('Start Working')
  expect(button).toBeInTheDocument()
})

test('clicking start button switches to working mode', () => {
  render(<App />);
  const button = screen.getByText('Start Working')
  fireEvent.click(button)
  const newButton = screen.getByText('Take a Break')
  expect(newButton).toBeInTheDocument()
})

test('clicking stop button switches to break mode', () => {
  render(<App />);
  const startButton = screen.getByText('Start Working')
  fireEvent.click(startButton)
  const stopButton = screen.getByText('Take a Break')
  fireEvent.click(stopButton)
  const startButton2 = screen.getByText('Start Working')
  expect(startButton2).toBeInTheDocument()
})

const msps = 1000
const spm = 60
const mph = 60
test('shows time spent working and time for short break', () => {
  freezeTime()
  render(<App />)
  const startButton = screen.getByText('Start Working')
  fireEvent.click(startButton)
  act(() => {
    waitFor(25*spm*msps)
  })
  const stopButton = screen.getByText('Take a Break')
  act(() => {
    fireEvent.click(stopButton)
  })
  const timeSpent = screen.getByText('You worked for 25 minutes straight!')
  const shortBreak = screen.getByText('You have 5 minutes left for a short break.')
  expect(timeSpent).toBeInTheDocument()
  expect(shortBreak).toBeInTheDocument()
})

test('shows time for long break', () => {
  freezeTime()
  render(<App />)
  for (let i = 0; i < 2; i++) {
    const startButton = screen.getByText('Start Working')
    act(() => {
      fireEvent.click(startButton)
    })
    act(() => {
      waitFor(25*spm*msps)
    })
    const stopButton = screen.getByText('Take a Break')
    act(() => {
      fireEvent.click(stopButton)
    })
    act(() => {
      waitFor(5*spm*msps)
    })
  }
  const timeSpent = screen.getByText('You worked for 25 minutes straight!')
  const shortBreak = screen.getByText('You have 0 minutes left for a short break.')
  const longBreak = screen.getByText('You have 10 minutes left for a long break.')
  expect(timeSpent).toBeInTheDocument()
  expect(shortBreak).toBeInTheDocument()
  expect(longBreak).toBeInTheDocument()
})
