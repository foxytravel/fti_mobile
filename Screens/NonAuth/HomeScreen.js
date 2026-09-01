import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Container, Content } from '../../Components/NativeBase';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomHeader from '../../Components/CustomHeader';
import CustomSpacer from '../../Components/CustomSpacer';
import Fonts from '../../Constants/Fonts';
import UpcomingJobItem from '../../Components/UpcomingJobItem';
import TodaysOrder from '../../Components/TodaysOrder';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { GetAuth, GetUserId } from '../../Redux/UserDetails';

const windowHeight = Dimensions.get('window').height;

const HomeScreen = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const driverId = useSelector(state => state.userReducer.id);
  const [todayJobs, setTodayJobs] = useState([]);
  const [upcomingJobs, setUpcomingJobs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchjobs();
    }, []),
  );

  useEffect(() => {
    getAllMessages();
  }, []);

  const getAllMessages = async () => {
    // await messaging().registerDeviceForRemoteMessages();
    // await messaging().setAutoInitEnabled(true);
    if (Platform.OS == 'android') {
      messaging()
        .getToken()
        .then(res => {
        });

      // This is when your app is in the background but in the memory

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        if (remoteMessage) {
          if (remoteMessage.data.key == 'charter_unassigned') {
            props.navigation.navigate('CharterHistory');
          }
          if (remoteMessage.data.key == 're_acknowledge_charter') {
            props.navigation.navigate('UpcomingJobs');
          }
        }
      });

      // This is on the screen notification handler

      PushNotification.configure({
        onRegister: function (token) {
        },
        onNotification: function (notification) {
          if (notification.message) {
            if (notification.message == 'Acknowledge Charter') {
              props.navigation.navigate('UpcomingJobs');
            }
            if (notification.message == 'Charter Unassigned') {
              props.navigation.navigate('CharterHistory');
            }
          }
          // This works when your app is cleared from the memory
          else {
            if (notification.data.key == 're_acknowledge_charter') {
              props.navigation.navigate('UpcomingJobs');
            }
            if (notification.data.key == 'charter_unassigned') {
              props.navigation.navigate('CharterHistory');
            }
          }
        },

        onAction: function (notification) {
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      });
    } else {
      PushNotificationIOS.requestPermissions();
      messaging()
        .getToken()
        .then(res => {
        });
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            if (remoteMessage.data.key == 'charter_unassigned') {
              props.navigation.navigate('CharterHistory');
            }
            if (remoteMessage.data.key == 're_acknowledge_charter') {
              props.navigation.navigate('UpcomingJobs');
            }
          }
        });
      messaging().onNotificationOpenedApp(notification => {
        // console.log(data);
        if (notification) {
          if (notification.message) {
            if (notification.message == 'Acknowledge Charter') {
              props.navigation.navigate('UpcomingJobs');
            }
            if (notification.message == 'Charter Unassigned') {
              props.navigation.navigate('CharterHistory');
            }
          }
          // This works when your app is cleared from the memory
          else {
            if (notification.data.key == 're_acknowledge_charter') {
              props.navigation.navigate('UpcomingJobs');
            }
            if (notification.data.key == 'charter_unassigned') {
              props.navigation.navigate('CharterHistory');
            }
          }
        }
      });
    }
  };

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
      console.log(e);
    }
  };

  const fetchjobs = async () => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', driverId);
    data.append('date', moment(new Date()).format('YYYY-MM-DD'));

    var config = {
      method: 'post',
      url: 'https://fticoachcharters.com/api/driver/home',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        console.log(res.data.data, 'dataByHome')
        setTodayJobs(res.data.data.today);
        setUpcomingJobs(res.data.data.upcoming);
        setLoading(false);
      } else {
        setTodayJobs([]);
        setUpcomingJobs([]);
        if (res.data.Message == 'deacivated') {
          logout();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      Toast.show('Something Went Wrong Please Try Again Later');
      setLoading(false);
      setTodayJobs([]);
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
  }

  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? 'AM' : 'PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        {/* CUSTOM HEADER  */}
        <CustomHeader
          title="Charter"
          action={() => props.navigation.openDrawer()}
          action1={() => props.navigation.navigate('CalendarScreen')}
        />

        {/* MAIN BODY  */}
        <Container style={{ paddingHorizontal: 20, marginTop: 0, flex: 1 }}>
          <Content
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {todayJobs.length == 0 ? null : (
              <Text style={styles.heading}>Today's Charter</Text>
            )}
            <CustomSpacer />
            {todayJobs.length == 0
              ? null
              : todayJobs.map((data, index) => {
                return (
                  <View
                    style={{
                      marginBottom: hp('2%'),
                    }}
                    key={index}>
                    <TodaysOrder
                      updated_fields={data.updated_fields}
                      no_of_bus={data.no_of_bus}
                      client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                      return_time={moment(data.return_time, ["HH:mm:ss"]).format("hh:mm A")}
                      office_reporting_time={moment(data.office_reporting_time, ["HH:mm:ss"]).format("hh:mm A")}
                      job_number={data.job_number}
                      date={data.updated_on_utc?moment.unix(data.updated_on_utc).fromNow():moment.unix(data.utc).fromNow()}
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
                      name={data.carrier}
                      c_name={data.client_name}
                      pickups={data.pickup_points.length}
                      reportingTime={data.depart_foxy}
                      drivername={data.contact_name}
                      phoneno={data.contact_number}
                      workPerformed={data.work_performed}
                      busnumber={data.coach_number}
                      action={() => {
                        props.navigation.navigate('InitialDetails', {
                          id: data.id,
                          coach_no: data.coach_number

                        });
                      }}

                      charterDetails={() =>
                        props.navigation.navigate('CharterDetails', {
                          charter_id: data.id,
                        })
                      }
                      charterid={data.id}
                      charter_id={data.id}


                      busDetail={() => {
                        props.navigation.navigate('BusInfo', {
                          coachid: data.coach_id,
                        });
                      }}
                      is_acknowledged={data.is_acknowledged}

                      status={data.status}
                      trigger={() => fetchjobs()}
                      anotherAction={() => {
                        props.navigation.navigate('InitialDetails', {
                          id: data.id,
                          coach_no: data.coach_number,
                          total_passangers: data.total_passangers

                        });
                      }}
                      anotherActionEnd={() => {
                        props.navigation.navigate('FinalDetails', {
                          id: data.id,
                          coach_no: data.coach_number,
                          total_passangers: data.total_passangers
                        })
                      }}
                    />
                  </View>
                );
              })}

            <CustomSpacer />

            {upcomingJobs.length == 0 ? null : (
              <Text style={styles.heading}>Upcoming Charter</Text>
            )}

            <CustomSpacer />

            {upcomingJobs.length == 0
              ? null
              : upcomingJobs.map((data, index) => {
                return (
                  <View
                    style={{
                      marginBottom: hp('2%'),
                    }}
                    key={index}>
                    <UpcomingJobItem
                      updated_fields={data.updated_fields}
                      no_of_bus={data.no_of_bus}
                      client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                      job_number={data.job_number}
                      return_time={moment(data.return_time, ["HH:mm:ss"]).format("hh:mm A")}
                      office_reporting_time={moment(data.office_reporting_time, ["HH:mm:ss"]).format("hh:mm A")}
                      job_number={data.job_number}
                      carterdetails={() => {
                        props.navigation.navigate('CharterDetails', {
                          charter_id: data.id,
                        });
                      }}
                      date={data.updated_on_utc?moment.unix(data.updated_on_utc).fromNow():moment.unix(data.utc).fromNow()}

                      title={`Charter # ${data.charter_order_number}`}
                      startingDate={`${moment(
                        data.pickup_points[0].departure_date,
                      ).format('dddd,MMMM Do YYYY')}, ${tConvert(
                        data.pickup_points[0].departure_time.slice(0, 5),
                      )}`}
                      c_name={data.client_name}


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
                      reportingTime={tConvert(
                        data.client_report_time.slice(0, 5),
                      )}
                      appoxtime={tConvert(data.return_time.slice(0, 5))}
                      bookingdate={`${moment(data.created_on).format(
                        'dddd,MMMM Do YYYY',
                      )}`}
                      upcoming={data.status == 'upcoming' ? true : false}
                      action="booking"
                      busnumber={data.coach_number}
                      workPerformed={data.work_performed}
                      action1={() =>
                        data.navigation.navigate('ViewTravelItineray', {
                          charter_id: data.id,
                        })
                      }
                      busDetail={() => {
                        props.navigation.navigate('BusInfo', {
                          coachid: data.coach_id,
                        });
                      }}
                      charterDetails={() =>
                        props.navigation.navigate('CharterDetails', {
                          charter_id: data.id,
                        })
                      }
                      charterid={data.id}
                      jobnumber={data.job_number}
                      noofbuses={data.no_of_bus}
                      is_acknowledged={data.is_acknowledged}
                    />
                  </View>
                );
              })}

            {upcomingJobs.length == 0 && todayJobs.length == 0 ? (
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
            ) : null}

            <CustomSpacer />
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
    marginTop: hp('2%'),
    fontSize: hp(2.5),
    fontFamily: Fonts.Poppins_Medium,
  },
  noexisted: {
    fontFamily: Fonts.Poppins_Light,
  },
});

export default HomeScreen;
