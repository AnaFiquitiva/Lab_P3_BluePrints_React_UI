/**
 * Módulo conmutador de servicios.
 * Usa VITE_USE_MOCK para decidir entre apimock y apireal.
 *
 * En .env:
 *   VITE_USE_MOCK=true  → datos de prueba
 *   VITE_USE_MOCK=false → API REST real
 */
import apimock from './apimock.js'
import apiclient from './apireal.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const blueprintsService = useMock ? apimock : apiclient

export default blueprintsService
