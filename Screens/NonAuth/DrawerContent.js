import {Container, Content} from '../../Components/NativeBase';
import React from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CustomDrawerItem from '../../Components/CustomDrawerItem';
import DrawerProfile from './DrawerProfile';
import LogoutButton from './LogoutButton';

const DrawerContent = props => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#223F9A'}}>
      <StatusBar backgroundColor="#223F9A" barStyle="light-content" />
      <Container style={{flex: 1}}>
        <Content>
          <DrawerProfile
            action={() => {
              props.navigation.navigate('ProfileScreen');
            }}
          />

          <View style={{height: hp(2)}}></View>

          <View style={{padding: 20}}>
            <CustomDrawerItem
              title="Today's Charter"
              image={require('../../Assets/Images/littlebus.png')}
              action={() => props.navigation.navigate('TodaysJob')}
            />

            <CustomDrawerItem
              title="Upcoming Charter"
              image={require('../../Assets/Images/littlebus.png')}
              action={() => props.navigation.navigate('UpcomingJobs')}
            />

            <CustomDrawerItem
              action={() => props.navigation.navigate('CharterHistory')}
              title="Charter History"
              image={require('../../Assets/Images/changehistory.png')}
            />

            <CustomDrawerItem
              action={() => props.navigation.navigate('NotificationScreen')}
              title="Notification"
              noti={true}
              image={require('../../Assets/Images/notification.png')}
            />

            <CustomDrawerItem
              title="Change Password"
              action={() => props.navigation.navigate('ChangePassword')}
              image={require('../../Assets/Images/pass.png')}
            />

            <LogoutButton />
          </View>
        </Content>
      </Container>
    </SafeAreaView>
  );
};

export default DrawerContent;
