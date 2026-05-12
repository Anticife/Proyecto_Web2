import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PropertyList from './components/PropertyList'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Hero />
        <PropertyList />
      </main>
      <Footer />
    </div>
  )
}

export default App
