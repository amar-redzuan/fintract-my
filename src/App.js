import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import ExpenseForm from './ExpenseForm'
import FamilyExpenseForm from './FamilyExpenseForm'

const PASSWORD = process.env.REACT_APP_PASSWORD

function App() {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState('personal')

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

return (
  <div>
    <Dashboard />
    <div className="max-w-sm mx-auto px-4 flex gap-2 mb-2">
      <button
        onClick={() => setActiveTab('personal')}
        className={`flex-1 py-2 rounded-xl text-sm font-medium ${activeTab === 'personal' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}
      >
        My expenses
      </button>
      <button
        onClick={() => setActiveTab('family')}
        className={`flex-1 py-2 rounded-xl text-sm font-medium ${activeTab === 'family' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
      >
        Family
      </button>
    </div>
    {activeTab === 'personal' ? <ExpenseForm /> : <FamilyExpenseForm />}
  </div>
)
}

export default App