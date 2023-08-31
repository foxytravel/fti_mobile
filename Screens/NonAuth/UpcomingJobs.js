import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Image,
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

import CustomDrawerHeader from '../../Components/CustomDrawerHeader';
import CustomSpacer from '../../Components/CustomSpacer';
import UpcomingJobItem from '../../Components/UpcomingJobItem';
import Fonts from '../../Constants/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;

const UpcomingJobs = props => {
  const dispatch = useDispatch();
  const driverId = useSelector(state => state.userReducer.id);
  const [loading, setLoading] = useState(true);
  const [upcomingJobs, setUpcomingJobs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchUpcomingJobs();
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

  const fetchUpcomingJobs = async () => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', driverId);
    data.append('current_date', moment(new Date()).format('YYYY-MM-DD'));

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/upcoming_orders',
      data: data,
    };

    try {
      setLoading(true)
      const res = await axios(config);
      if (res.data.Status) {
        console.log('upcoming', res.data)
        setUpcomingJobs(res.data.data);
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
      setLoading(false);
      Toast.show('Something went wrong Please try again');
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
          title="Upcoming Charter"
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

            {upcomingJobs.length == 0 ? (
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
              upcomingJobs
                .map((data, index) => {
                  return (
                    <View
                      style={{
                        marginBottom: hp('2%'),
                      }}
                      key={index}>
                      <UpcomingJobItem
                      c_name={data.client_name}

                        carterdetails={() => {
                          props.navigation.navigate('CharterDetails', {
                            charter_id: data.id,
                          });
                        }}
                        updated_fields={data.updated_fields}
                        no_of_bus={data.no_of_bus}
                        client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                        job_number={data.job_number}
                        return_time={moment(data.return_time, ["HH:mm:ss"]).format("hh:mm A")}
                        office_reporting_time={moment(data.office_reporting_time, ["HH:mm:ss"]).format("hh:mm A")}
                        updated_fields={data.updated_fields}
                        no_of_bus={data.no_of_bus}
                        client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                        job_number={data.job_number}
                        return_time={moment(data.return_time, ["HH:mm:ss"]).format("hh:mm A")}
                        office_reporting_time={moment(data.office_reporting_time, ["HH:mm:ss"]).format("hh:mm A")}
                        date={data.updated_on_utc?moment.unix(data.updated_on_utc).fromNow():moment.unix(data.utc).fromNow()}
                        title={`Charter # ${data.charter_order_number}`}
                        startingDate={`${moment(
                          data.pickup_points[0].departure_date,
                        ).format('dddd,MMMM Do YYYY')}, ${tConvert(
                          data.pickup_points[0].departure_time.slice(0, 5),
                        )}`}
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
                        fetchUpcomingJobs={() => {
                          fetchUpcomingJobs();
                        }}
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
});

export default UpcomingJobs;
