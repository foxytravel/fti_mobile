import React from 'react';
import {View, Text, StatusBar, Image, SafeAreaView} from 'react-native';
import CustomButton from '../../Components/CustomButton';
import Fonts from '../../Constants/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const WelcomeScreen = props => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View
        style={{
          height: hp('20%'),
          width: wp('100%'),
          paddingHorizontal: hp(5),
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.Poppins_Regular,
            fontSize: hp(2),
            marginTop: hp('5%'),
          }}>
          Hello, nice to meet you!
        </Text>
        <Text style={{fontFamily: Fonts.Poppins_Bold, fontSize: hp(3.5)}}>
          Get a new experience
        </Text>
      </View>

      <View
        style={{
          height: hp('40%'),
          width: wp('100%'),
        }}>
        <Image
          style={{height: '90%', width: '100%', resizeMode: 'contain'}}
          source={require('../../Assets/Images/bus.png')}
        />
      </View>
      <View
        style={{
          height: hp('20%'),
          width: wp('100%'),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CustomButton
          action={() => {
            props.navigation.navigate('SignInScreen');
          }}
          title="LOGIN YOUR ACCOUNT"
          testID="welcome-login-button"
          width="80%"
        />
      </View>

      <View
        style={{
          height: hp('20%'),
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
    </View>
    // <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between' }}>

    //   <View style={{ paddingHorizontal: 20, height: "20%", width: "100%", justifyContent: 'center' }}>
    //     <Text style={{ fontFamily: Fonts.Poppins_Regular, fontSize: 14 }}>Hello, nice to meet you!</Text>
    //     <Text style={{ fontFamily: Fonts.Poppins_Bold, fontSize: 24 }}>Get a new experience</Text>
    //   </View>

    //   <View style={{ height: "60%", width: "100%", justifyContent: 'space-around' }}>
    //     <Image
    //       style={{ height: "60%", width: "100%", resizeMode: 'contain' }}
    //       source={require('../../Assets/Images/bus.png')}
    //     />
    //     <CustomButton
    //       action={() => {
    //         props.navigation.navigate("SignInScreen")
    //       }}
    //       title="LOGIN YOUR ACCOUNT"
    //       width="80%"
    //     />
    //   </View>

    //   <View style={{ height: '20%', width: "100%", }}>
    //     <Image
    //       style={{ height: "100%", width: "100%", resizeMode: 'cover' }}
    //       source={require("../../Assets/Images/mask.png")}
    //     />
    //   </View>

    // </View>
  );
};

export default WelcomeScreen;
