/**
 * API client — consume el API REST real con Axios.
 * Implementa la misma interfaz que apimock.js
 */
import api from './apiClient.js'

const apiclient = {
  async getAll() {
    const { data } = await api.get('/blueprints')
    return data
  },

  async getByAuthor(author) {
    const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`)
    return data
  },

  async getByAuthorAndName(author, name) {
    const { data } = await api.get(
      `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return data
  },

  async create(blueprint) {
    const { data } = await api.post('/blueprints', blueprint)
    return data
  },
}

export default apiclient
