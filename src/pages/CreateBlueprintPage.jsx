import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBlueprint } from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function CreateBlueprintPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.blueprints)

  const [author, setAuthor] = useState('')
  const [name, setName] = useState('')
  const [points, setPoints] = useState([])
  const [canvasSize] = useState({ width: 520, height: 360 })

  const handleCanvasClick = (e) => {
    const canvas = e.target
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.round((e.clientX - rect.left) * scaleX)
    const y = Math.round((e.clientY - rect.top) * scaleY)
    setPoints((prev) => [...prev, { x, y }])
  }

  const handleClear = () => setPoints([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!author || !name || points.length < 2) return
    const result = await dispatch(createBlueprint({ author, name, points }))
    if (createBlueprint.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
      <form className="card" onSubmit={handleSubmit}>
        <h2 style={{ marginTop: 0 }}>Crear Blueprint</h2>
        <div className="grid cols-2" style={{ marginBottom: 12 }}>
          <div>
            <label htmlFor="bp-author">Autor</label>
            <input
              id="bp-author"
              className="input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="juan.perez"
            />
          </div>
          <div>
            <label htmlFor="bp-name">Nombre</label>
            <input
              id="bp-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mi-dibujo"
            />
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Haz clic en el lienzo para agregar puntos ({points.length} puntos)
        </p>
        {error && <p style={{ color: '#f87171' }}>⚠ {error}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            type="submit"
            className="btn primary"
            disabled={status === 'loading' || points.length < 2}
          >
            {status === 'loading' ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" className="btn" onClick={handleClear}>
            Limpiar puntos
          </button>
        </div>
      </form>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Lienzo — clic para agregar puntos</h3>
        <div onClick={handleCanvasClick} style={{ cursor: 'crosshair' }}>
          <BlueprintCanvas
            points={points}
            width={canvasSize.width}
            height={canvasSize.height}
          />
        </div>
      </div>
    </div>
  )
}
