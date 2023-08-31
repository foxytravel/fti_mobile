import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CustomTextInput from '../../Components/CustomTextInput';
import Fonts from '../../Constants/Fonts';
import CustomButton from '../../Components/CustomButton';
import Toast from 'react-native-simple-toast';
import {useSelector, useDispatch} from 'react-redux';
import {API} from '../../API/API';
import axios from 'axios';
import {GetAuth, GetUserId} from '../../Redux/UserDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDrawerHeader from '../../Components/CustomDrawerHeader';

const ChangePassword = props => {
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passIcon, setPassIcon] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const id = useSelector(state => state.userReducer.id);

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

  const changeUserPassword = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', id);
    data.append('old_password', oldPassword);
    data.append('new_password', password);
    data.append('confirm_password', confirmPassword);

    var config = {
      method: 'post',
      url: `${API}/api/driver/change_password`,
      data: data,
    };

    try {
      const res = await axios(config);
      console.log(res.data);
      if (!res.data.Status) {
        Toast.show(res.data.Message);
        setLoading(false);
      } else {
        Toast.show('Password reset successfully');
        props.navigation.navigate('HomeScreen');
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const verifypass = () => {
    if (!password || !confirmPassword || !oldPassword) {
      Toast.show('Please enter a valid password');
    } else {
      if (
        password.length >= 6 &&
        oldPassword.length >= 6 &&
        confirmPassword.length >= 6
      ) {
        if (password == confirmPassword) {
          if (password == oldPassword) {
            Toast.show(
              'Your new password must be different from previous password',
            );
          } else {
            changeUserPassword();
          }
        } else {
          Toast.show("Password & Confirm Password doesn't match ");
        }
      } else {
        Toast.show('Passowrds Must of Atleast 8 Characters');
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#223F9A'}}>
      <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

      <View style={styles.screen}>
        <CustomDrawerHeader
          title="Change Password"
          action={() => props.navigation.openDrawer()}
          goHome={() => {
            props.navigation.navigate('HomeScreen');
          }}
          calaction={() => props.navigation.navigate('CalendarScreen')}
        />

        <ScrollView
          bounces={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}>
          <View
            style={{
              height: hp('10%'),
              width: wp('100%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>Enter New Password</Text>
          </View>

          <View
            style={{
              height: hp('40%'),
              width: wp('100%'),
              paddingHorizontal: 20,
              justifyContent: 'space-evenly',
            }}>
            <CustomTextInput
              label="Old Password"
              value={oldPassword}
              isPassword
              // field="pass"
              show={false}
              changeeye={() => setPassIcon(!passIcon)}
              image={require('../../Assets/Images/eyeon.png')}
              passIcon={passIcon}
              action={text => setOldPassword(text)}
            />
            <CustomTextInput
              label="New Password"
              value={password}
              isPassword
              show={false}
              passIcon={passIcon}
              changeeye={() => setPassIcon(!passIcon)}
              action={text => setPassword(text)}
              image={require('../../Assets/Images/eyeoff.png')}
            />
            <CustomTextInput
              label="Confirm Password"
              value={confirmPassword}
              isPassword
              show={false}
              image={require('../../Assets/Images/eyeon.png')}
              passIcon={passIcon}
              action={text => setConfirmPassword(text)}
            />
          </View>

          <View
            style={{
              height: hp('10%'),
              width: wp('100%'),
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <CustomButton
              loading={loading}
              title="SAVE"
              action={() => {
                verifypass();
              }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContanier: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    height: 79,
    width: 202,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 50,
  },
  title: {
    alignSelf: 'center',
    fontFamily: Fonts.Poppins_Medium,
    fontSize: hp(2.5),
  },
});

export default ChangePassword;
