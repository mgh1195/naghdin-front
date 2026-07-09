import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import SummaryStats from "./components/SummaryStats"
import Opportunities from "./components/Opportunities"
import ProjectDetails from "./components/ProjectDetails"
import LoginPage from "./components/LoginPage"
import Footer from "./components/Footer"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import { AuthModalProvider } from "./context/AuthModalContext"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  return (
    <AuthProvider>
      <AuthModalProvider>
        <CartProvider>
      <div className="min-h-screen bg-background">
        <ScrollToTop />
        {pathname !== "/login" && (
          <Navbar alwaysSolid={pathname !== "/"} />
        )}
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
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        {pathname !== "/login" && <Footer />}
      </div>
        </CartProvider>
      </AuthModalProvider>
    </AuthProvider>
  )
}
