import React, {useEffect} from 'react'
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux'
import { View } from 'react-native';

// const dispatch = useDispatch();
const logout = async () => {
    // try {
    //   await AsyncStorage.removeItem('user')
    // } catch(e) {
    //   // remove error
    // }

    console.log('Done.')

}

useEffect(() => {
 logout()
}, [])

const LogOut = props => {
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            {/* {logout()} */}
        </View>
    )
}

export default LogOut