import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Fonts from '../../Constants/Fonts';
import {API} from '../../API/API';
import {GetAuth, GetUserId} from '../../Redux/UserDetails';

const SignInScreen = props => {
  const isTablet = DeviceInfo.isTablet();
  console.log(isTablet);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(false);
  const [passIcon, setPassIcon] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const loginUser = async () => {
    setLoading(true);
    const token = await messaging().getToken();

    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('email', email);
    data.append('password', password);
    data.append('fcm_token', token);

    var config = {
      method: 'post',
      url: `${API}/api/driver/login`,
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        // Toast.show(res.data.Message)
        const value = {
          id: res.data.data.id,
        };
        console.log('VLAUR', value);
        storeData(value);
      } else {
        console.log(res.data.Message);
        console.log('RU');
        setLoading(false);
        Toast.show(res.data.Message);
      }
    } catch (error) {
      setLoading(false);
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('user', jsonValue);
      dispatch(GetUserId(value.id));
      dispatch(GetAuth(true));
    } catch (e) {
      console.log(e);
      setLoading(false);
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const verifypass = () => {
    if (valid) {
      if (password) {
        if (password.length >= 6) {
          loginUser();
        } else {
          Toast.show('Password must be of 6 characters');
        }
      } else {
        Toast.show('Please Enter a Password');
      }
    } else {
      Toast.show('Invalid Email');
    }
  };

  const validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      setValid(false);
    } else {
      setValid(true);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ScrollView
        bounces={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: hp(DeviceInfo.isTablet() ? '21.2%' : '25%'),
            width: wp('100%'),
          }}>
          <Image
            style={styles.logo}
            source={require('../../Assets/Images/logo.png')}
          />
          <View style={styles.titleContanier}>
            <Text style={styles.title}>LOG IN</Text>
          </View>
        </View>

        <View
          style={{
            height: hp('30%'),
            width: '100%',
            paddingHorizontal: 20,
            justifyContent: 'space-evenly',
          }}>
          <CustomTextInput
            testID="login-email"
            autoCapitalize="none"
            label="Email"
            value={email}
            show={true}
            valid={valid}
            action={text => {
              validateEmail(text);
              setEmail(text);
            }}
          />
          <CustomTextInput
            testID="login-password"
            label="Password"
            value={password}
            isPassword
            show={false}
            image={require('../../Assets/Images/eyeon.png')}
            passIcon={passIcon}
            action={text => setPassword(text)}
          />
        </View>

        <View
          style={{
            height: hp('5%'),
            width: wp('100%'),
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('ForgotPassword');
            }}
            style={{maxWidth: '60%'}}>
            <Text
              style={{
                fontFamily: Fonts.Poppins_Regular,
                fontSize: hp(2),
                color: '#303030',
              }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: hp('20%'),
            width: wp('100%'),
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton
            loading={loading}
            title="LOG IN"
            testID="login-button"
            action={() => {
              verifypass();
            }}
          />
        </View>

        <View
          style={{
            height: hp('20%'),
            width: wp('100%'),
          }}>
          <Image
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: '100%',
            }}
            source={require('../../Assets/Images/mask.png')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContanier: {
    flex: 1,
  },
  logo: {
    marginTop: hp('5%'),
    height: hp('10%'),
    width: wp('50%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  titleContanier: {
    marginTop: hp('2%'),

    height: hp('7%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignSelf: 'center',
    fontFamily: Fonts.Poppins_Medium,
    fontSize: hp(3),
  },
});

export default SignInScreen;
