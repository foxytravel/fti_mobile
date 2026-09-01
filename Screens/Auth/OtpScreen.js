import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import DeviceInfo from 'react-native-device-info';

import Fonts from '../../Constants/Fonts';
import CustomButton from '../../Components/CustomButton';
import {API} from '../../API/API';

const WindowHeight = Dimensions.get('window').height;
const WindowWidth = Dimensions.get('window').width;

const OtpScreen = props => {
  const CELL_COUNT = 6;
  const id = props.route.params.id;
  const email = props.route.params.email;

  const [seconds, setSeconds] = useState(30);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resend, setResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const ref = useBlurOnFulfill({value: otp, cellCount: CELL_COUNT});
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  useEffect(() => {
    if (!resend) {
      let myInterval = setTimeout(() => {
        setSeconds(seconds - 1);
        if (seconds == 0) {
          setSeconds(30);
          setResend(true);
        }
      }, 1000);
      return () => {
        console.log('Runi');
        clearTimeout(myInterval);
      };
    }
  });

  const verifyotp = async () => {
    if (!otp) {
      return Toast.show('Otp cannot be empty');
    }
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', id);
    data.append('otp', otp);

    var config = {
      method: 'post',
      url: `${API}/api/driver/verify_otp`,
      data: data,
    };

    try {
      const res = await axios(config);
      console.log(res.data);
      if (!res.data.Status) {
        Toast.show(res.data.Message);
        setOtp('')
        setLoading(false);
      } else {
        setLoading(false);
        props.navigation.navigate('NewPasswordScreen', {id: id});
      }
    } catch (error) {
      setLoading(false);
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('email_id', email);
    data.append('driver_id', id);

    var config = {
      method: 'post',
      url: `${API}/api/driver/resend_otp`,
      data: data,
    };

    try {
      const res = await axios(config);
      console.log(res.data);
      if (!res.data.Status) {
        Toast.show(res.data.Message);
        setResendLoading(false);
      } else {
        setResendLoading(false);
        Toast.show(res.data.Message);
        setResend(false);
      }
    } catch (error) {
      setResendLoading(false);
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
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
            height: hp(DeviceInfo.isTablet() ? '31.2%' : '35%'),
            width: wp('100%'),
            justifyContent: 'space-evenly'
          }}>
          <Image
            style={styles.logo}
            source={require('../../Assets/Images/logo.png')}
          />
          <View style={styles.titleContanier}>
            <Text style={styles.title}>Enter Your Verification Code</Text>
            {/* <Text
              style={{
                fontSize: hp(1.6),
                fontFamily: Fonts.Poppins_Light,
                textAlign: 'center',
                width: '80%',
                alignSelf: 'center',
                marginTop: hp('0%'),
              }}>
              We have send a verification code to your registered email Id.
            </Text> */}
          </View>
        </View>

        <View
          style={{
            height: hp('20%'),
            width: wp('100%'),
            paddingHorizontal: 20,
            justifyContent: 'space-evenly',
          }}>
          <CodeField
            ref={ref}
            {...codeFieldProps}
            value={otp}
            onChangeText={setOtp}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            keyboardAppearance="light"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />

          {resend ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: hp(2),
                  color: '#303030',
                  fontFamily: Fonts.Poppins_Regular,
                }}>
                Resend Code
              </Text>
              <TouchableOpacity
                onPress={() => {
                  resendOtp();
                }}>
                {!resendLoading ? (
                  <Image
                    style={{
                      height: hp('10%'),
                      width: hp('10%'),
                      resizeMode: 'contain',
                    }}
                    source={require('../../Assets/Images/move.png')}
                  />
                ) : (
                  <ActivityIndicator size="large" color="#223F9A" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              style={{
                fontSize: hp(1.7),
                color: '#303030',
                fontFamily: Fonts.Poppins_Regular,
                marginTop: 20,
              }}>
              Resend Code in{' '}
              <Text
                style={{
                  color: '#223F9A',
                  fontFamily: Fonts.Poppins_Bold,
                }}>
                {seconds} seconds
              </Text>
            </Text>
          )}
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
              verifyotp();
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
    justifyContent: 'space-between',
  },
  mainContanier: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    marginTop: hp('5%'),
    height: hp('10%'),
    width: wp('50%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    fontFamily: Fonts.Poppins_Medium,
    fontSize: hp(2.5),
  },

  codeFieldRoot: {
    backgroundColor: 'white',
    width: '100%',
  },
  cell: {
    width: 40,
    height: 45,
    borderBottomWidth: 2,
    borderBottomColor: '#E9EFF7',
    textAlign: 'center',
    lineHeight: 40,
    fontSize: hp(2),
    color: '#24272B',
    fontFamily: Fonts.Poppins_Medium,
  },
  focusCell: {
    borderBottomColor: '#24272B',
  },
  titleContanier: {
    marginTop: hp('5%'),
  },
});

export default OtpScreen;
