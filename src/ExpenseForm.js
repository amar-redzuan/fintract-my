import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function ExpenseForm({ categories, paymentMethods }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [note, setNote] = useState('')
  const [score, setScore] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [recentExpenses, setRecentExpenses] = useState([])

  useEffect(() => {
  fetchRecent()
}, [])

  async function handleSubmit() {
    if (!amount || !description || !categoryId || !paymentMethodId) {
      alert('please fill in amount, description, category and payment method')
      return
    } 

    const { error } = await supabase
      .from('personal_expenses')
      .insert({
        date,
        category_id: categoryId,
        description,
        amount: parseFloat(amount),
        payment_method_id: paymentMethodId,
        bank_account_id: 'BA01',
        note: note || null,
        score: score || null
      })

    if (error) {
      console.error(error)
      alert('something went wrong')
    } else {
      alert('saved!')
      setAmount('')
      setDescription('')
      setNote('')
      setScore(null)
      fetchRecent()
    }
  }

  async function fetchRecent() {
  const { data } = await supabase
    .from('personal_expenses')
    .select(`
      id,
      date,
      description,
      amount,
      category_id,
      note,
      score
    `)
    .order('date', { ascending: false })
    .limit(5)

  setRecentExpenses(data || [])
}

async function handleDelete(id) {
  const confirm = window.confirm('delete this entry?')
  if (!confirm) return

  const { error } = await supabase
    .from('personal_expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    alert('something went wrong')
  } else {
    fetchRecent()
  }
}

  return (
    <div style={{ padding: '16px', maxWidth: '400px' }}>
      <h2>add expense</h2>

      <div>
        <label>amount (RM)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div>
        <label>description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="nasi kandar ss15"

          
        />
      </div>

      <div>
        <label>date</label>
        <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />
      </div>


      <div>
        <label>category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>payment method</label>
        <select value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)}>
          <option value="">select payment</option>
          {paymentMethods.map(pm => (
            <option key={pm.id} value={pm.id}>{pm.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="sedap tak?"
        />
      </div>
        <div>
        <label>score (1-5)</label>
        <input
            type="number"
            min="1"
            max="5"
            value={score || ''}
            onChange={(e) => setScore(parseInt(e.target.value))}
            placeholder="optional"
        />
        </div>
      <button onClick={handleSubmit}>save expense</button>
          <div style={{ marginTop: '24px' }}>
      <h3>recent entries</h3>
      {recentExpenses.map(exp => (
      <div key={exp.id} style={{ 
        padding: '10px', 
        borderBottom: '1px solid #eee',
        fontSize: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{exp.description}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>RM {parseFloat(exp.amount).toFixed(2)}</span>
            <button 
              onClick={() => handleDelete(exp.id)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#ff4444', 
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 4px'
              }}
            >×</button>
          </div>
        </div>
        <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
          {exp.date} {exp.note && `· ${exp.note}`} {exp.score && `· ${'★'.repeat(exp.score)}`}
        </div>
      </div>
      ))}
    </div>
    </div>
  )
}

export default ExpenseForm