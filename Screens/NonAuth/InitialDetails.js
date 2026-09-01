import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Container, Content, Text } from '../../Components/NativeBase';
import axios from 'axios';
import Toast from 'react-native-simple-toast'
import { useSelector } from 'react-redux'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import CustomHeaderType from '../../Components/CustomHeaderType';
import Fonts from '../../Constants/Fonts';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import CustomViewItem from '../../Components/CustomViewItem';

const InitialDetails = props => {
  const id = props.route.params.id

  const [startingMileage, setStartingMileage] = useState('');
  const [time, setTime] = useState('00:00 PM');
  const [busNumber, setBusNumber] = useState(props.route.params.coach_no);
  const [deriverTemperature, setDeriverTemperature] = useState('');
  const [passangerCount, setPassengerCount] = useState(props.route.params.total_passangers)
  const [covid, setCovid] = useState('NO');
  const [loading, setLoading] = useState(false)
  const driverId = useSelector(state => state.userReducer.id);



  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setTime(moment(date).format("hh:mm A"))

    hideDatePicker();
  };



  const startTrip = async () => {


    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', driverId);
    data.append('charter_id', id);


    var config = {
      method: 'post',
      url: 'https://fticoachcharters.com/api/driver/start_trip',
      data: data,
    };

    try {
      setLoading(true)
      const res = await axios(config);
      setLoading(false)
      console.log(res.data)
      if (res.data.Status) {
        console.log(res.data.data)
        if (res.data.data) {
          // Toast.show('Trip started')

        }
      } else {
        Toast.show(res.data.Message)
      }
    } catch (error) {

      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    } finally {
      setLoading(false)
    }
  };
  const getInitialDetails = async () => {

    setLoading(true);

    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', driverId);
    data.append('coach_number', busNumber);
    data.append('charter_id', id);


    var config = {
      method: 'post',
      url: 'https://fticoachcharters.com/api/driver/get_samsara_initial_details',
      data: data,
    };

    try {
      const res = await axios(config);
      console.log(res.data)
      if (res.data.Status) {
        console.log(res.data.data)
        if (res.data.data) {
          let x = res.data.data
          setStartingMileage(x.mileage.toString())
          setTime(moment(x.time).format("hh:mm A"))
        }
      } else {
        Toast.show(res.data.Message)
      }
    } catch (error) {

      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getInitialDetails()
    startTrip()
  }, [])
  const addinitialdetails = async () => {
    if (!startingMileage || !time || !deriverTemperature || !passangerCount || !covid) {
      return Toast.show("Please fill up all fields")
    }
    setLoading(true);

    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', driverId);
    data.append('charter_id', id);
    data.append('starting_mileage', startingMileage);
    data.append('start_time', time);
    data.append('bus_number', busNumber);
    data.append('driver_temperature', deriverTemperature);
    data.append('covid_symptom', covid == 'YES' ? 1 : 0);
    data.append('no_of_passenger', passangerCount);

    var config = {
      method: 'post',
      url: 'https://fticoachcharters.com/api/driver/save_initial_details',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        // props.navigation.navigate('FinalDetails');
        props.navigation.pop();

        if (Platform.OS == 'android') {
          Linking.canOpenURL('https://play.google.com/store/apps/details?id=com.samsara.driver')
            .then((canOpen) => {
              if (canOpen) {
                console.log('open app');
                return Linking.openURL('https://play.google.com/store/apps/details?id=com.samsara.driver')
              };
            }).catch(err => console.log('An error occurred', err));
        }
        else {

          Linking.canOpenURL('https://apps.apple.com/us/app/samsara-driver/id1106069401')
            .then((canOpen) => {
              if (canOpen) {
                console.log('open app');
                return Linking.openURL('https://apps.apple.com/us/app/samsara-driver/id1106069401')
              };
            }).catch(err => console.log('An error occurred', err));
        }
      } else {
        Toast.show(res.data.Message)
      }
    } catch (error) {

      console.log('>>>>', error);
      Toast.show('Something Went Wrong Please Try Again Later');
    } finally {
      setLoading(false)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <View style={styles.screen}>
        {/* STATUS BAR  */}
        <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

        <CustomHeaderType
          title="Initial Details"
          calaction={() => props.navigation.navigate('CalendarScreen')}
          action={() => props.navigation.goBack()}
        />

        {/* MAIN BODY  */}
        <Container style={{ paddingHorizontal: 20, flex: 1 }}>
          <Content
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {/* <View style={{ height: 20 }}></View> */}

            <View style={{ marginTop: Platform.OS == "android" ? 30 : 30 }}>

              <CustomTextInput
                keyboardType="numeric"
                autoCapitalize="none"
                label="Starting Mileage"
                value={startingMileage}
                show={true}
                action={text => {
                  setStartingMileage(text);
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                setDatePickerVisibility(!isDatePickerVisible)
              }}
              style={{ marginTop: Platform.OS == "android" ? 30 : 40, marginHorizontal: 10 }}>

              <CustomViewItem
                color="grey"
                label="Time"
                value={time}
              />

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
            <View style={{ marginTop: Platform.OS == "android" ? 30 : 40 }}>

              <CustomTextInput
                label="Bus Number"
                keyboardType="numeric"
                value={busNumber}
                action={text => {
                  setBusNumber(text);
                }}
              />
            </View>

            <View style={{ marginTop: Platform.OS == "android" ? 30 : 40 }}>

              <CustomTextInput
                label="Driver Temperature"
                keyboardType="numeric"
                value={deriverTemperature}
                action={text => {
                  setDeriverTemperature(text);
                }}
              />
            </View>

            <View style={{ marginTop: Platform.OS == "android" ? 30 : 40 }}>

              <CustomTextInput
                label="Passenger Count"
                keyboardType="numeric"
                value={passangerCount}
                action={text => {
                  setPassengerCount(text);
                }}
              />
            </View>

            <View style={{ height: 50 }}></View>
            <Text
              style={{
                color: '#212121',
                fontFamily: Fonts.Poppins_Regular,
                fontSize: hp(1.7),
              }}>
              COVID - 19 Symptoms
            </Text>
            <View
              style={{
                marginTop: hp('1%'),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setCovid('YES')}
                style={{ flexDirection: 'row', alignItems: 'center' }}>



                <View
                  style={{
                    height: hp('2%'),
                    width: hp('2%'),
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: covid == 'YES' ? '#149505' : '#000000',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {covid == 'YES' ? (
                    <View
                      style={{
                        height: hp('1%'),
                        width: hp('1%'),
                        backgroundColor: '#149505',
                        borderRadius: 100,
                      }}></View>
                  ) : null}
                </View>
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 14,
                    lineHeight: 21,
                    fontFamily: Fonts.Poppins_Regular,
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCovid('NO')}
                style={{
                  marginLeft: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: hp('2%'),
                    width: hp('2%'),
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: covid == 'NO' ? '#149505' : '#000000',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {covid == 'NO' ? (
                    <View
                      style={{
                        height: hp('1%'),
                        width: hp('1%'),
                        backgroundColor: '#149505',
                        borderRadius: 100,
                      }}></View>
                  ) : null}
                </View>
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 14,
                    lineHeight: 21,
                    fontFamily: Fonts.Poppins_Regular,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 50 }}></View>

            <CustomButton
              loading={loading}
              title="SUBMIT"
              action={() => {
                addinitialdetails()
              }}
            />

            <Text
              style={{
                marginTop: 30,
                fontFamily: Fonts.Poppins_Regular,
                fontSize: hp(1.5),
                color: '#212121',
              }}>
              Upon completion of segments, the driver is relieved of all duty
              and responsibility for the care and custody of the vehicle, its
              accessories, and any cargo or passengers it may be carrying.
              During the Stop, and for the duration at the stop, the driver is a
              liberty to pursue activities of his/her own choosing and to leave
              the premises where the vehicle is situated
            </Text>

            <View style={{ height: 50 }}></View>
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

export default InitialDetails;
