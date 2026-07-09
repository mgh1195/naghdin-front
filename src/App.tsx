import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import SummaryStats from "./components/SummaryStats"
import Opportunities from "./components/Opportunities"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SummaryStats />
        <Opportunities />
      </main>
      <Footer />
    </div>
  )
}
