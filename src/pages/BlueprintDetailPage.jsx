import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchBlueprint } from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintDetailPage() {
  const { author, name } = useParams()
  const dispatch = useDispatch()
  const bp = useSelector((s) => s.blueprints.current)
  const status = useSelector((s) => s.blueprints.status)

  useEffect(() => {
    dispatch(fetchBlueprint({ author, name }))
  }, [author, name, dispatch])

  if (status === 'loading' || !bp)
    return (
      <div className="card">
        <div className="loading-spinner" aria-label="Cargando">
          <div className="spinner" />
          <p>Cargando blueprint...</p>
        </div>
      </div>
    )

  return (
    <div className="card">
      <Link to="/" className="btn" style={{ marginBottom: 12, display: 'inline-block' }}>
        ← Volver
      </Link>
      <h2 style={{ marginTop: 0 }}>{bp.name}</h2>
      <p>
        <strong>Autor:</strong> {bp.author}
      </p>
      <p>
        <strong>Puntos:</strong> {bp.points?.length || 0}
      </p>
      <BlueprintCanvas points={bp.points || []} />
    </div>
  )
}
