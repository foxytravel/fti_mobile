import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import HomeStack from './HomeStack';
import AuthStack from './AuthStack';
import {GetAuth, GetUserId} from '../Redux/UserDetails';

const Stack = createStackNavigator();

const MainStack = () => {
//   const dispatch = useDispatch();
  const auth = useSelector(state => state.userReducer.auth);

  const [loading, setLoading] = useState(false);

//   const getUser = async () => {
//     console.log('WORKING');
//     try {
//       setLoading(true);
//       const value = await AsyncStorage.getItem('user');

//       if (value != null) {
//         const result = JSON.parse(value);
//         console.log(result, 'rsultttt');
//         dispatch(GetAuth(true));
//         dispatch(GetUserId(result.id));
//         setLoading(false);
//       } else {
//         dispatch(GetAuth(false));
//         setLoading(false);
//       }
//     } catch (e) {
//       setLoading(false);
//       Toast.show('Something went wrong please try after sometime');
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, []);

//   if (loading) {
//     return (
//       <View
//         style={{
//           backgroundColor: 'white',
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <ActivityIndicator size="large" color="#223F9A" />
//       </View>
//     );
//   }

  return (
    <Stack.Navigator headerMode={false}>
      {auth ? (
        <Stack.Screen name="HomeStack" component={HomeStack} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
