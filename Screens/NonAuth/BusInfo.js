import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Container, Content, Text} from 'native-base';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {GetAuth, GetUserId} from '../../Redux/UserDetails';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

import Fonts from '../../Constants/Fonts';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomDrawerHeaderBack from '../../Components/CustomDrawerHeaderBack';
import {StackActions} from '@react-navigation/native';
import CustomViewItem from '../../Components/CustomViewItem';

const BusInfo = props => {
  const dispatch = useDispatch();
  const coachid = props.route.params.coachid;
  const driverId = useSelector(state => state.userReducer.id);
  const [loading, setLoading] = useState(true);

  const [coachData, setCoachData] = useState({});

  useEffect(() => {
    getBusInfo();
  }, []);

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

  const getBusInfo = async () => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', 'fti_coach@2021_*');
    data.append('driver_id', driverId);
    data.append('coach_id', coachid);

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/get_coach_detail',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        setLoading(false);
        setCoachData(res.data.data);
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

  if (!coachData.belt) {
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <Text style={{fontFamily: Fonts.Poppins_Regular}}>Nothing Found</Text>
    </View>;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#223F9A'}}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        <CustomDrawerHeaderBack
          number={11}
          width={15}
          height={15}
          title="Bus Info"
          action={() => props.navigation.goBack()}
          calaction={() => props.navigation.navigate('CalendarScreen')}
          goHome={() => {
            props.navigation.dispatch(StackActions.popToTop());
          }}
        />

        {/* MAIN BODY  */}
        <Container style={{paddingHorizontal: 20, flex: 1}}>
          <Content>
            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Coach Number"
                value={coachData.coach_number}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Year"
                value={coachData.year}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Make"
                value={coachData.make}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Model"
                value={coachData.model}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Vin"
                value={coachData.vin}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="License Plate#"
                value={coachData.license_plate}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Transponder#"
                value={coachData.transponder}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Tracker"
                value={coachData.tracker}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Passenger Count"
                value={coachData.passenger_count}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="State Inspection Expiration"
                value={coachData.state_inspection_expiration}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Engine Make"
                value={coachData.engine_make}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Engine Vin"
                value={coachData.engine_vin}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Tire Size (In Inches)"
                value={coachData.tire_size}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="XXX Belt (In Inches)"
                value={coachData.belt}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Alternator"
                value={coachData.alternator}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Purchase Date"
                value={coachData.purchase_date}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Purchase Price "
                value={coachData.purchase_price}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Coach Height "
                value={coachData.coach_height}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Coach Weight "
                value={coachData.coach_weight}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Wifi Number "
                value={coachData.wifi_number}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="IMEI Number "
                value={coachData.imei_number}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Coach Email "
                value={coachData.coach_email}
              />
            </View>

            <View style={{marginTop: 30}}>
              <CustomViewItem
                color="#223F9A"
                label="Coach Status"
                value={coachData.coach_status}
              />
            </View>

            <Text
              style={{
                marginTop: 30,
                marginBottom: 20,
                fontSize: hp(1.5),
                fontFamily: Fonts.Poppins_Regular,
                color: '#212121',
              }}>
              Coach Picture
            </Text>
            <Image
              style={{
                height: hp("40%"),
                width: '100%',
                resizeMode: 'contain',
                marginBottom: 20,
              }}
              source={{
                uri: `https://fticoachcharters.com/${coachData.coach_image}`,
              }}
            />
          </Content>
        </Container>
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

export default BusInfo;
