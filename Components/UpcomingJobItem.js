import React, { useState } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, Platform, Linking } from 'react-native';
import { Card, View } from 'native-base';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { GetAuth, GetUserId } from '../Redux/UserDetails';
import Fonts from '../Constants/Fonts';

const UpcomingJobItem = props => {
  // console.log('props====>upcomingJob',props?.updated_fields?.includes('k'))`
  const dispatch = useDispatch();
  const driverId = useSelector(state => state.userReducer.id);
  const [mode, setMode] = useState(props.is_acknowledged);

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
  const _openMap = (fullAddress) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${fullAddress}`,
      android: `google.navigation:q=${fullAddress}`,
    })

    Linking.openURL(url)
  }
  const acknowledge = async (id, charterid) => {
    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', id);
    data.append('charter_id', charterid);

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/acknowledge_order',
      data: data,
    };

    try {
      const res = await axios(config);
      console.log(res.data);
      if (res.data.Status) {
        setMode(1);
        // props.fetchUpcomingJobs()
      } else {
        if (res.data.Message == 'deacivated') {
          logout();
        } else {
          Toast.show('Failed to Acknowledge');
        }
      }
    } catch (error) {
      console.log(error);
      Toast.show('Something went wrong please try again later');
    }
  };

  return (
    <Card style={styles.screen}>
      <View style={styles.topContanier}>
        {props.job_number == 'undefined' ? (
          <View></View>
        ) : (
          <Text
            style={{
              alignSelf: 'flex-start',
              fontFamily: Fonts.Poppins_Light,
              fontSize: hp(1.7),
              color: '#212121',
            }}>
            Job #{' '}
            <Text
              style={{ fontFamily: Fonts.Poppins_SemiBold, color: '#223F9A' }}>
              {props.job_number}
            </Text>
          </Text>
        )}
        <View style={styles.dateContanier}>
          <Image
            style={styles.calImage}
            source={require('../Assets/Images/clock.png')}
          />
          <Text style={styles.date}>{props.date}</Text>
        </View>
      </View>

      <Text style={styles.title}>{props.title}</Text>

      <View
        style={{
          padding: hp(1),
          flexDirection: 'row',
        }}>
        <Image
          style={{
            width: hp('2.5%'),
            height: hp('2.5%'),
            resizeMode: 'contain',
          }}
          source={require('../Assets/Images/downblue.png')}
        />
        <View>
          <Text onPress={() => _openMap(props.start)} style={styles.start}>{props.start}</Text>
          <Text style={[styles.startingDate, { marginTop: hp('1%') }]}>
            {props.startingDate}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginBottom: hp('2%'),
          height: hp('5%'),
          paddingHorizontal: 10,
          justifyContent: 'space-between',
        }}>
        <Image
          style={{ width: hp('1%'), height: hp('0.5%'), resizeMode: 'contain' }}
          source={require('../Assets/Images/dot.png')}
        />
        <Image
          style={{ width: hp('1%'), height: hp('0.5%'), resizeMode: 'contain' }}
          source={require('../Assets/Images/dot.png')}
        />
        <Image
          style={{ width: hp('1%'), height: hp('0.5%'), resizeMode: 'contain' }}
          source={require('../Assets/Images/dot.png')}
        />
      </View>

      <View
        style={{
          padding: hp(1),
          flexDirection: 'row',
        }}>
        <Image
          style={{
            width: hp('2.5%'),
            height: hp('2.5%'),
            resizeMode: 'contain',
          }}
          source={require('../Assets/Images/downorange.png')}
        />

        <View>
          <Text onPress={() => _openMap(props.arrive)} style={styles.start}>{props.arrive}</Text>
          <Text style={[styles.startingDate, { marginTop: hp('1%') }]}>
            {props.closingDate}
          </Text>
        </View>
      </View>

      {/* <View
        style={{
          marginVertical: hp('3%'),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            height: hp('15%'),
          }}>
          <Image
            style={{
              width: hp('2.5%'),
              height: hp('2.5%'),
              resizeMode: 'contain',
            }}
            source={require('../Assets/Images/downblue.png')}
          />
          <Image
            style={{width: hp('1%'), height: hp('0.5%'), resizeMode: 'contain'}}
            source={require('../Assets/Images/dot.png')}
          />
          <Image
            style={{width: hp('1%'), height: hp('0.5%'), resizeMode: 'contain'}}
            source={require('../Assets/Images/dot.png')}
          />
          <Image
            style={{width: hp('1%'), height: hp('0.5%'), resizeMode: 'contain'}}
            source={require('../Assets/Images/dot.png')}
          />
          <Image
            style={{
              width: hp('2.5%'),
              height: hp('2.5%'),
              resizeMode: 'contain',
            }}
            source={require('../Assets/Images/downorange.png')}
          />
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            height: hp('15%'),
            width: '90%',
          }}>
          <View style={{width: '100%'}}>
            <Text style={styles.start} numberOfLines={1}>
              {props.start}
            </Text>
            <Text style={styles.startingDate}>{props.startingDate}</Text>
          </View>
          <View style={{width: '100%'}}>
            <Text style={styles.start} numberOfLines={1}>
              {props.arrive}
            </Text>
          </View>
        </View>
      </View> */}

      {/* DIVIDER  */}

      <View
        style={{
          backgroundColor: '#00000080',
          height: 1,
          width: '100%',
          alignSelf: 'center',
          marginVertical: 20,
        }}></View>

      <Text style={styles.name}>
        Chartering Party Name:{' '}
        <Text style={{ color: '#223F9A' }}>{props.c_name}</Text>
      </Text>

      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 50
        }}>
        <View
          style={{
            width: wp('35%'),
            height: hp('27%'),
            justifyContent: 'space-between',
            // alignItems: 'center',
          }}>
          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>{props.drivername}</Text>
            <Text style={[styles.value(props?.updated_fields?.includes("contact_number") ? '#f9fe04' : 'transparent')]}>{props.phoneno}</Text>
          </View>
          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>Office Reporting Time</Text>
            <Text style={[styles.value(props?.updated_fields?.includes("office_reporting_time") ? '#f9fe04' : 'transparent')]}>{props.office_reporting_time}</Text>
          </View>

          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>Work Performed</Text>
            <Text style={[styles.value(props?.updated_fields?.includes("work_performed") ? '#f9fe04' : 'transparent')]}>{props.workPerformed}</Text>
          </View>
          <TouchableOpacity
            onPress={props.charterDetails}
            style={{
              marginTop: 10,
              borderColor: '#223F9A',
              borderWidth: 1,
              padding: 7,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.Poppins_Regular,
                fontSize: hp(1.5),
              }}>
              View Charter Detail
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: wp('10%'),
            height: hp('27%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#00000080',
              width: 1,
              height: hp('20%'),
            }}></View>
        </View>

        <View
          style={{
            width: wp('55%'),
            height: hp('27%'),
            justifyContent: 'space-between',
            // alignItems: 'center',
          }}>
          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>Spot Time</Text>
            <Text style={[styles.value(props?.updated_fields?.includes("client_report_time") ? '#f9fe04' : 'transparent')]}>{props.client_depart_time}</Text>
          </View>

          <View style={styles.itemContanier}>
            <Text style={[styles.subtitle, { width: '70%' }]}>
              Approximate end of service time
            </Text>
            <Text style={[styles.value(props?.updated_fields?.includes("return_time") ? '#f9fe04' : 'transparent')]}>{props.return_time}</Text>
          </View>

          <TouchableOpacity
            onPress={props.busDetail}
            style={styles.itemContanier}>
            <Text style={styles.subtitle}>Bus Number</Text>
            <Text style={[styles.value(props?.updated_fields?.includes("coach_id") ? '#f9fe04' : 'transparent')]}>{props.busnumber}</Text>
          </TouchableOpacity>

          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}># of Bus</Text>
            <Text style={[styles.value(props?.updated_fields?.includes("no_of_bus") ? '#f9fe04' : 'transparent')]}>{props.no_of_bus}</Text>
          </View>
        </View>
      </View>

      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxHeight: hp('30%'),
        }}>
        <View
          style={{
            alignSelf: 'flex-start',
            height: 200,
            justifyContent: 'space-between',
          }}>
          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>{props.drivername}</Text>
            <Text style={styles.value}>{props.phoneno}</Text>
          </View>
          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>Total Pick ups: {props.pickups}</Text>
            <Text style={styles.value}>{props.pickups}</Text>
          </View>

          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>Work Performed</Text>
            <Text style={styles.value}>{props.workPerformed}</Text>
          </View>
          <View style={{height: 3}}></View>
          <TouchableOpacity
            onPress={props.charterDetails}
            style={{
              marginTop: 10,
              borderColor: '#223F9A',
              borderWidth: 1,
              padding: 7,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.Poppins_Regular,
                fontSize: hp(1.5),
              }}>
              View Charter Detail
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#00000080',
            width: 1,
            height: hp('20%'),
          }}></View>

        <View style={{alignSelf: 'flex-start'}}>
          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>Spot Time</Text>
            <Text style={styles.value}>{props.reportingTime}</Text>
          </View>

          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}>Approximate End Time</Text>
            <Text style={styles.value}>{props.appoxtime}</Text>
          </View>

          <TouchableOpacity
            onPress={props.busDetail}
            style={styles.itemContanier}>
            <Text style={styles.subtitle}>Bus Number</Text>
            <Text style={styles.value}>{props.busnumber}</Text>
          </TouchableOpacity>

          <View style={styles.itemContanier}>
            <Text style={styles.subtitle}># of Bus</Text>
            <Text style={styles.value}>{props.noofbuses}</Text>
          </View>
        </View>
      </View> */}

      {mode == 1 ? (
        <View
          style={{
            marginTop: hp('5%'),
            borderColor: '#223F9A',
            backgroundColor: 'white',
            borderWidth: 1,
            padding: 15,
            borderRadius: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#223F9A',
              fontFamily: Fonts.Poppins_Regular,
              fontSize: hp(2),
            }}>
            Acknowledged
          </Text>
          <Image
            style={{
              marginLeft: 5,
              height: hp('2%'),
              width: hp('2%'),
              resizeMode: 'contain',
            }}
            source={require('../Assets/Images/complete.png')}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            acknowledge(driverId, props.charterid);
            console.log(driverId, props.charterid);
          }}
          style={{
            marginTop: hp('5%'),
            backgroundColor: '#223F9A',
            borderWidth: 1,
            padding: 15,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: Fonts.Poppins_Regular,
              fontSize: hp(2),
            }}>
            Acknowledge
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    borderRadius: 15,
  },
  bg: {
    backgroundColor: '#f9fe04'
  },
  dateContanier: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calImage: {
    width: 14,
    height: 16,
    resizeMode: 'contain',
  },
  date: {
    fontFamily: Fonts.Poppins_Light,
    color: '#223F9A',
    fontSize: hp(1.7),
    marginLeft: 10,
  },
  title: {
    fontSize: hp(2),
    fontFamily: Fonts.Poppins_Medium,
    marginVertical: hp('2%'),
  },
  start: {
    marginLeft: hp(1.5),
    fontFamily: Fonts.Poppins_Regular,
    fontSize: hp(1.7),
  },
  startingDate: {
    marginLeft: hp(1.5),
    fontSize: hp(1.5),
    fontFamily: Fonts.Poppins_Light,
  },
  name: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: hp(1.7),
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp(2.9),
    fontFamily: Fonts.Poppins_Regular,
  },
  value: value => ({
    fontFamily: Fonts.Poppins_Bold,
    fontSize: wp(3.4),
    color: '#223F9A',
    backgroundColor: value,
    paddingHorizontal: 5
  }),
  topContanier: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobNumber: {
    fontFamily: Fonts.Poppins_Light,
    fontSize: 12,
    lineHeight: 18,
  },
  itemContanier: {
    marginTop: hp('1%'),
  },
  buttonContanier: {
    borderRadius: 6,
    backgroundColor: '#223F9A',
    paddingHorizontal: 20,
    height: 55,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingDate: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: Fonts.Poppins_Regular,
    color: '#FFFFFF',
  },
  dateValue: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: Fonts.Poppins_Medium,
    color: '#FFFFFF',
  },
});

export default UpcomingJobItem;
