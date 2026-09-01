import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import {Container, Content} from '../../Components/NativeBase';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {GetAuth, GetUserId} from '../../Redux/UserDetails';

import CompletedItem from '../../Components/CompletedItem';
import CustomDrawerHeader from '../../Components/CustomDrawerHeader';
import CustomSpacer from '../../Components/CustomSpacer';
import Fonts from '../../Constants/Fonts';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;

const CharterHistory = props => {
  const dispatch = useDispatch();
  const driverId = useSelector(state => state.userReducer.id);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  // useEffect(() => {
  //   fetchcharterhistory();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      fetchcharterhistory();
    }, []),
  );

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

  const fetchcharterhistory = async () => {
    setLoading(true);
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', driverId);

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/get_order_history',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        setLoading(false);
        setHistoryData(res.data.data);
      } else {
        if (res.data.Message == 'deacivated') {
          logout();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      Toast.show('Something went wrong please try again later');
    }
  };

  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

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
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#223F9A'}}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        <CustomDrawerHeader
          title="Charter History"
          action={() => props.navigation.openDrawer()}
          calaction={() => props.navigation.navigate('CalendarScreen')}
          goHome={() => {
            props.navigation.navigate('HomeScreen');
          }}
        />

        {/* MAIN BODY  */}
        <Container style={{paddingHorizontal: 20, paddingBottom: 20, flex: 1}}>
          <Content
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <CustomSpacer />

            {historyData.length == 0 ? (
              <View>
                <Image
                  style={{
                    marginTop: windowHeight / 3.5,
                    height: 220,
                    width: 220,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={require('../../Assets/Images/nothing.png')}
                />
              </View>
            ) : (
              historyData.map((data, index) => {
                return (
                  <View key={index}>
                    <CompletedItem
                                          date={moment.unix(data.utc).fromNow()}

                      job_number={data.job_number}
                      title={`Charter # ${data.charter_order_number}`}
                      startingDate={`${moment(data.departure_date).format(
                        'dddd,MMMM Do YYYY',
                      )}, ${tConvert(data.departure_time.slice(0, 5))}`}
                      closingDate={`${moment(data.return_date).format(
                        'dddd,MMMM Do YYYY',
                      )}, ${tConvert(data.return_time.slice(0, 5))}`}
                      start={data.pickup_points[0].pickup_location.trim()}
                      arrive={data.destination_points[
                        data.destination_points.length - 1
                      ].destination.trim()}
                      name={data.client_name}
                      drivername={data.contact_name}
                      phoneno={data.contact_number}
                      pickups={data.pickup_points.length}
                      pickupPoints={data.pickup_points}
                      reportingTime={data.departure_time}
                      bookingdate={`${moment(data.created_on).format(
                        'dddd,MMMM Do YYYY',
                      )}`}
                      upcoming={data.status == 'upcoming' ? true : false}
                      action="booking"
                      busnumber={data.coach_number}
                      workPerformed={data.work_performed}
                      status={data.status}
                      action={() =>
                        props.navigation.navigate('ViewTravelItineray',{
                          charter_id: data.id,
                        })
                      }
                      jobnumber={data.job_number}
                      charterDetails={() =>
                        props.navigation.navigate('CharterDetails', {
                          charter_id: data.id,
                        })
                      }
                    />
                  </View>
                );
              })
            )}
          </Content>
        </Container>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: Fonts.Poppins_Medium,
  },
});

export default CharterHistory;
