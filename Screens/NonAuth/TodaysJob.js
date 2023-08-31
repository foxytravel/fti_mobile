import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Container, Content } from 'native-base';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { GetAuth, GetUserId } from '../../Redux/UserDetails';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CustomSpacer from '../../Components/CustomSpacer';
import TodaysOrder from '../../Components/TodaysOrder';
import Fonts from '../../Constants/Fonts';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import CustomDrawerHeader from '../../Components/CustomDrawerHeader';

const windowHeight = Dimensions.get('window').height;

const TodaysJob = props => {
  const dispatch = useDispatch();
  const driverId = useSelector(state => state.userReducer.id);
  const [todayJobs, setTodayJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchjobs();
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

  const fetchjobs = async () => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', driverId);
    data.append('current_date', moment(new Date()).format('YYYY-MM-DD'));
    var config = {
      method: 'post',
      url: 'https://fticoachcharters.com/api/driver/today_orders',
      data: data,
    };
    try {
      const res = await axios(config);
      if (res.data.Status) {
        setTodayJobs(res.data.data);
        setLoading(false);
      } else {
        if (res.data.Message == 'deacivated') {
          logout();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      Toast.show('Something Went Wrong Please Try Again Later');
      setLoading(false);
      // setSearchLoading(false);
    }
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        {/* CUSTOM HEADER  */}
        <CustomDrawerHeader
          title="Today's Charter"
          action={() => props.navigation.openDrawer()}
          calaction={() => props.navigation.navigate('CalendarScreen')}
          goHome={() => {
            props.navigation.navigate('HomeScreen');
          }}
        />

        {/* MAIN BODY  */}

        <Container style={{ paddingHorizontal: 20, marginTop: 0, flex: 1 }}>
          <Content>
            <CustomSpacer />
            {todayJobs.length == 0 ? (
              <View>
                <Image
                  style={{
                    marginTop: windowHeight / 3.5,
                    height: hp('30%'),
                    width: hp('30%'),
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={require('../../Assets/Images/nothing.png')}
                />
              </View>
            ) : (
              todayJobs.map((data, index) => {
                console.log(data, 'dddddddqqqqq')
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
                      start={data.pickup_points && data.pickup_points[0] && data.pickup_points[0].pickup_location.trim()}
                      arrive={data.destination_points && data.destination_points[
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
                      is_acknowledged={data.is_acknowledged}
                      action={() => {
                        props.navigation.navigate('InitialDetails', {
                          id: data.id,
                          coach_no: data.coach_number,
                          total_passangers: data.total_passangers

                        });
                      }}
                      charterDetails={() =>
                        props.navigation.navigate('CharterDetails', {
                          charter_id: data.id,
                        })
                      }
                      anotherAction={() => {
                        props.navigation.navigate('InitialDetails', {
                          id: data.id,
                          coach_no: data.coach_number,
                          total_passangers: data.total_passangers

                        })
                      }}
                      anotherActionEnd={() => {
                        props.navigation.navigate('FinalDetails', {
                          id: data.id,
                          coach_no: data.coach_number,
                          total_passangers: data.total_passangers

                        })
                      }}
                      busDetail={() => {
                        props.navigation.navigate('BusInfo', {
                          coachid: data.coach_id,
                        });
                      }}
                      charterid={data.id}
                      charter_id={data.id}
                      status={data.status}
                      trigger={() => fetchjobs()}

                    />
                  </View>
                );
              })
            )}
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
    marginTop: 20,
    fontSize: 18,
    fontFamily: Fonts.Poppins_Medium,
  },
  headerscreen: {
    height: 50,
    width: '100%',
    backgroundColor: '#223F9A',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: 18,
    color: 'white',
  },
});

export default TodaysJob;
