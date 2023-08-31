import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {API} from '../../API/API';
import Fonts from '../../Constants/Fonts';

const DrawerProfile = props => {
  const user = useSelector(state => state.userReducer.user);

  return (
    <View
      style={{
        backgroundColor: '#223F9A',
        height: hp('30%'),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={props.action}>
        {user?.data?.driver_image ? (
          <Image
            style={{width: hp('15%'), height: hp('15%'), borderRadius: hp("100%"),}}
            source={{uri: `${API}/${user?.data?.driver_image}`}}
          />
        ) : null}
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: Fonts.Poppins_Regular,
          fontSize: hp(2),
          color: '#FFFFFF',
        }}>
        {user.data.name ? user.data.name : 'N/A'}
      </Text>
      <Text
        style={{
          fontSize: hp(1.5),
          fontFamily: Fonts.Poppins_Light,
          lineHeight: 18,
          color: '#FFFFFF',
        }}>
        {user.data.email ? user.data.email : 'N/A'}
      </Text>
    </View>
  );
};

export default DrawerProfile;
