import React from 'react';
import {View, Image, Pressable, Platform} from 'react-native';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../Constants/Fonts';

const CustomTextInput = props => {
  return (
    <View
      accessibilityLabel={props.accessibilityLabel}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
      }}>
      <FloatingLabelInput
        staticLabel={true}
        {...props}
        customLabelStyles={{
          colorBlurred: '#797979',
          colorFocused: '#797979',
          fontSizeBlurred: hp(2),
          fontSizeFocused: hp(2),
        }}
      
        editable={!props.editable}
        inputStyles={{
          fontFamily: Fonts.Poppins_Regular,
          color: props.color ? props.color : '#797979',
          marginTop: Platform.OS == 'android' ? hp('0%') : hp('2%'),
          fontSize: hp(2),
        }}
        labelStyles={{
          fontFamily: Fonts.Poppins_Regular,
          paddingLeft: 0,
          marginLeft: -5,
        }}
        label={props.label}
        containerStyles={{borderBottomWidth: 0.5, marginTop: 5, marginLeft: 10}}
        value={props.value}
        onChangeText={text => props.action(text)}
        customShowPasswordComponent={
          <Image
            style={{height: hp('4%'), width: wp('4%'), resizeMode: 'contain'}}
            source={require('../Assets/Images/eyeon.png')}
          />
        }
        customHidePasswordComponent={
          <Image
            style={{height: hp('4%'), width: wp('4%'), resizeMode: 'contain'}}
            source={require('../Assets/Images/eyeoff.png')}
          />
        }
      />

      {props.show ? (
        props.valid ? (
          <Image
            style={{
              height: hp('4%'),
              width: wp('4%'),
              position: 'absolute',
              right: 10,
              resizeMode: 'contain',
            }}
            source={require('../Assets/Images/check.png')}
          />
        ) : null
      ) : null}
    </View>
  );
};

export default CustomTextInput;
