import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import ExpenseForm from './ExpenseForm'

const PASSWORD = process.env.REACT_APP_PASSWORD

function App() {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('fintrack-auth')
    if (saved === 'true') setAuthed(true)
  }, [])

  function handleLogin() {
    if (input === PASSWORD) {
      sessionStorage.setItem('fintrack-auth', 'true')
      setAuthed(true)
    } else {
      alert('wrong password')
      setInput('')
    }
  }

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <h2 className="text-xl font-medium">fintrack-my</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="password"
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400"
        />
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium"
        >
          Enter
        </button>
      </div>
    )
  }

  return <ExpenseForm />
}

export default App