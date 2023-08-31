import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, Content, Toast } from 'native-base';
import CustomHeaderType from '../../Components/CustomHeaderType';
import Fonts from '../../Constants/Fonts';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import AttachmentHeader from '../../Components/AttachementHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

import CustomImagePickerModal from '../../Components/CustomImagePickerModal';
import RenderImageItem from '../../Components/RenderImageItem';
import CustomViewItem from '../../Components/CustomViewItem';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const FinalDetails = props => {
  const id = props.route.params.id

  const [endingMileage, setEndingMileage] = useState('');
  const [endTime, setEndTime] = useState(moment().format("hh:mm A"));
  const [endTimeCal, setEndTimeCal] = useState('1:00 PM');

  const [mileageDifference, setMileageDifference] = useState((Number(endingMileage) - Number(intialMilage)).toString());
  const [totaltimeworkdone, setTotaltimeworkdone] = useState('');
  const [numberofpassengers, setNumberofpassengers] = useState('');
  const [imageUrl3, setImageUrl3] = useState([]);
  const [imageUrl1, setImageUrl1] = useState([]);
  const [imageUrl2, setImageUrl2] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selector, setSelector] = useState('1');
  const [loading, setLoading] = useState(false)
  const driverId = useSelector(state => state.userReducer.id);
  const [busNumber, setBusNumber] = useState(props.route.params.coach_no);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [intialMilage, setIntialMilage] = useState('')
  const [intialTime, setIntialTime] = useState('')
  const [driverSign,setDriverSign]=useState(null)

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setEndTime(moment(date).format("hh:mm A"))

    hideDatePicker();
  };
  useEffect(() => {
    console.log(endingMileage, intialMilage)
    let x = endingMileage - intialMilage
    console.log(x, 'kkkkkkkk')
    setMileageDifference(x.toString())
  }, [endingMileage, intialMilage])
  useEffect(() => {
    let date = moment().format('YYYY-MM-DD')

    console.log(intialTime, date + " " + endTime, 'endTime--->')
    console.log(date + " " + endTime)
    let x = intialTime
    var now = x;
    // var then = moment(endTimeCal).format("YYYY-MM-DD hh:mm A");
    // console.log(x,then,'jjj')
    let kk = Math.round(moment.duration(moment(date + " " + endTime, "YYYY-MM-DD hh:mm A").diff(moment(now, "YYYY-MM-DD hh:mm A", true))).asHours())
    console.log(kk, 'jjjjj')
    setTotaltimeworkdone(kk.toString())
  }, [intialTime, endTime])
  const getFinalDetails = async () => {

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
          setEndingMileage(x.mileage.toString())
          // setEndTime(moment(x.time).format("hh:mm A"))
          // setEndTimeCal(x.time)
          console.log(res.data.data.starting_mileage, 'ttttttt')
          setIntialMilage(res.data.data.starting_mileage)
          setIntialTime(res.data.data.start_date_time)
          setNumberofpassengers(res.data.data.total_passangers)
          setDriverSign(res.data.data.driver_signature)

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
  const addFinaldetails = async () => {
    console.log('called')
    if (!mileageDifference || !endTime || !busNumber || !numberofpassengers || !totaltimeworkdone) {
      return Toast.show("Please fill up all fields")
    }
    setLoading(true);

    var data = new FormData();
    data.append('API_KEY', 'REDACTED_API_KEY');
    data.append('driver_id', driverId);
    data.append('charter_id', id);
    data.append('end_mileage', endingMileage);
    data.append('end_time', endTime);
    data.append('bus_number', busNumber);
    data.append('no_of_passenger', numberofpassengers);
    data.append('mileage_difference', mileageDifference)
    data.append('total_work_time', totaltimeworkdone)
    let fuelBills = []
    for (let index = 0; index < imageUrl1.length; index++) {
      const element = { ...imageUrl1[index] };
      let x = element.path.split('/')
      console.log(x, 'x')
      delete element.name

      element.name = element.path.split('/')[x.length - 1]

      if (!element.type && !element.doc) {
        element.type = element.mime

      }
      element.uri = element.path
      console.log(element.name, 'name')
      fuelBills.push(element)
      console.log('fuelBills', element)
      data.append('fuel_bills[]', element)

    }
    let hotelBills = []
    for (let index = 0; index < imageUrl2.length; index++) {
      const element = { ...imageUrl2[index] };
      let x = element.path.split('/')
      console.log(x, 'x')
      delete element.name
      element.name = element.path.split('/')[x.length - 1]
      if (!element.type && !element.doc) {
        element.type = element.mime
      }
      element.uri = element.path
      console.log(element.name, 'name')
      hotelBills.push(element)
      console.log('hotelbills', element)
      data.append('hotel_bills[]', element)

    }
    let driver_sign = null
    for (let index = 0; index < imageUrl3.length; index++) {
      const element = { ...imageUrl3[index] };
      let x = element.path.split('/')
      console.log(x, 'x')
      element.name = element.path.split('/')[x.length - 1]
      if (!element.type && !element.doc) {
        element.type = element.mime
      }
      element.uri = element.path
      console.log(element.name, 'name')
      driver_sign = element
      console.log(element, 'driver')

    }
    if (driver_sign) {
      data.append('driver_sign', driver_sign)

    }

    var config = {
      method: 'post',
      url: 'https://fticoachcharters.com/api/driver/save_end_details',
      data: data,
    };

    try {
      const res = await axios(config);
      console.log(res.data)
      if (res.data.Status) {
        props.navigation.navigate('DrawerStack')
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
    getFinalDetails()
  }, [])
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
      <StatusBar backgroundColor="#223F9A" barStyle="light-content" />
      <View style={styles.screen}>
        <CustomImagePickerModal
          visible={visible}
          pressHandler={() => {
            setVisible(!visible);
          }}
          selector={selector}
          imageUrl1={result => {
            setImageUrl1(result);
          }}
          imageUrl2={result => {
            setImageUrl2(result);
          }}
          imageUrl3={result => {
            setImageUrl3(result);
          }}
        />

        {/* STATUS BAR  */}

        <CustomHeaderType
          // number={9}
          width={15}
          height={15}
          title="Final Details"
          action={() => props.navigation.goBack()}
        />

        {/* MAIN BODY  */}
        <Container style={{ paddingHorizontal: 10, flex: 1 }}>
          <Content
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: 30 }}>
              <CustomTextInput
                label="Ending Mileage"
                keyboardType="numeric"
                value={endingMileage}
                action={text => {
                  setEndingMileage(text);
                }}
              />
            </View>

            {/* <View style={{ marginTop: 30 }}>
              <CustomTextInput
                label="End Time"
                keyboardType="numeric"
                value={endTime}
                action={text => {
                  setEndTime(text);
                }}
              />
            </View> */}
            <TouchableOpacity
              onPress={() => {
                setDatePickerVisibility(!isDatePickerVisible)
              }}
              style={{ marginTop: Platform.OS == "android" ? 30 : 40, marginHorizontal: 10 }}>

              <CustomViewItem
                color="grey"
                label="Time"
                value={endTime}
              />

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                // date={endTime}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
            <View style={{ marginTop: 30 }}>

              <CustomTextInput
                label="Mileage Difference (In Miles)"
                // keyboardType="numeric"
                value={mileageDifference}
                action={text => {
                  setMileageDifference(text);
                }}
                editable={true}
              />
            </View>

            <View style={{ marginTop: 30 }}>
              <CustomTextInput
                label="Total time work done (In Hours)"
                // keyboardType="numeric"
                value={totaltimeworkdone}
                action={text => {

                  setTotaltimeworkdone(text);
                }}
              />
            </View>

            <View style={{ marginTop: 30 }}>
              <CustomTextInput
                label="Number of Passengers"
                keyboardType="numeric"
                value={numberofpassengers}
                action={text => {
                  setNumberofpassengers(text);
                }}
              />
            </View>
            <View >
              <Text style={{
                marginTop: 30,
                color: "#212121",
                fontSize: 12,
                lineHeight: 18,
                fontFamily: Fonts.Poppins_Regular
              }}>Driver Signature</Text>
              <Image
              source={{uri:`https://fticoachcharters.com/${driverSign}`}}
              style={{width:'100%', height:200, resizeMode:'contain'}}
              />
            </View>
            <AttachmentHeader title="Fuel Bills" />

            <RenderImageItem
              image={imageUrl1}
              openModal={() => setVisible(true)}
              select={() => setSelector('1')}
              setImage={() => setImageUrl1([])}
              delete={result => {
                const newValue = imageUrl1.filter(item => item.path != result);
                setImageUrl1(newValue);
              }}
            />



            <AttachmentHeader title="Hotel | Parking | Miscellaneous Bills" />

            <RenderImageItem
              image={imageUrl2}
              openModal={() => setVisible(true)}
              select={() => setSelector('2')}
              setImage={() => setImageUrl2([])}
              delete={result => {
                const newValue = imageUrl2.filter(item => item.path != result);
                setImageUrl2(newValue);
              }}
            />

            {/* <AttachmentHeader title="Driver Signature" />

            <RenderImageItem
              image={imageUrl3}
              openModal={() => setVisible(true)}
              select={() => setSelector('3')}
              setImage={() => setImageUrl3([])}
              delete={result => {
                const newValue = imageUrl3.filter(item => item.path != result);
                setImageUrl3(newValue);
              }}
            /> */}

            <View style={{ marginVertical: 40 }}>
              <CustomButton
                title="SUBMIT"
                action={() => {
                  addFinaldetails()
                  // props.navigation.navigate('DrawerStack');
                }}
              />
            </View>
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

export default FinalDetails;
