import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../Constants/Fonts';

const CustomViewItem = props => {
  console.log('<<<<', props.value);
  return (
    <View>
      <Text style={styles.labelText}>{props.label}</Text>
      <Text
        style={{
          fontSize: hp(1.9),
          fontFamily: Fonts.Poppins_Regular,
          lineHeight: 27,
          marginTop: hp('1%'),
          color: props.color ? props.color : '#24272B'
          // backgroundColor:props.backgroundColor
        }}>
        <Text style={{ backgroundColor: props.backgroundColor }} >{props.value}</Text>
      </Text>
      <View style={styles.divider}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelText: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: hp(1.5),
    color: '#797979',
  },
  divider: {
    backgroundColor: '#E9EFF7',
    height: 2,
    width: '100%',
    marginTop: hp('2%'),
  },
});

export default CustomViewItem;
