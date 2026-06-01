import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import ExpenseForm from './ExpenseForm'

function App() {
  const [categories, setCategories] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase.from('categories').select('*')
      const { data: pms } = await supabase.from('payment_methods').select('*')
      setCategories(cats || [])
      setPaymentMethods(pms || [])
    }
    fetchData()
  }, [])

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



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
