import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../Screens/NonAuth/HomeScreen';
import DrawerContent from '../Screens/NonAuth/DrawerContent';
import {ActivityIndicator, View} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useDispatch, useSelector} from 'react-redux';
import {API} from '../API/API';
import {GetUser} from '../Redux/UserDetails';
import {
  GetTodaysJobCount,
  GetUpcomingJobCount,
} from '../Redux/UpcomingOrTodaysJobDetail';
import TodaysJob from '../Screens/NonAuth/TodaysJob';
import UpcomingJobs from '../Screens/NonAuth/UpcomingJobs';
import CharterHistory from '../Screens/NonAuth/CharterHistory';
import NotificationScreen from '../Screens/NonAuth/NotificationScreen';
import ChangePassword from '../Screens/Auth/ChangePassword';
import CalendarScreen from '../Screens/NonAuth/Calendar';
import ProfileScreen from '../Screens/NonAuth/ProfileScreen';
import NotificationReference from '../Screens/NonAuth/NotificationReference';
import Details from '../Screens/NonAuth/Details';

const Drawer = createDrawerNavigator();

const DrawerStack = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const id = useSelector(state => state.userReducer.id);
  const user = useSelector(state => state.userReducer.user);
  const todayjobcount = useSelector(
    state => state.upcomingOrTodaysJobDetailsReducer.TodaysJobCount,
  );
  const upcomingjobCount = useSelector(
    state => state.upcomingOrTodaysJobDetailsReducer.UpcomingJobCount,
  );

  useEffect(() => {
    if (id) {
      console.log('EEEE');
      fetchDriverProfile();
    }
  }, [id]);

  const fetchDriverProfile = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', id);

    var config = {
      method: 'post',
      url: `${API}/api/driver/get_profile`,
      data: data,
    };

    try {
      const res = await axios(config);
      console.log(res.data);
      if (res.data) {
        dispatch(GetUser(res.data));
        fetchjobs();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const fetchjobs = async () => {
    console.log('Fetch Job');
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', id);
    data.append('date', '2021-05-18');

    var config = {
      method: 'post',
      url: 'https://fticoachcharters.com/api/driver/home',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        dispatch(GetTodaysJobCount(res.data.data.today.length));
        dispatch(GetUpcomingJobCount(res.data.data.upcoming.length));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      Toast.show('Something Went Wrong Please Try Again Later');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#223F9A" />
      </View>
    );
  } else {
    return (
      <Drawer.Navigator
        drawerStyle={{
          width: wp('70%'),
        }}
        drawerContent={DrawerContent}
        initialRouteName="HomeScreen">
        <Drawer.Screen
          name="HomeScreen"
          component={HomeScreen}
          action={() => props.navigation.openDrawer()}
        />
        <Drawer.Screen name="TodaysJob" component={TodaysJob} />
        <Drawer.Screen name="UpcomingJobs" component={UpcomingJobs} />
        <Drawer.Screen name="CharterHistory" component={CharterHistory} />
        <Drawer.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
         <Drawer.Screen
          name="Details"
          component={Details}
        />

        <Drawer.Screen name="ChangePassword" component={ChangePassword} />
        <Drawer.Screen name="CalendarScreen" component={CalendarScreen} />
        <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
        <Drawer.Screen
          name="NotificationReference"
          component={NotificationReference}
        />
      </Drawer.Navigator>
    );
  }
};

export default DrawerStack;
