import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: []
}

// Async thunk to fetch connections
export const fetchConnection = createAsyncThunk(
    'connection/fetchConnections',
    async (token) => {
        const { data } = await api.get('/api/user/connections', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data.success ? data : null
    }
)

// Slice definition
const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchConnection.fulfilled, (state, action) => {
            if (action.payload) {
                state.connections = action.payload.connections
                state.pendingConnections = action.payload.pendingConnections
                state.followers = action.payload.followers
                state.following = action.payload.following
            }
        })
    }
})

export default connectionsSlice.reducer
