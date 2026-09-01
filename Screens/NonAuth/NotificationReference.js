import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  TouchableNativeFeedback,
} from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { GetAuth, GetUserId } from '../../Redux/UserDetails';

import UpcomingJobItem from '../../Components/UpcomingJobItem';
import TodaysOrder from '../../Components/TodaysOrder';
import CustomDrawerHeader from '../../Components/CustomDrawerHeader';
import Fonts from '../../Constants/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import { Container, Content } from '../../Components/NativeBase';

const windowHeight = Dimensions.get('window').height;

const NotificationReference = props => {
  const id = props.route.params.id;
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getAllNotifications();
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

  const driverId = useSelector(state => state.userReducer.id);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const getAllNotifications = async () => {
    console.log('ID', id);

    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', driverId);
    data.append('charter_id', id);
    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/get_charter_detail',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        console.log('RED', res.data.data);
        if (res.data.Status) {
          setJobs([...res.data.data]);
          setLoading(false);
        }
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
      Toast.show('Something went wrong please try again later');
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
      <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

      <CustomDrawerHeader
        number={5}
        width={15}
        height={15}
        title="Updated Details"
        action={() => props.navigation.openDrawer()}
        goHome={() => {
          props.navigation.navigate('HomeScreen');
        }}
        calaction={() => props.navigation.navigate('CalendarScreen')}
      />
      <Container>
        <Content>
          <View style={styles.screen}>
            {/* STATUS BAR  */}

            {jobs.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  padding: 20,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Poppins_Medium,
                  }}>
                  Nothing To Show!
                </Text>
              </View>
            ) : (
              jobs.map((data, index) => {
                console.log(data)
                if (data.status == 'upcoming') {
                  return (
                    <View style={{ padding: 20 }}>
                      <UpcomingJobItem
                        updated_fields={data.updated_fields}
                        no_of_bus={data.no_of_bus}
                        client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                        job_number={data.job_number}
                        return_time={moment(data.return_time, ["HH:mm:ss"]).format("hh:mm A")}
                        office_reporting_time={moment(data.office_reporting_time, ["HH:mm:ss"]).format("hh:mm A")}
                        data={data}
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
                        name={data.carrier}
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
                } else {

                  <View
                    style={{
                      padding: 20,
                    }}>
                    <TodaysOrder
                      data={data}
                      updated_fields={data.updated_fields}
                      no_of_bus={data.no_of_bus}
                      client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                      return_time={moment(data.return_time, ["HH:mm:ss"]).format("hh:mm A")}
                      office_reporting_time={moment(data.office_reporting_time, ["HH:mm:ss"]).format("hh:mm A")}
                      job_number={data.job_number}
                      date={data.updated_on_utc?moment.unix(data.updated_on_utc).fromNow():moment.unix(data.utc).fromNow()}

                      c_name={data.client_name}

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
                      busnumber="003"
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
                      busDetail={() => {
                        props.navigation.navigate('BusInfo', {
                          coachid: data.coach_id,
                        });
                      }}
                      charter_id={data.id}
                      charterid={data.id}

                      status={data.status}
                      trigger={() => fetchjobs()}
                      anotherAction={() => {
                        props.navigation.navigate('InitialDetails', {
                          id: data.id,
                          coach_no: data.coach_number,
                          total_passangers: data.total_passangers

                        });
                      }}
                    />
                    ;
                  </View>;
                }
              })
            )}

            <View style={{ height: 20 }}></View>

            {/* MAIN BODY  */}
          </View>
        </Content>
      </Container>
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

export default NotificationReference;
