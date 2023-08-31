import { Container, Content } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Fonts from '../../Constants/Fonts';
import { API } from '../../API/API';
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { GetAuth, GetUserId } from '../../Redux/UserDetails';
import TodaysOrder from '../../Components/TodaysOrder';
import CustomSpacer from '../../Components/CustomSpacer';
import UpcomingJobItem from '../../Components/UpcomingJobItem';
import CustomHeaderType from '../../Components/CustomHeaderType';
import CompletedItem from '../../Components/CompletedItem';
import { useFocusEffect } from '@react-navigation/native';

const BookedDate = props => {
  const { date, timeStamp } = props.route.params;
  const id = useSelector(state => state.userReducer.id);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   getBookings();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      getBookings();
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

  const getBookings = async () => {
    console.log('DATE', date);
    setLoading(true);

    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', id);
    data.append('date', date);

    var config = {
      method: 'post',
      url: `${API}/api/driver/particular_date_orders`,
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        let bookingsData = res.data.data;
        console.log('bookingsData =>>', bookingsData);
        setBookings([...bookingsData]);
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
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        {/* CUSTOM HEADER  */}
        <CustomHeaderType
          title={moment(date).format('dddd,MMMM Do YYYY')} //  "April 16, 2021"
          calaction={() => props.navigation.navigate('CalendarScreen')}
          action={() => props.navigation.goBack()}
        />

        {/* MAIN BODY  */}
        <Container style={{ paddingHorizontal: 20, marginTop: 0, flex: 1 }}>
          <Content>
            <CustomSpacer />
            {bookings.map((data, index) => {
              // alert(data.status)
              if (data.status == 'ongoing' || data.status == "leave_for_office" || data.status == "leave_from_office" || data.status == "start_trip" || data.status == "acknowledged") {
                return (
                  <TodaysOrder

                    updated_fields={data.updated_fields}
                    no_of_bus={data.no_of_bus}
                    client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                    job_number={data.job_number}
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
                )
              }
              else if (data.status == 'upcoming') {
                return (
                  <View key={index}>
                    <UpcomingJobItem
                      c_name={data.client_name}
                      job_number={data.job_number}
                      updated_fields={data.updated_fields}
                      no_of_bus={data.no_of_bus}
                      client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                      job_number={data.job_number}
                      return_time={moment(data.return_time, ["HH:mm:ss"]).format("hh:mm A")}
                      office_reporting_time={moment(data.office_reporting_time, ["HH:mm:ss"]).format("hh:mm A")}
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

                    <CustomSpacer key={index + 1} />
                  </View>
                );
              } else {
                return (
                  <View key={index}>
                    <CompletedItem
                      updated_fields={data.updated_fields}
                      no_of_bus={data.no_of_bus}
                      client_depart_time={moment(data.client_report_time, ["HH:mm:ss"]).format("hh:mm A")}
                      job_number={data.job_number}
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
                      name={data.client_name}
                      drivername={data.contact_name}
                      phoneno={data.contact_number}
                      pickups={data.pickup_points.length}
                      pickupPoints={data.pickup_points}
                      reportingTime={tConvert(
                        data.client_report_time.slice(0, 5),
                      )}
                      bookingdate={`${moment(data.created_on).format(
                        'dddd,MMMM Do YYYY',
                      )}`}
                      upcoming={data.status == 'upcoming' ? true : false}
                      action="booking"
                      busnumber={data.coach_number}
                      workPerformed={data.work_performed}
                      status={data.status}
                      action={() =>
                        props.navigation.navigate('ViewTravelItineray')
                      }
                      jobnumber={data.job_number}
                    />
                    <CustomSpacer key={index + 1} />
                  </View>
                );
              }
            })}
          </Content>
        </Container>
        {loading && (
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
        )}
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

export default BookedDate;
