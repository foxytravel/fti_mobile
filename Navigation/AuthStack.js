import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../Screens/Auth/SignInScreen';
import SignUpScreen from '../Screens/Auth/SignUpScreen';
import WelcomeScreen from '../Screens/Auth/WelcomeScreen';
import ForgotPassword from '../Screens/Auth/ForgotPasswordScreen'
import NewPasswordScreen from '../Screens/Auth/NewPasswordScreen'
import OtpScreen from '../Screens/Auth/OtpScreen';


const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="WelcomeScreen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />

        </Stack.Navigator>
    );
}

export default AuthStack;