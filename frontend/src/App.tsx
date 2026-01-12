import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Category } from "./pages/Category"
import { Search } from "./pages/Search"
import { Submit } from "./pages/Submit"
import { About } from "./pages/About"
import { SavedTools } from "./pages/SavedTools"
import { NotFound } from "./pages/NotFound"

// Admin Pages
import { AdminLayout } from "./pages/admin/AdminLayout"
import { AdminDashboard } from "./pages/admin/DashboardClean"
import { AdminTools } from "./pages/admin/AdminTools"
import { AdminPending } from "./pages/AdminPending"
import { AdminUsers } from "./pages/admin/AdminUsers"
import { AdminCategories } from "./pages/admin/AdminCategories"

import { ToolProvider } from "./context/ToolContext"
import { AuthProvider } from "./context/AuthContext"

function App() {
  // Force rebuild 4
  return (
    <AuthProvider>
      <ToolProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="category/:slug" element={<Category />} />
              <Route path="search" element={<Search />} />
              <Route path="submit" element={<Submit />} />
              <Route path="about" element={<About />} />
              <Route path="saved-tools" element={<SavedTools />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes - Recharts installed */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="moderation" element={<AdminPending />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToolProvider>
    </AuthProvider>
  )
}

export default App
