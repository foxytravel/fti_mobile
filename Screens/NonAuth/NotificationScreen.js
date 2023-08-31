import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { GetAuth, GetUserId } from '../../Redux/UserDetails';

import CustomDrawerHeader from '../../Components/CustomDrawerHeader';
import NotificationItem from '../../Components/NotificationItem';
import Fonts from '../../Constants/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const NotificationScreen = props => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getAllNotifications();
    }, []),
  );

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

  const driverId = useSelector(state => state.userReducer.id);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const markNotificationRead = async (id, type, charterId) => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', driverId);
    data.append('notification_id', id);

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/mark_notification_read',
      data: data,
    };
    await axios(config);
    if (type == 'late_for_office') {
      props.navigation.navigate('Details', {
        charter_id: charterId,
      });
    }
    if (type == 'new_charter_assigned') {
      props.navigation.navigate('Details', {
        charter_id: charterId,
      });
    }
    if (type == 'charter_unassigned') {
      props.navigation.navigate('Details', {
        charter_id: charterId,
      });
    }
    if (type == 're_acknowledge_charter') {
      props.navigation.navigate('Details', {
        charter_id: charterId,
      });
    }
    if (type == 'update_charter_assigned') {
      props.navigation.navigate('Details', {
        charter_id: charterId,
      });
    }
    if (type == 'driver_acknowledge_reminder') {
      props.navigation.navigate('Details', {
        charter_id: charterId,
      });
    }
  };

  const getAllNotifications = async () => {
    setNotifications([])
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', driverId);

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/all_notifications',
      data: data,
    };

    try {
      setLoading(true)
      const res = await axios(config);
      if (res.data.Status) {
        setNotifications(res.data.data);
        setLoading(false);
      } else {
        if (res.data.Message == 'deacivated') {
          logout();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      Toast.show('Something went wrong please try again later');
    }
  };
  useEffect(() => {
    console.log("dddddddd", notifications, 'njohthknk')
  }, [notifications])
  if (loading) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#223F9A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        <CustomDrawerHeader
          number={5}
          width={15}
          height={15}
          title="Notifications"
          action={() => props.navigation.openDrawer()}
          goHome={() => {
            props.navigation.navigate('HomeScreen');
          }}
          calaction={() => props.navigation.navigate('CalendarScreen')}
        />

        {/* MAIN BODY  */}

        {notifications.length != 0 ? (
          <FlatList
            // inverted
            style={{ paddingHorizontal: 20 }}
            keyExtractor={(data, index) => index}
            data={[...notifications].reverse()}
            renderItem={itemData => {
              // console.log(itemData,'itemData')
              return (
                <TouchableOpacity
                  onPress={() => {
                    markNotificationRead(
                      itemData.item.id,
                      itemData.item.type,
                      itemData.item.charter_id,
                    );
                  }}
                >
                  <View style={{ marginTop: 20 }}>
                    <NotificationItem
                      user_read_status={itemData.item.user_read_status}
                      title={itemData.item.title}
                      body={itemData.item.body}
                      created_on={itemData.item.utc}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : !loading && (
          <View>
            <Image
              style={{
                marginTop: windowHeight / 3.5,
                height: 200,
                width: 200,
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={require('../../Assets/Images/notify.png')}
            />
            <Text
              style={{
                fontFamily: Fonts.Poppins_Regular,
                marginTop: 15,
                alignSelf: 'center',
                fontSize: 18,
              }}>
              NO NOTIFICATION FOUND
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: Fonts.Poppins_Medium,
  },
});

export default NotificationScreen;
