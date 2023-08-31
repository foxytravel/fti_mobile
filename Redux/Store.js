import { configureStore } from '@reduxjs/toolkit'

import upcomingOrTodaysJobDetailsReducer from './UpcomingOrTodaysJobDetail'
import userReducer from './UserDetails'

export default configureStore({
    reducer: {
        userReducer,
        upcomingOrTodaysJobDetailsReducer
    },
})