import { useState } from 'react'
import './App.css'

function App() {

  const [name, setName] = useState('Simo')

  return (
    <>
        <button onClick={() => setName(na => (na === 'Simo' ? 'Eddahmani' : 'Simo'))}>
          hello my name is <span className='text-red-300 text-xl'>{name}</span>
        </button>
    </>
  )
}

export default App
