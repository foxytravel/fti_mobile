import React, {useState} from 'react';
import { API_KEY } from '../../Config';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import CustomTextInput from '../../Components/CustomTextInput';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../../Constants/Fonts';
import CustomButton from '../../Components/CustomButton';
import Toast from 'react-native-simple-toast';
import {API} from '../../API/API';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

const ForgotPasswordScreen = props => {
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const forgotPassword = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('API_KEY', API_KEY);
    data.append('email_id', email);

    var config = {
      method: 'post',
      url: `${API}/api/driver/send_otp`,
      data: data,
    };

    try {
      console.log("d1",Date.now())
      const res = await axios(config);
      console.log("d1",Date.now())

      console.log(res,"res>>");
      if (!res.data.Status) {
        Toast.show('Email does not exist. Please enter valid email');
        setLoading(false);
      } else {
        Toast.show(
          'Verification code has been sent to your registered email id',
        );
        setLoading(false);
        props.navigation.navigate('OtpScreen', {
          id: res.data.data,
          email: email,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const verifypass = () => {
    if (valid) {
      forgotPassword();
    } else {
      Toast.show('Please enter valid email');
    }
  };

  const validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log('Please enter valid email');
      setValid(false);
    } else {
      setValid(true);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        // translucent = {true}
        backgroundColor="white"
        barStyle="dark-content"
      />
      <ScrollView
        bounces={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: hp(DeviceInfo.isTablet() ? '31.2%' : '35%'),
            width: wp('100%'),
          }}>
          <View
            style={{
              marginTop: hp('5%'),
              height: hp('10%'),
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.pop();
              }}>
              <Image
                style={{
                  height: hp('2%'),
                  width: hp('2%'),
                  marginHorizontal: 20,
                }}
                source={require('../../Assets/Images/blackback.png')}
              />
            </TouchableOpacity>
            <Image
              style={styles.logo}
              source={require('../../Assets/Images/logo.png')}
            />
            <View></View>
          </View>
          <View style={styles.titleContanier}>
            <Text style={styles.title}>Forgot Your Password?</Text>
            <Text
              style={{
                fontSize: hp(1.6),
                fontFamily: Fonts.Poppins_Light,
                textAlign: 'center',
                width: '80%',
                alignSelf: 'center',
                marginTop: hp('2%'),
              }}>
              Please enter your registered Email. We'll send a verification code
              on your registered Email.
            </Text>
          </View>
        </View>

        <View
          style={{
            height: hp('20%'),
            width: '100%',
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomTextInput
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
        </View>

        <View
          style={{
            height: hp('25%'),
            width: wp('100%'),
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton
            loading={loading}
            title="SEND"
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
    height: hp('10%'),
    width: wp('50%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  titleContanier: {
    marginTop: hp('2%'),
    height: hp('16%'),
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

export default ForgotPasswordScreen;
