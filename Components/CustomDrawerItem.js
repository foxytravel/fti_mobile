import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Fonts from '../Constants/Fonts';

const CustomDrawerItem = props => {
  const driverId = useSelector(state => state.userReducer.id);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getNotiCount();
  });

  const getNotiCount = async () => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('driver_id', driverId);
    data.append('API_KEY', 'REDACTED_API_KEY');

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/get_notification_count',
      data: data,
    };

    try {
      const data = await axios(config);
      console.log(data.data);
      if (data.data.Status) {
        setCount(data.data.data);
      } else {
        setCount(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity onPress={props.action} style={styles.screen}>
      <Image
        style={{ height: hp('2.5%'), width: hp('5%'), resizeMode: 'contain' }}
        source={props.image}
      />
      <Text numberOfLines={1} style={styles.title}>
        {props.title}
      </Text>
      {props.noti ? (
        count == 0 ? null : (
          <View
            style={{
              marginLeft: 10,
              height: hp('2%'),
              width: hp('2%'),
              backgroundColor: '#D80404',
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.Poppins_Regular,
                color: '#F5F5F5',
                fontSize: hp(1.5)
              }}>
              {count}
            </Text>
          </View>
        )
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  title: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: hp(2),
    color: '#000000',
    marginLeft: 20,
  },
});

export default CustomDrawerItem;
