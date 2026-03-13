import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

// ---- Thunks ----

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const data = await blueprintsService.getAll()
  const authors = [...new Set(data.map((bp) => bp.author))]
  return authors
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const data = await blueprintsService.getByAuthor(author)
  return { author, items: data }
})

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    const data = await blueprintsService.getByAuthorAndName(author, name)
    return data
  },
)

export const createBlueprint = createAsyncThunk(
  'blueprints/createBlueprint',
  async (payload, thunkAPI) => {
    try {
      const data = await blueprintsService.create(payload)
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

// ---- Slice ----

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAuthors
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      // fetchByAuthor
      .addCase(fetchByAuthor.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      // fetchBlueprint
      .addCase(fetchBlueprint.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      // createBlueprint
      .addCase(createBlueprint.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        s.status = 'succeeded'
        const bp = a.payload
        if (s.byAuthor[bp.author]) {
          s.byAuthor[bp.author].push(bp)
        }
      })
      .addCase(createBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || a.error.message
      })
  },
})

// ---- Memo selectors ----

const selectBlueprintsState = (state) => state.blueprints

export const selectAllByAuthor = (author) =>
  createSelector(selectBlueprintsState, (s) => s.byAuthor[author] || [])

export const selectTop5ByPoints = createSelector(selectBlueprintsState, (s) => {
  const all = Object.values(s.byAuthor).flat()
  return [...all].sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0)).slice(0, 5)
})

export const { clearError } = slice.actions
export default slice.reducer
