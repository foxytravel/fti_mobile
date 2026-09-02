import React, { useState, useRef, useEffect } from 'react';
import { API_KEY } from '../../Config';
import {
  View,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { GetAuth, GetUserId, setMonth, setYear } from '../../Redux/UserDetails';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../../Constants/Fonts';
import moment from 'moment';
import { API } from '../../API/API';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const CalendarScreen = props => {
  const dispatch = useDispatch();

  let date = new Date();
  const id = useSelector(state => state.userReducer.id);
  const month = useSelector(state => state.userReducer.month)
  const year = useSelector(state => state.userReducer.year)
  const [bookings, setBookings] = useState({});
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEvents();
  }, []);
  useEffect(() => {
    console.log(year, month, 'YeaR')
  }, [year])
  useFocusEffect(
    React.useCallback(() => {
      getEvents()
      return () => getEvents();
    }, [])
  );

  useEffect(() => {
    getEvents();
  }, [month]);
  function enumerateDaysBetweenDates(startDate, endDate) {
    let date = []
    while (moment(startDate) <= moment(endDate)) {
      date.push(startDate);
      startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
    }
    return date;
  }
  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      dispatch(GetUserId(''));
      dispatch(GetAuth(false));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Toast.show('Something Went Wrong Please Try Again Later');
      console.log('error');
    }
  };

  const getEvents = async () => {
    setLoading(true);

    var data = new FormData();
    data.append('API_KEY', API_KEY);
    data.append('driver_id', id);
    data.append('month', month);
    data.append('year', year);

    var config = {
      method: 'post',
      url: `${API}/api/driver/particular_month_orders`,
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        // Toast.show(res.data.Message)
        let bookingsData = res.data.data;
        console.log(bookingsData, 'bookingData')
        var obj = bookings;
        bookingsData.forEach(element => {

          console.log(element.departure_date, element.return_date)
          let dates = []
          if (element.status != 'completed') {
            dates = enumerateDaysBetweenDates(element.departure_date, element.return_date)

          }
          console.log(dates, 'dates')
          for (let index = 0; index < dates.length; index++) {
            const elements = dates[index];
            Object.assign(obj, {
              [elements]: {
                selected: true,
                marked: true,
                selectedColor: 'blue',
                dotColor: 'transparent',
              },
            });
          }
        });
        console.log(obj, '------obj')
        setBookings({ ...obj });
        setLoading(false);
      } else {
        if (res.data.Message == 'deacivated') {
          logout();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error)
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const onDayPress = data => {
    // {"dateString": "2021-05-20", "day": 20, "month": 5, "timestamp": 1621468800000, "year": 2021}
    props.navigation.navigate('BookedDate', {
      date: data.dateString,
      timeStamp: data.timestamp,
    });
    console.log('data =>', data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        <View style={styles.headerscreen}>
          <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
            <Image
              style={{ width: wp('5%'), height: hp('5%'), resizeMode: 'contain' }}
              source={require('../../Assets/Images/drawer.png')}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Calendar</Text>
          <View>
            <TouchableOpacity onPress={() => props.navigation.navigate('HomeScreen')}>
              <Image
                style={{
                  width: wp('5%'),
                  height: hp('5%'),
                  resizeMode: 'contain',
                  marginRight: hp(2),
                }}
                source={require('../../Assets/Images/home.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <Calendar
            markedDates={bookings}
            current={moment(date).format('YYYY-MM-DD')}
            const
            minDate={'1990-12-31'}
            maxDate={'2050-12-31'}
            onDayPress={onDayPress}

            onMonthChange={month => {
              console.log(month, 'month')
              dispatch(setYear(month.year))
              dispatch(setMonth(month.month))
            }}
            firstDay={7}
            onPressArrowLeft={subtractMonth => subtractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            disableAllTouchEventsForDisabledDays={false}
            enableSwipeMonths={true}
          />
        </View>
        {/* {loading && (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator color="white" />
          </View>
        )} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerscreen: {
    height: hp(8),
    width: '100%',
    backgroundColor: '#223F9A',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: hp(2.5),
    color: 'white',
  },
});

export default CalendarScreen;
