import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
    value: null,
    isLoading: false,
    error: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (token, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/api/user/data', {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!data.success) {
            return rejectWithValue(data.message)
        }
        return data.user
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateUser = createAsyncThunk('user/updateUser', async ({ userData, token }, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/api/user/update', userData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) {
            toast.success(data.message)
            return data.user
        } else {
            toast.error(data.message)
            return rejectWithValue(data.message)
        }
    } catch (error) {
        toast.error(error.message)
        return rejectWithValue(error.message)
    }
})


const useSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.value = action.payload
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || action.error.message
                state.value = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.value = action.payload
            })
    }
})

export default useSlice.reducer
