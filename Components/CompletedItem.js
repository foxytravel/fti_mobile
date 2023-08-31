import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {Card, View} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../Constants/Fonts';

const CompletedItem = props => {
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
              style={{fontFamily: Fonts.Poppins_SemiBold, color: '#223F9A'}}>
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
          <Text style={styles.start}>{props.start}</Text>
          <Text style={[styles.startingDate, {marginTop: hp('1%')}]}>
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
        <Text style={styles.start}>{props.arrive}</Text>
      </View>

      {/* <View
        style={{
          marginVertical: hp('3%'),
          flexDirection: 'row',
          alignItems: 'center',
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
            alignItems: 'flex-start',
            height: hp('15%'),
            width: '90%',
          }}>
          <View style={{marginLeft: 20}}>
            <Text numberOfLines={1} style={styles.start}>
              {props.start}
            </Text>
            <Text style={styles.startingDate}>{props.startingDate}</Text>
          </View>

          <View style={{marginLeft: 20}}>
            <Text numberOfLines={1} style={styles.start}>
              {props.arrive}
            </Text>
            <Text style={styles.startingDate}>{props.closingDate}</Text>
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
        <Text style={{color: '#223F9A'}}>{props.name}</Text>
      </Text>

      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: wp('35%'),
            height: hp('20%'),
            justifyContent: 'space-evenly',
          }}>
          <Text style={styles.drivername}>{props.drivername}</Text>
          <Text style={styles.phoneno}>{props.phoneno}</Text>
          <Text style={styles.pickups}>Total Pick ups: {props.pickups}</Text>
          <TouchableOpacity
            onPress={props.status == 'completed'?props.action:props.charterDetails}
            style={{
              marginTop: 10,
              borderColor: '#223F9A',
              borderWidth: 1,
              padding: 3,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.Poppins_Regular,
                fontSize: hp(1.5),
              }}>
              {props.status == 'completed' ?"View Travel Itinerary" :"View Charter Detail"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: wp('8%'),
            height: hp('18%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#00000080',
              width: 1,
              height: hp('18%'),
            }}></View>
        </View>

        <View
          style={{
            width: wp('45%'),
            height: hp('20%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {props.status == 'completed' ? (
            <View style={{ justifyContent:'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                  source={require('../Assets/Images/littlebus.png')}
                />
                <Text style={styles.drivername}>Status</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#149505',
                    fontSize: hp(2),
                    fontFamily: Fonts.Poppins_Bold,
                  }}>
                  Completed
                </Text>
                <Image
                  style={{
                    width: wp('7%'),
                    height: wp('7%'),
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                  source={require('../Assets/Images/completed.png')}
                />
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                  source={require('../Assets/Images/littlebus.png')}
                />
                <Text style={styles.drivername}>Status</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#D80404',
                    fontSize: hp(2),
                    fontFamily: Fonts.Poppins_Bold,
                  }}>
                  Cancelled
                </Text>
                <Image
                  style={{
                    marginLeft: hp('1%'),
                    width: hp('2%'),
                    height: hp('2%'),
                    resizeMode: 'contain',
                  }}
                  source={require('../Assets/Images/cancel.png')}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxHeight: hp('30%'),
        }}>
        <View>
          <Text style={styles.drivername}>{props.drivername}</Text>
          <Text style={styles.phoneno}>{props.phoneno}</Text>
          <Text style={styles.pickups}>Total Pick ups: {props.pickups}</Text>
          <TouchableOpacity
            onPress={props.charterDetails}
            style={{
              marginTop: 10,
              borderColor: '#223F9A',
              borderWidth: 1,
              padding: 3,
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

        {props.status == 'completed' ? (
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  width: 23,
                  height: 15,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
                source={require('../Assets/Images/littlebus.png')}
              />
              <Text style={styles.drivername}>Status</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: '#149505',
                  fontSize: hp(2),
                  fontFamily: Fonts.Poppins_Bold,
                }}>
                Completed
              </Text>
              <Image
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
                source={require('../Assets/Images/completed.png')}
              />
            </View>
          </View>
        ) : (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
                source={require('../Assets/Images/littlebus.png')}
              />
              <Text style={styles.drivername}>Status</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: '#D80404',
                  fontSize: hp(2),
                  fontFamily: Fonts.Poppins_Bold,
                }}>
                Cancelled
              </Text>
              <Image
                style={{
                  marginLeft: hp('1%'),
                  width: hp('2%'),
                  height: hp('2%'),
                  resizeMode: 'contain',
                }}
                source={require('../Assets/Images/cancel.png')}
              />
            </View>
          </View>
        )}
      </View> */}
    </Card>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    borderRadius: 15,
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
    fontFamily: Fonts.Poppins_Medium,
    fontSize: hp(2),
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
    marginBottom: hp("1%"),
  },
  drivername: {
    fontSize: hp(2),
    fontFamily: Fonts.Poppins_Regular,
  },
  phoneno: {
    fontFamily: Fonts.Poppins_Bold,
    fontSize: hp(2.5),
  },
  pickups: {
    fontSize: hp(1.5),
    fontFamily: Fonts.Poppins_Regular,
  },
  topContanier: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobNumber: {
    fontFamily: Fonts.Poppins_Light,
    fontSize: 12,
    lineHeight: 18,
  },
});

export default CompletedItem;
