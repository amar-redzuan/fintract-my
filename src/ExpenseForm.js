import { useState } from 'react'
import { supabase } from './supabase'

function ExpenseForm({ categories, paymentMethods }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [note, setNote] = useState('')
  const [score, setScore] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

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
    </div>
  )
}

export default ExpenseForm