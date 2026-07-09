import { useEffect } from "react"
import { useLocation, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import SummaryStats from "./components/SummaryStats"
import Opportunities from "./components/Opportunities"
import ProjectDetails from "./components/ProjectDetails"
import Footer from "./components/Footer"
import { CartProvider } from "./context/CartContext"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <SummaryStats />
                <Opportunities />
              </main>
            }
          />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  )
}
