import { useState, useEffect } from 'react'

const CATEGORIES = [
  { id: 'C01', label: 'Food', icon: '🍜' },
  { id: 'C02', label: 'Transport', icon: '🚗' },
  { id: 'C07', label: 'Groceries', icon: '🛒' },
  { id: 'C08', label: 'Entertainment', icon: '🎮' },
  { id: 'C03', label: 'Housing', icon: '🏠' },
  { id: 'C04', label: 'Utilities', icon: '💡' },
  { id: 'C05', label: 'Investment', icon: '📈' },
  { id: 'C06', label: 'Debt', icon: '🏦' },
]

const PAYMENTS = [
  { id: 'PM01', label: 'QR Maybank' },
  { id: 'PM02', label: 'TNG eWallet' },
  { id: 'PM03', label: 'Debit Card' },
  { id: 'PM04', label: 'Family CC' },
  { id: 'PM05', label: 'Bank Transfer' },
]

function ExpenseForm() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('C01')
  const [paymentMethodId, setPaymentMethodId] = useState('PM01')
  const [note, setNote] = useState('')
  const [score, setScore] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [recentExpenses, setRecentExpenses] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchRecent() }, [])

  async function fetchRecent() {
    const { data } = await supabase
      .from('personal_expenses')
      .select('id, date, description, amount, category_id, note, score')
      .order('date', { ascending: false })
      .limit(5)
    setRecentExpenses(data || [])
  }

  async function handleSubmit() {
    if (!amount || !description) {
      alert('please fill in amount and description')
      return
    }
    setSaving(true)
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
    setSaving(false)
    if (error) {
      console.error(error)
      alert('something went wrong')
    } else {
      setAmount('')
      setDescription('')
      setNote('')
      setScore(null)
      fetchRecent()
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('delete this entry?')) return
    const { error } = await supabase
      .from('personal_expenses')
      .delete()
      .eq('id', id)
    if (!error) fetchRecent()
  }

  function getTodayStr() { return new Date().toISOString().split('T')[0] }
  function getYesterdayStr() {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  }


  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white">

      {/* header */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-lg font-medium text-gray-900">fintrack-my</h1>
          <p className="text-xs text-gray-400">personal expenses</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
          {new Date().toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
        </span>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* amount */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Amount</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-medium text-gray-400">RM</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-12 pr-4 py-3 text-2xl font-medium bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* description */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="makan / tol / parking / groceries"
            className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-400 text-sm"
          />
        </div>

        {/* category */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Category</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                  categoryId === cat.id
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* payment method */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Paid with</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {PAYMENTS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethodId(pm.id)}
                className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                  paymentMethodId === pm.id
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* date */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Date</label>
          <div className="flex gap-2 mt-1 mb-2">
            {[
              { label: 'Today', value: getTodayStr() },
              { label: 'Yesterday', value: getYesterdayStr() },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => setDate(opt.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  date === opt.value
                    ? 'border-gray-400 bg-white text-gray-900 font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* note */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="sedap tak?"
            className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-400 text-sm"
          />
        </div>

        {/* score */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Score</label>
          <div className="flex gap-2 mt-1">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => setScore(score === n ? null : n)}
                className={`text-2xl transition-all ${score >= n ? 'opacity-100' : 'opacity-20'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* save button */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-medium text-sm disabled:opacity-50 active:scale-95 transition-all"
        >
          {saving ? 'Saving...' : 'Save expense'}
        </button>
      </div>

      {/* recent entries */}
      <div className="mt-4 border-t border-gray-100">
        <p className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Recent entries</p>
        {recentExpenses.map(exp => {
          const cat = CATEGORIES.find(c => c.id === exp.category_id)
          return (
            <div key={exp.id} className="flex justify-between items-center px-4 py-3 border-b border-gray-50">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-gray-900">{exp.description}</span>
                <span className="text-xs text-gray-400">
                  {exp.date} · {cat?.icon} {cat?.label}
                  {exp.note && ` · ${exp.note}`}
                  {exp.score && ` · ${'★'.repeat(exp.score)}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  RM {parseFloat(exp.amount).toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-400 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExpenseForm