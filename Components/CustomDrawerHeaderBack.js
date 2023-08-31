import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../Constants/Fonts';

const CustomDrawerHeaderBack = props => {
  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={props.action}>
        <Image
          style={{
            width: wp('2%'),
            height: hp('2%'),
            resizeMode: 'contain',
          }}
          source={require('../Assets/Images/back.png')}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={props.goHome}>
          <Image
            style={{
              width: wp('5%'),
              height: hp('5%'),
              resizeMode: 'contain',
              marginRight: hp(2),
            }}
            source={require('../Assets/Images/home.png')}
          />
        </TouchableOpacity>
        {
          props.calaction &&
          <TouchableOpacity onPress={props.calaction}>
          <Image
            style={{width: wp('5%'), height: hp('5%'), resizeMode: 'contain'}}
            source={require('../Assets/Images/calendar.png')}
          />
        </TouchableOpacity>
        }
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
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

export default CustomDrawerHeaderBack;
