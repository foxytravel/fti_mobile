import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  Platform,
} from 'react-native';
import { Container, Content } from '../../Components/NativeBase';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { GetAuth, GetUserId } from '../../Redux/UserDetails';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../../Constants/Fonts';
import CustomDrawerHeaderBack from '../../Components/CustomDrawerHeaderBack';
import { StackActions } from '@react-navigation/native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import CustomViewItem from '../../Components/CustomViewItem';

const CharterDetails = props => {
  const dispatch = useDispatch();
  const charter_id = props.route.params.charter_id;
  const driverId = useSelector(state => state.userReducer.id);

  console.log(charter_id, driverId);

  useFocusEffect(
    useCallback(() => {
      fetchCharterDetail();
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

  const fetchCharterDetail = async () => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', driverId);
    data.append('charter_id', charter_id);

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/get_charter_detail',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        console.log(res.data.data[0], 'clientdetails')
        setMainData(res.data.data[0]);
        setLoading(false);
      } else {
        if (res.data.Message == 'deacivated') {
          logout();
        } else {
          setLoading(false);
          setMainData({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      Toast.show('Something thing went wrong please try later');
    }
  };

  const [pickupPoints, setPickupPoints] = useState([]);
  const [nav, setNav] = useState(true);
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(true);

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
  const _openMap = (fullAddress) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${fullAddress}`,
      android: `google.navigation:q=${fullAddress}`,
    })

    Linking.openURL(url)
  }
  const checkLabel = index => {
    if (index == 0) {
      return 'First Pickup';
    } else if (index == 1) {
      return 'Second Pickup';
    } else if (index == 2) {
      return 'Third Pickup';
    } else if (index == 3) {
      return 'Fourth Pickup';
    } else if (index == 4) {
      return 'Fifth Pickup';
    } else if (index == 5) {
      return 'Sixth Pickup';
    } else if (index == 6) {
      return 'Seventh Pickup';
    } else if (index == 7) {
      return 'Eighth Pickup';
    } else if (index == 8) {
      return 'Nineth Pickup';
    } else if (index == 9) {
      return '10th Pickup';
    }
  };

  const checkDestination = index => {
    if (index == 0) {
      return 'First Destination';
    } else if (index == 1) {
      return 'Second Destination';
    } else if (index == 2) {
      return 'Third Destination';
    } else if (index == 3) {
      return 'Fourth Destination';
    } else if (index == 4) {
      return 'Fifth Destination';
    } else if (index == 5) {
      return 'Sixth Destination';
    } else if (index == 6) {
      return 'Seventh Destination';
    } else if (index == 7) {
      return 'Eighth Destination';
    } else if (index == 8) {
      return 'Nineth Destination';
    } else if (index == 9) {
      return '10th Destination';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        <CustomDrawerHeaderBack
          title="Charter Details"
          action={() => props.navigation.goBack()}
          calaction={() => props.navigation.navigate('CalendarScreen')}
          goHome={() => {
            props.navigation.dispatch(StackActions.popToTop());
          }}
        />

        {mainData.client_detail.client_name ? (
          <Container style={{ flex: 1 }}>
            <Content
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                  marginBottom: hp('1%'),
                }}>
                <View
                  style={{
                    width: '15%',
                    height: 1,
                    backgroundColor: '#E9EFF7',
                  }}></View>
                <Text
                  style={{
                    fontFamily: Fonts.Poppins_SemiBold,
                    fontSize: hp(2.5),
                    marginHorizontal: 10,
                    maxWidth: '70%',
                  }}>
                  Customer Detail
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: 2,
                    backgroundColor: '#E9EFF7',
                  }}></View>
              </View>

              <View style={{ padding: 20 }}>
                <View>
                  <CustomViewItem
                    color="#223F9A"
                    label="Chartering Party Name"
                    value={
                      mainData.client_detail.client_name
                        ? mainData.client_detail.client_name
                        : ''
                    }
                    backgroundColor={mainData?.updated_fields?.includes("client_name") ? '#f9fe04' : 'transparent'}
                  />
                </View>

                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label="Customer Name"
                    value={mainData.contact_name}
                    backgroundColor={mainData?.updated_fields?.includes("contact_name") ? '#f9fe04' : 'transparent'}
                  />
                </View>

                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label="Contact Number"
                    value={mainData.contact_number}
                    backgroundColor={mainData?.updated_fields?.includes("contact_number") ? '#f9fe04' : 'transparent'}

                  />
                </View>

                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label="Alternative Contact Name"
                    value={mainData.alt_contact_name}
                    backgroundColor={mainData?.updated_fields?.includes("alt_contact_name") ? '#f9fe04' : 'transparent'}

                  />
                </View>

                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label="Alternative Contact Number"
                    value={mainData.alt_contact_number}
                    backgroundColor={mainData?.updated_fields?.includes("alt_contact_number") ? '#f9fe04' : 'transparent'}


                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    width: '15%',
                    height: 2,
                    backgroundColor: '#E9EFF7',
                  }}></View>
                <Text
                  style={{
                    fontFamily: Fonts.Poppins_SemiBold,
                    fontSize: hp(2.5),
                    marginHorizontal: 10,
                    maxWidth: '70%',
                  }}>
                  Trip Details
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E9EFF7',
                  }}></View>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ marginTop: 10 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label="Gratuity"
                    value={`$ ${mainData.gratuity ? mainData.gratuity : 1}`}
                    backgroundColor={mainData?.updated_fields?.includes("gratuity") ? '#f9fe04' : 'transparent'}

                  />
                </View>

                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label="Office Reporting Time"
                    value={tConvert(mainData.office_reporting_time.slice(0, 5))}
                    backgroundColor={mainData?.updated_fields?.includes("office_reporting_time") ? '#f9fe04' : 'transparent'}

                  />
                </View>
                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label="Passenger Count"
                    value={mainData.total_passangers}
                    backgroundColor={mainData?.updated_fields?.includes("total_passangers") ? '#f9fe04' : 'transparent'}

                  />
                </View>
                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label={`Departure Date & Time`}
                    value={`${moment(mainData.departure_date).format(
                      'dddd,MMMM Do YYYY',
                    )}, ${tConvert(mainData.departure_time.slice(0, 5))}`}
                    backgroundColor={mainData?.updated_fields?.includes("departure_date") || mainData?.updated_fields?.includes("departure_time") ? '#f9fe04' : 'transparent'}
                  />
                </View>

                <View style={{ marginTop: 30 }}>
                  <CustomViewItem
                    color="#223F9A"
                    label={`Return Date & Time`}
                    value={`${moment(mainData.return_date).format(
                      'dddd,MMMM Do YYYY',
                    )}, ${tConvert(mainData.return_time.slice(0, 5))}`}
                    backgroundColor={mainData?.updated_fields?.includes("return_date") ? '#f9fe04' : 'transparent'}

                  />
                </View>

                {mainData.pickup_points.length != 0
                  ? mainData.pickup_points.map((data, index) => {
                    return (
                      <View key={index}>
                        <View style={styles.container}>
                          <Text
                            style={{
                              fontFamily: Fonts.Poppins_Regular,
                              fontSize: hp(2),
                            }}>
                            {checkLabel(index)}
                          </Text>
                          {index == 0 ? (
                            <Text style={styles.spotTimeText}>
                              Spot time:{' '}
                              <Text style={{ color: '#223F9A', backgroundColor: mainData?.updated_fields?.includes("client_report_time") ? '#f9fe04' : 'transparent' }}>
                                {tConvert(
                                  mainData.client_report_time.slice(0, 5),
                                )}
                              </Text>
                            </Text>
                          ) : null}
                        </View>

                        <Text
                          style={{
                            marginTop: hp('4%'),
                            fontSize: hp(2),
                            fontFamily: Fonts.Poppins_Regular,
                            width: '100%',
                          }}>
                          Departure:{' '}
                          <Text onPress={() => { _openMap(data.pickup_location) }} style={{ color: '#223F9A', backgroundColor: mainData?.updated_fields?.includes("pickup_points") ? '#f9fe04' : 'transparent' }}>
                            {data.pickup_location}
                          </Text>
                        </Text>

                        <View style={{ marginTop: 30 }}>
                          <CustomViewItem
                            color="#223F9A"
                            label={`Departure Date & Time`}
                            value={`${moment(data.departure_date).format(
                              'dddd,MMMM Do YYYY',
                            )}, ${tConvert(data.departure_time.slice(0, 5))}`}
                            backgroundColor={mainData?.updated_fields?.includes("pickup_points") ? '#f9fe04' : 'transparent'}

                          />
                        </View>
                      </View>
                    );
                  })
                  : null}

                {mainData.destination_points.length != 0
                  ? mainData.destination_points.map((data, index) => {
                    return (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: hp('4%'),
                          }}>
                          <Text
                            style={{
                              fontFamily: Fonts.Poppins_Regular,
                              fontSize: hp(2),
                            }}>
                            {checkDestination(index)}
                          </Text>
                        </View>
                        <Text
                          style={{
                            marginTop: hp('4%'),
                            fontSize: hp(2),
                            fontFamily: Fonts.Poppins_Regular,
                            width: '100%',
                          }}>
                          Destination:{' '}
                          <Text onPress={() => { _openMap(data.destination) }} style={{ color: '#223F9A', backgroundColor: mainData?.updated_fields?.includes("destination_points") ? '#f9fe04' : 'transparent' }}>
                            {data.destination}
                          </Text>
                        </Text>
                        <View style={styles.divider}></View>
                      </View>
                    );
                  })
                  : null}

                <Text
                  style={{
                    fontFamily: Fonts.Poppins_Regular,
                    fontSize: hp(2),
                    color: '#797979',
                    marginTop: hp('4%'),
                  }}>
                  Other Note
                </Text>

                <Text
                  style={{
                    fontSize: hp(1.7),
                    fontFamily: Fonts.Poppins_Regular,
                    color: '#223F9A',
                    width: '100%',
                    marginTop: hp('2.5%'),
                    backgroundColor: mainData?.updated_fields?.includes("note") ? '#f9fe04' : 'transparent'

                  }}>
                  {mainData.note}
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: 'grey',
                    opacity: 0.5,
                    marginTop: hp('4%'),
                  }}></View>

                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('ViewAttachment', { charter_id });
                  }}
                  style={{
                    borderColor: '#223F9A',
                    borderWidth: 1,
                    borderRadius: 6,
                    marginTop: 40,
                    height: hp('8%'),
                    borderStyle: 'dashed',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Poppins_SemiBold,
                      fontSize: hp(2),
                      color: '#223F9A',
                    }}>
                    View Attachments
                  </Text>
                </TouchableOpacity>
              </View>
            </Content>
          </Container>
        ) : (
          <Text>nothing</Text>
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  spotTimeText: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: hp(2),
  },
  divider: {
    backgroundColor: '#E9EFF7',
    height: 1,
    width: '100%',
    marginTop: 7,
  },
});

export default CharterDetails;
