import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Container, Content} from '../../Components/NativeBase';
import CustomTextInput from '../../Components/CustomTextInput';
import Fonts from '../../Constants/Fonts';
import CustomButton from '../../Components/CustomButton';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {API} from '../../API/API';

const NewPasswordScreen = props => {
  const id = props.route.params.id;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passIcon, setPassIcon] = useState(false);
  const [loading, setLoading] = useState(false);

  const newPassword = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', id);
    data.append('new_password', password);
    data.append('confirm_password', confirmPassword);

    var config = {
      method: 'post',
      url: `${API}/api/driver/update_password`,
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
        props.navigation.navigate('SignInScreen');
      }
    } catch (error) {
      setLoading(false);
      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    }
  };

  const verifypass = () => {
    if (!password || !confirmPassword) {
      Toast.show('Please enter a valid password');
    } else {
      if (password.length >= 6 && confirmPassword >= 6) {
        if (password == confirmPassword) {
          newPassword();
        } else {
          Toast.show("Password & Confirm Password doesn't match ");
        }
      } else {
        Toast.show('Password Must of atlease 6 Characters');
      }
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: hp('25%'),
            width: wp('100%'),
          }}>
          <Image
            style={styles.logo}
            source={require('../../Assets/Images/logo.png')}
          />
          <View style={styles.titleContanier}>
            <Text style={styles.title}>Enter New Password.</Text>
            {/* <Text
              style={{
                fontSize: hp(1.6),
                fontFamily: Fonts.Poppins_Light,
                textAlign: 'center',
                width: '80%',
                alignSelf: 'center',
              }}>
              Enter new password
            </Text> */}
          </View>
        </View>

        <View
          style={{
            height: hp('40%'),
            width: '100%',
            paddingHorizontal: 20,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
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
            // field="pass"
            show={false}
            image={require('../../Assets/Images/eyeon.png')}
            passIcon={passIcon}
            action={text => setConfirmPassword(text)}
          />
        </View>
        <View
          style={{
            height: hp('12%'),
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
      {/* <Container style={{flex: 1}}>
        <Content>
          <View
            style={{
              width: '100%',
              height: windowHeight - 150,
              paddingHorizontal: 20,
              paddingTop: 20,
            }}>
            <Image
              style={styles.logo}
              source={require('../../Assets/Images/logo.png')}
            />

            <Text style={styles.title}>Enter A New Password.</Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: Fonts.Poppins_Light,
                textAlign: 'center',
                width: '80%',
                alignSelf: 'center',
              }}>
              Your new password must be different from previous used passwords.
            </Text>

            <View style={{marginTop: 30}}>
              {passIcon ? (
                <CustomTextInput
                  label="Password"
                  value={password}
                  // isPassword
                  show={false}
                  // field="pass"
                  passIcon={passIcon}
                  changeeye={() => setPassIcon(!passIcon)}
                  action={text => setPassword(text)}
                  image={require('../../Assets/Images/eyeoff.png')}
                />
              ) : (
                <CustomTextInput
                  label="Password"
                  value={password}
                  isPassword
                  // field="pass"
                  show={false}
                  changeeye={() => setPassIcon(!passIcon)}
                  image={require('../../Assets/Images/eyeon.png')}
                  passIcon={passIcon}
                  action={text => setPassword(text)}
                />
              )}

              <View style={{marginTop: 30}}></View>

              {passIcon ? (
                <CustomTextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  show={false}
                  // field="pass"
                  passIcon={passIcon}
                  changeeye={() => setPassIcon(!passIcon)}
                  action={text => setConfirmPassword(text)}
                  image={require('../../Assets/Images/eyeoff.png')}
                />
              ) : (
                <CustomTextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  isPassword
                  // field="pass"
                  show={false}
                  changeeye={() => setPassIcon(!passIcon)}
                  image={require('../../Assets/Images/eyeon.png')}
                  passIcon={passIcon}
                  action={text => setConfirmPassword(text)}
                />
              )}
            </View>
            <View style={{marginTop: 100}}></View>
            <CustomButton
              loading={loading}
              title="SEND"
              action={() => {
                verifypass();
              }}
            />
          </View>

          <View style={{height: 150, width: '100%'}}>
            <Image
              style={{
                resizeMode: 'cover',
                width: '100%',
                height: '100%',
                position: 'absolute',
                bottom: 0,
              }}
              source={require('../../Assets/Images/mask.png')}
            />
          </View>
        </Content>
      </Container> */}
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
  logo: {
    marginTop: hp('5%'),
    height: hp('10%'),
    width: wp('50%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  titleContanier: {
    marginTop: hp('5%'),
  },
});

export default NewPasswordScreen;
