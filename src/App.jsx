import { NavLink, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './features/auth/authSlice.js'
import BlueprintsPage from './pages/BlueprintsPage.jsx'
import BlueprintDetailPage from './pages/BlueprintDetailPage.jsx'
import CreateBlueprintPage from './pages/CreateBlueprintPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFound from './pages/NotFound.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

export default function App() {
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)

  return (
    <div className="container">
      <header>
        <h1>ECI — Blueprints React</h1>
        <nav>
          <NavLink to="/" end>
            Blueprints
          </NavLink>
          {token && <NavLink to="/create">Crear</NavLink>}
          {token ? (
            <button className="btn" onClick={() => dispatch(logout())}>
              Salir
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<BlueprintsPage />} />
        <Route path="/blueprints/:author/:name" element={<BlueprintDetailPage />} />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateBlueprintPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
