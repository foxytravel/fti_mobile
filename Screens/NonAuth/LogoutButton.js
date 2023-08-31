import React, { useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import CustomDrawerItem from '../../Components/CustomDrawerItem'
import { GetAuth, GetUserId } from '../../Redux/UserDetails'
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux'

const LogoutButton = props => {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const logout = async () => {
        setLoading(true)
        try {
            await AsyncStorage.removeItem('user')
            dispatch(GetUserId(''))
            dispatch(GetAuth(false))
            setLoading(false)
            // Toast.show("Logged Out Successfully")
        } catch (e) {
            setLoading(false)
            Toast.show("Something Went Wrong Please Try Again Later")
            console.log("error")
        }
    }



    return (
        <CustomDrawerItem
            action={() => { logout() }}
            title="Logout"
            image={require("../../Assets/Images/logout.png")}
        />
    )
}

export default LogoutButton