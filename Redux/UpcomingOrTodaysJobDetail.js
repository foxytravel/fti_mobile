import { createSlice } from '@reduxjs/toolkit'

export const upcomingOrTodaysJobDetailsSlice = createSlice({
    name: 'UpcomingOrTodaysJobDetails',
    initialState: {
        TodaysJobCount: 0,
        UpcomingJobCount: 0,
    },
    reducers: {
        GetTodaysJobCount: (state, action) => {
            console.log("TODAYSJOBCOUNT", action.payload)
            state.TodaysJobCount = action.payload
        },
        GetUpcomingJobCount: (state, action) => {
            console.log("UPCOMING JONB COUNT", action.payload) 
            state.UpcomingJobCount = action.payload
        },
    }
})

export const { GetTodaysJobCount, GetUpcomingJobCount } = upcomingOrTodaysJobDetailsSlice.actions;

export default upcomingOrTodaysJobDetailsSlice.reducer