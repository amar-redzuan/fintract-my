import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import ExpenseForm from './ExpenseForm'

const PASSWORD = process.env.REACT_APP_PASSWORD

function App() {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')
  const [categories, setCategories] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])

  useEffect(() => {
    // check if already logged in this session
    const saved = sessionStorage.getItem('fintrack-auth')
    if (saved === 'true') setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    async function fetchData() {
      const { data: cats } = await supabase.from('categories').select('*')
      const { data: pms } = await supabase.from('payment_methods').select('*')
      setCategories(cats || [])
      setPaymentMethods(pms || [])
    }
    fetchData()
  }, [authed])

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
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100vh',
        gap: '12px'
      }}>
        <h2>fintrack-my</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="password"
          style={{ padding: '8px 12px', fontSize: '16px' }}
        />
        <button onClick={handleLogin}>enter</button>
      </div>
    )
  }

  return (
    <div>
      <ExpenseForm 
        categories={categories} 
        paymentMethods={paymentMethods} 
      />
    </div>
  )
}

export default App