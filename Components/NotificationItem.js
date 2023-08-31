import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

import Fonts from '../Constants/Fonts';

const NotificationItem = props => {
  return (
    <Card style={styles.cardContanier}>
      <View style={styles.cardView}>
        <Image
          style={{ height: 13, width: 13, resizeMode: 'contain' }}
          source={require('../Assets/Images/clock.png')}
        />
        <Text
          style={{
            fontFamily: Fonts.Poppins_Regular,
            color: props.user_read_status == 1 ? 'grey' : '#223F9A',
            fontSize: hp(1.5),
            marginLeft: 10,
          }}>
          {moment.unix(props.created_on).fromNow()}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: hp('2%') }}>
        <View
          style={{
            marginTop: 5,
            backgroundColor: props.user_read_status == 1 ? 'grey' : '#27B5FE',
            borderRadius: 100,
            width: hp('2%'),
            height: hp('2%'),
          }}></View>
        <Text
          style={{
            color: props.user_read_status == 1 ? 'grey' : '#223F9A',
            marginLeft: 10,
            fontSize: hp(1.8),
            fontFamily: Fonts.Poppins_Regular,
            width: '90%',
          }}>
          {props.body}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContanier: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: 'white',
  },
  cardView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default NotificationItem;
