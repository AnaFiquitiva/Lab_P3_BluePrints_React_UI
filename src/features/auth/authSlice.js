import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/apiClient.js'

export const login = createAsyncThunk('auth/login', async ({ username, password }, thunkAPI) => {
  try {
    // Si estamos en modo MOCK, simulamos un login exitoso
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      await new Promise((resolve) => setTimeout(resolve, 500)) // delay simulado
      const token = 'mock-jwt-token-123456789'
      localStorage.setItem('token', token)
      return { token, username }
    }

    // Si NO estamos en modo mock, usa el backend real
    const { data } = await api.post('/auth/login', { username, password })
    const token = data.access_token || data.token
    localStorage.setItem('token', token)
    return { token, username }
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Credenciales inválidas o servidor no disponible',
    )
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    username: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      state.username = null
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.token = a.payload.token
        s.username = a.payload.username
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || a.error.message
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
