import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerStack from './DrawerStack';
import CharterDetails from '../Screens/NonAuth/CharterDetails'
import InitialDetails from '../Screens/NonAuth/InitialDetails'
import FinalDetails from '../Screens/NonAuth/FinalDetails'
import ChangePassword from '../Screens/Auth/ChangePassword';
import ViewTravelItineray from '../Screens/NonAuth/ViewTravelItinerary';
import OtpScreen from '../Screens/Auth/OtpScreen';
import BusInfo from '../Screens/NonAuth/BusInfo';
import BookedDate from '../Screens/NonAuth/BookedDate';
import ViewAttachment from '../Screens/NonAuth/ViewAttachments';
import Details from '../Screens/NonAuth/Details';
import ViewAttach from '../Screens/NonAuth/viewAttach';


const Stack = createStackNavigator();

const HomeStack = props => {


    return (
        <Stack.Navigator
            initialRouteName="DrawerStack"
            headerMode={false}>
            <Stack.Screen name="DrawerStack" component={DrawerStack} />
            <Stack.Screen name="CharterDetails" component={CharterDetails} />
            <Stack.Screen name="InitialDetails" component={InitialDetails} />
            <Stack.Screen name="FinalDetails" component={FinalDetails} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ViewTravelItineray" component={ViewTravelItineray} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="ViewAttach" component={ViewAttach} />


            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="BusInfo" component={BusInfo} />
            <Stack.Screen name="BookedDate" component={BookedDate} />
            <Stack.Screen name="ViewAttachment" component={ViewAttachment} />

        </Stack.Navigator>
    );
}

export default HomeStack;