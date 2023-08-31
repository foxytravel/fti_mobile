import { createSlice } from '@reduxjs/toolkit'

export const userDetailsSlice = createSlice({
    name: 'UserDetails',
    initialState: {
        auth: false,
        id: '',
        user: {},
        year:(new Date()).getFullYear(),
        month:(new Date()).getMonth() + 1
    },
    reducers: {
        GetAuth: (state, action) => {
            state.auth = action.payload
        },
        GetUserId: (state, action) => {
            state.id = action.payload
        },
        setMonth:(state,action)=>{
            state.month = action.payload

        },
        setYear:(state,action)=>{
            state.year = action.payload

        },
        GetUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const {GetAuth, GetUserId,  GetUser ,setYear,setMonth} = userDetailsSlice.actions;

export default userDetailsSlice.reducer