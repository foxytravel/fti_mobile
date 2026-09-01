import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Container, Content} from '../../Components/NativeBase';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../../Constants/Fonts';
import {API} from '../../API/API';
import CustomDrawerHeaderBack from '../../Components/CustomDrawerHeaderBack';
import CustomViewItem from '../../Components/CustomViewItem';

const ProfileScreen = props => {
  const user = useSelector(state => state.userReducer.user);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#223F9A'}}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        <CustomDrawerHeaderBack
          title="Profile"
          action={() => props.navigation.goBack()}
          calaction={() => props.navigation.navigate('CalendarScreen')}
          goHome={() => {
            props.navigation.navigate('HomeScreen');
          }}
        />

        {/* MAIN BODY  */}
        <ScrollView>
          <View
            style={{
              height: hp('20%'),
              width: wp('100%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: hp('15%'),
                height: hp('15%'),
                borderRadius: 100,
                alignSelf: 'center',
                marginVertical: 20,
              }}
              source={{uri: `${API}/${user?.data?.driver_image}`}}
            />
          </View>

          <View
            style={{
              height: hp('50%'),
              width: wp('100%'),
              paddingHorizontal: 20,
            }}>
            <View>
              <CustomViewItem
                color="#223F9A"
                label="Name"
                value={user.data.name}
              />
            </View>

            <View style={styles.viewItem}>
              <CustomViewItem
                color="#223F9A"
                label="Email"
                value={user.data.email}
              />
            </View>

            <View style={styles.viewItem}>
              <CustomViewItem
                color="#223F9A"
                label="Address"
                value={user.data.address}
              />
            </View>

            <View style={styles.viewItem}>
              <CustomViewItem
                color="#223F9A"
                label="Phone Number"
                value={user.data.cell_phone}
              />
            </View>
          </View>
        </ScrollView>

        {/* <Container style={{paddingHorizontal: 20, paddingBottom: 20, flex: 1}}>
        <Content>
          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
              alignSelf: 'center',
              marginVertical: 20,
            }}
            source={{uri: `${API}/${user.data.driver_image}`}}
          />

          <View style={{height: 20}}></View>

          <View>
            <CustomViewItem
              color="#223F9A"
              label="Name"
              value={user.data.name}
            />
          </View>

          <View style={styles.viewItem}>
            <CustomViewItem
              color="#223F9A"
              label="Email"
              value={user.data.email}
            />
          </View>

          <View style={styles.viewItem}>
            <CustomViewItem
              color="#223F9A"
              label="Address"
              value={user.data.address}
            />
          </View>

          <View style={styles.viewItem}>
            <CustomViewItem
              color="#223F9A"
              label="Phone Number"
              value={user.data.cell_phone}
            />
          </View>
        </Content>
      </Container> */}
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
  viewItem: {
    marginTop: 30,
  },
});

export default ProfileScreen;
