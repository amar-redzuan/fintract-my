import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function Dashboard() {
  const [openSection, setOpenSection] = useState(null)
  const [personalTotals, setPersonalTotals] = useState({ today: 0, week: 0, month: 0 })
  const [familyTotal, setFamilyTotal] = useState(0)
  const [familyByCard, setFamilyByCard] = useState({})

  useEffect(() => {
    fetchPersonalTotals()
    fetchFamilyTotals()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getDateRanges() {
    const today = new Date().toISOString().split('T')[0]
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const weekStr = startOfWeek.toISOString().split('T')[0]
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    const monthStr = startOfMonth.toISOString().split('T')[0]
    return { today, weekStr, monthStr }
  }

  const sum = arr => arr?.reduce((a, b) => a + parseFloat(b.amount), 0) || 0

  async function fetchPersonalTotals() {
    const { today, weekStr, monthStr } = getDateRanges()

    const { data: todayData } = await supabase.from('personal_expenses').select('amount').eq('date', today)
    const { data: weekData } = await supabase.from('personal_expenses').select('amount').gte('date', weekStr)
    const { data: monthData } = await supabase.from('personal_expenses').select('amount').gte('date', monthStr)

    setPersonalTotals({
      today: sum(todayData),
      week: sum(weekData),
      month: sum(monthData)
    })
  }

  async function fetchFamilyTotals() {
    const { monthStr } = getDateRanges()

    const { data } = await supabase
      .from('family_expenses')
      .select('amount, card_used')
      .gte('date', monthStr)

    setFamilyTotal(sum(data))

    const byCard = {}
    data?.forEach(row => {
      byCard[row.card_used] = (byCard[row.card_used] || 0) + parseFloat(row.amount)
    })
    setFamilyByCard(byCard)
  }

  function toggle(section) {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="max-w-sm mx-auto px-4 pt-4">
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100 mb-4">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Finance Tracker</h1>
          <p className="text-xs text-gray-400">Perbelanjaan</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
          {new Date().toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
        </span>
      </div>
      {/* Personal accordion */}

      <div className="border border-gray-100 rounded-xl mb-3 overflow-hidden bg-white">
        <div
          className="flex justify-between items-center px-4 py-3.5 cursor-pointer"
          onClick={() => toggle('personal')}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
              🧑
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">My expenses</p>
              <p className="text-xs text-gray-400">This month</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              RM {personalTotals.month.toFixed(2)}
            </span>
            <span className={`text-gray-400 transition-transform ${openSection === 'personal' ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </div>
        </div>
        {openSection === 'personal' && (
          <div className="px-4 pb-3.5 pt-1 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400 mb-0.5">Today</p>
                <p className="text-sm font-medium">RM {personalTotals.today.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400 mb-0.5">Week</p>
                <p className="text-sm font-medium">RM {personalTotals.week.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400 mb-0.5">Month</p>
                <p className="text-sm font-medium">RM {personalTotals.month.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Family accordion */}
      <div className="border border-gray-100 rounded-xl mb-3 overflow-hidden bg-white">
        <div
          className="flex justify-between items-center px-4 py-3.5 cursor-pointer"
          onClick={() => toggle('family')}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
              👨‍👩‍👦
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Family expenses</p>
              <p className="text-xs text-gray-400">This month · by card</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              RM {familyTotal.toFixed(2)}
            </span>
            <span className={`text-gray-400 transition-transform ${openSection === 'family' ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </div>
        </div>
        {openSection === 'family' && (
          <div className="px-4 pb-3.5 pt-1 border-t border-gray-100">
            <div className="flex flex-col gap-2 mt-3">
              {Object.entries(familyByCard).map(([card, amt]) => (
                <div key={card} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 capitalize">{card}'s card</span>
                  <span className="text-sm font-medium text-gray-900">RM {amt.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard