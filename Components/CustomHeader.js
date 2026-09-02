import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../Constants/Fonts';

const CustomHeader = props => {
  return (
    <View style={styles.screen}>
      <TouchableOpacity testID="drawer-toggle" onPress={props.action}>
        <Image
          style={{width: wp('5%'), height: hp('5%'), resizeMode: 'contain'}}
          source={require('../Assets/Images/drawer.png')}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>

      <TouchableOpacity style={{flexDirection: 'row'}} onPress={props.action1}>
        <Image
          style={{width: wp('5%'), height: hp('5%'), resizeMode: 'contain'}}
          source={require('../Assets/Images/calendar.png')}
        />
      </TouchableOpacity>
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

export default CustomHeader;
