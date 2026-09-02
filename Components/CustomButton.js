import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Image, Text, TouchableOpacity, ActivityIndicator} from 'react-native';

import Fonts from '../Constants/Fonts';

const CustomButton = props => {
  return (
    <TouchableOpacity
      disabled={props.loading}
      onPress={props.action}
      accessibilityLabel={props.title}
      testID={props.testID}
      style={{
        height: hp('8%'),
        width: props.width ? props.width : '100%',
        alignSelf: 'center',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor:props.color?props.color:'#223F9A',
        borderRadius: 6,
      }}>
      <Text
        style={{
          color: '#F9F9F9',
          fontSize: hp(2),
          fontFamily: Fonts.Poppins_SemiBold,
        }}>
        {props.title}
      </Text>

      {props.loading ? (
        <ActivityIndicator color="#F9F9F9" size = "large" />
      ) : (
        <Image
          style={{height: hp('2%'), width: wp('10%'), resizeMode: 'contain'}}
          source={require('../Assets/Images/forward.png')}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
