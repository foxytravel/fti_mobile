import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, StatusBar, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, Linking } from 'react-native'
import { Container, Content, Icon, Text, Toast } from '../../Components/NativeBase'
import CustomHeaderType from '../../Components/CustomHeaderType'
import Fonts from '../../Constants/Fonts'
import CustomTextInput from '../../Components/CustomTextInput'
import CustomButton from '../../Components/CustomButton'
import ViewItem from '../../Components/ViewItem'
import CustomDrawerHeaderBack from '../../Components/CustomDrawerHeaderBack'
import { StackActions, useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import CustomViewItem from '../../Components/CustomViewItem'
import moment from 'moment'
import InitialDetails from './InitialDetails'
const ViewTravelItineray = props => {

    const dispatch = useDispatch();
    const charter_id = props.route.params?.charter_id;
    const driverId = useSelector(state => state.userReducer.id);
    const [showInitial, setShowInitial] = useState(false)
    const [showFinal, setShowFinal] = useState(false)

    console.log(charter_id, driverId);

    useFocusEffect(
        useCallback(() => {
            fetchCharterDetail();
        }, []),
    );

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

    function tConvert(time) {
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            time = time.slice(1);
            time[5] = +time[0] < 12 ? 'AM' : 'PM';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }

    const fetchCharterDetail = async () => {
        var FormData = require('form-data');
        var data = new FormData();
        data.append('API_KEY', 'REDACTED_API_KEY');
        data.append('driver_id', driverId);
        data.append('charter_id', charter_id);

        var config = {
            method: 'post',
            url:
                'https://fticoachcharters.com/api/driver/get_charter_detail',
            data: data,
        };

        try {
            const res = await axios(config);
            if (res.data.Status) {
                console.log(res.data.data[0]);

                setMainData(res.data.data[0]);
                setLoading(false);
            } else {
                if (res.data.Message == 'deacivated') {
                    logout();
                } else {
                    setLoading(false);
                    setMainData({});
                }
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            Toast.show('Something thing went wrong please try later');
        }
    };
    const _openMap=(fullAddress)=>{
        const url = Platform.select({
            ios: `maps://app?daddr=${fullAddress}`,
            android: `google.navigation:q=${fullAddress}`,
          })
        Linking.openURL(url)
      }
    const [pickupPoints, setPickupPoints] = useState([]);
    const [nav, setNav] = useState(true);
    const [mainData, setMainData] = useState({});
    const [loading, setLoading] = useState(true);

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

    const checkLabel = index => {
        if (index == 0) {
            return 'First Pickup';
        } else if (index == 1) {
            return 'Second Pickup';
        } else if (index == 2) {
            return 'Third Pickup';
        } else if (index == 3) {
            return 'Fourth Pickup';
        } else if (index == 4) {
            return 'Fifth Pickup';
        } else if (index == 5) {
            return 'Sixth Pickup';
        } else if (index == 6) {
            return 'Seventh Pickup';
        } else if (index == 7) {
            return 'Eighth Pickup';
        } else if (index == 8) {
            return 'Nineth Pickup';
        } else if (index == 9) {
            return '10th Pickup';
        }
    };

    const checkDestination = index => {
        if (index == 0) {
            return 'First Destination';
        } else if (index == 1) {
            return 'Second Destination';
        } else if (index == 2) {
            return 'Third Destination';
        } else if (index == 3) {
            return 'Fourth Destination';
        } else if (index == 4) {
            return 'Fifth Destination';
        } else if (index == 5) {
            return 'Sixth Destination';
        } else if (index == 6) {
            return 'Seventh Destination';
        } else if (index == 7) {
            return 'Eighth Destination';
        } else if (index == 8) {
            return 'Nineth Destination';
        } else if (index == 9) {
            return '10th Destination';
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
            <View style={styles.screen}>
                {/* STATUS BAR  */}
                <StatusBar backgroundColor="#223F9A" barStyle="light-content" />

                <CustomDrawerHeaderBack
                    title="Charter Details"
                    action={() => props.navigation.goBack()}
                    calaction={() => props.navigation.navigate('CalendarScreen')}
                    goHome={() => {
                        props.navigation.dispatch(StackActions.popToTop());
                    }}
                />

                {mainData.client_detail && mainData.client_detail.client_name ? (
                    <Container style={{ flex: 1 }}>
                        <Content
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: hp('3%'),
                                    marginBottom: hp('1%'),
                                }}>
                                <View
                                    style={{
                                        width: '15%',
                                        height: 1,
                                        backgroundColor: '#E9EFF7',
                                    }}></View>
                                <Text
                                    style={{
                                        fontFamily: Fonts.Poppins_SemiBold,
                                        fontSize: hp(2.5),
                                        marginHorizontal: 10,
                                        maxWidth: '70%',
                                    }}>
                                    Customer Detail
                                </Text>
                                <View
                                    style={{
                                        width: '100%',
                                        height: 2,
                                        backgroundColor: '#E9EFF7',
                                    }}></View>
                            </View>

                            <View style={{ padding: 20 }}>
                                <View>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label="Chartering Party Name"
                                        value={
                                            mainData.client_detail.client_name
                                                ? mainData.client_detail.client_name
                                                : ''
                                        }
                                    />
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label="Customer Name"
                                        value={mainData.client_detail.client_name}
                                    />
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label="Contact Number"
                                        value={mainData.client_detail.contact_cell_phone}
                                    />
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label="Alternative Contact Name"
                                        value={mainData.client_detail.alt_contact_name}
                                    />
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label="Alternative Contact Number"
                                        value={mainData.client_detail.alt_contact_cell_phone}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 20,
                                }}>
                                <View
                                    style={{
                                        width: '15%',
                                        height: 2,
                                        backgroundColor: '#E9EFF7',
                                    }}></View>
                                <Text
                                    style={{
                                        fontFamily: Fonts.Poppins_SemiBold,
                                        fontSize: hp(2.5),
                                        marginHorizontal: 10,
                                        maxWidth: '70%',
                                    }}>
                                    Trip Details
                                </Text>
                                <View
                                    style={{
                                        width: '100%',
                                        height: 1,
                                        backgroundColor: '#E9EFF7',
                                    }}></View>
                            </View>

                            <View style={{ padding: 20 }}>
                                <View style={{ marginTop: 10 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label="Gratuity"
                                        value={`$ ${mainData.gratuity ? mainData.gratuity : 1}`}
                                    />
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label="Office Reporting Time"
                                        value={tConvert(mainData.office_reporting_time.slice(0, 5))}
                                    />
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label={`Departure Date & Time`}
                                        value={`${moment(mainData.departure_date).format(
                                            'dddd,MMMM Do YYYY',
                                        )}, ${tConvert(mainData.departure_time.slice(0, 5))}`}
                                    />
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <CustomViewItem
                                        color="#223F9A"
                                        label={`Return Date & Time`}
                                        value={`${moment(mainData.return_date).format(
                                            'dddd,MMMM Do YYYY',
                                        )}, ${tConvert(mainData.return_time.slice(0, 5))}`}
                                    />
                                </View>

                                {mainData.pickup_points.length != 0
                                    ? mainData.pickup_points.map((data, index) => {
                                        return (
                                            <View key={index}>
                                                <View style={styles.container}>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.Poppins_Regular,
                                                            fontSize: hp(2),
                                                        }}>
                                                        {checkLabel(index)}
                                                    </Text>
                                                    {index == 0 ? (
                                                        <Text style={styles.spotTimeText}>
                                                            Spot time:{' '}
                                                            <Text style={{ color: '#223F9A' }}>
                                                                {tConvert(
                                                                    mainData.client_report_time.slice(0, 5),
                                                                )}
                                                            </Text>
                                                        </Text>
                                                    ) : null}
                                                </View>

                                                <Text
                                                    style={{
                                                        marginTop: hp('4%'),
                                                        fontSize: hp(2),
                                                        fontFamily: Fonts.Poppins_Regular,
                                                        width: '100%',
                                                    }}>
                                                    Departure:{' '}
                                                    <Text
                                                    onPress={()=>_openMap(data.pickup_location)}
                                                    style={{ color: '#223F9A' }}>
                                                        {data.pickup_location}
                                                    </Text>
                                                </Text>

                                                <View style={{ marginTop: 30 }}>
                                                    <CustomViewItem
                                                        color="#223F9A"
                                                        label={`Departure Date & Time`}
                                                        value={`${moment(data.departure_date).format(
                                                            'dddd,MMMM Do YYYY',
                                                        )}, ${tConvert(data.departure_time.slice(0, 5))}`}
                                                    />
                                                </View>
                                            </View>
                                        );
                                    })
                                    : null}

                                {mainData.destination_points.length != 0
                                    ? mainData.destination_points.map((data, index) => {
                                        return (
                                            <View key={index}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                        marginTop: hp('4%'),
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.Poppins_Regular,
                                                            fontSize: hp(2),
                                                        }}>
                                                        {checkDestination(index)}
                                                    </Text>
                                                </View>
                                                <Text
                                                  onPress={()=>_openMap(data.destination)}
                                                    style={{
                                                        marginTop: hp('4%'),
                                                        fontSize: hp(2),
                                                        fontFamily: Fonts.Poppins_Regular,
                                                        width: '100%',
                                                    }}>
                                                    Destination:{' '}
                                                    <Text style={{ color: '#223F9A' }}>
                                                        {data.destination}
                                                    </Text>
                                                </Text>
                                                <View style={styles.divider}></View>
                                            </View>
                                        );
                                    })
                                    : null}

                                <Text
                                    style={{
                                        fontFamily: Fonts.Poppins_Regular,
                                        fontSize: hp(2),
                                        color: '#797979',
                                        marginTop: hp('4%'),
                                    }}>
                                    Other Note
                                </Text>

                                <Text
                                    style={{
                                        fontSize: hp(1.7),
                                        fontFamily: Fonts.Poppins_Regular,
                                        color: '#223F9A',
                                        width: '100%',
                                        marginTop: hp('2.5%'),
                                    }}>
                                    {mainData.note}
                                </Text>


                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 20,
                                    }}>
                                    {/* <View
                                        style={{
                                            width: '15%',
                                            height: 2,
                                            backgroundColor: '#E9EFF7',
                                        }}></View> */}
                                    <Text
                                        onPress={() => setShowInitial(!showInitial)}
                                        style={{
                                            fontFamily: Fonts.Poppins_SemiBold,
                                            fontSize: hp(2.5),
                                            marginHorizontal: 10,
                                            maxWidth: '70%',
                                        }}>
                                        Initial Details
                                    </Text>
                                    <View
                                        style={{
                                            width: '100%',
                                            // height: 1,
                                            backgroundColor: '#E9EFF7',
                                            flex: 1
                                        }}>

                                    </View>
                                    {
                                        !showInitial ?
                                            <Icon
                                                onPress={() => setShowInitial(!showInitial)}
                                                name={'keyboard-arrow-down'}
                                                type={'MaterialIcons'}
                                            /> :
                                            <Icon
                                                onPress={() => setShowInitial(!showInitial)}
                                                name={'keyboard-arrow-up'}
                                                type={'MaterialIcons'}
                                            />
                                    }

                                </View>
                                {/* intial details */}
                                {
                                    showInitial &&
                                    <>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Starting Milage"
                                                value={mainData.starting_mileage}
                                            />
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Time"
                                                value={mainData.start_time}
                                            />
                                        </View>

                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Bus Number"
                                                value={mainData.coach_number}
                                            />
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Driver Temperature"
                                                value={mainData.driver_temperature}
                                            />
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Passenger Count"
                                                value={mainData.no_of_passenger}
                                            />
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Covid symptom"
                                                value={mainData.COVID_symptom==0?'NO':'YES'}
                                            />
                                        </View>
                                    </>
                                }
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 20,
                                    }}>
                                    {/* <View
                                        style={{
                                            width: '15%',
                                            height: 2,
                                            backgroundColor: '#E9EFF7',
                                        }}></View> */}
                                    <Text
                                        onPress={() => setShowFinal(!showFinal)}

                                        style={{
                                            fontFamily: Fonts.Poppins_SemiBold,
                                            fontSize: hp(2.5),
                                            marginHorizontal: 10,
                                            maxWidth: '70%',
                                        }}>
                                        Final Details
                                    </Text>
                                    <View
                                        style={{
                                            width: '100%',
                                            // height: 1,
                                            backgroundColor: '#E9EFF7',
                                            flex: 1
                                        }}>

                                    </View>
                                    {
                                        !showFinal ?
                                            <Icon
                                                onPress={() => setShowFinal(!showFinal)}
                                                name={'keyboard-arrow-down'}
                                                type={'MaterialIcons'}
                                            /> :
                                            <Icon
                                                onPress={() => setShowFinal(!showFinal)}
                                                name={'keyboard-arrow-up'}
                                                type={'MaterialIcons'}
                                            />
                                    }

                                </View>
                                {
                                    showFinal &&
                                    <>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Ending Milage"
                                                value={mainData.end_mileage}
                                            />
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Time"
                                                value={mainData.end_time}
                                            />
                                        </View>

                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Bus Number"
                                                value={mainData.coach_number}
                                            />
                                        </View>

                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Total Work Time"
                                                value={mainData.total_work_time}
                                            />
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <CustomViewItem
                                                color="#223F9A"
                                                label="Mileage Difference"
                                                value={mainData.mileage_difference}
                                            />
                                        </View>
                                    </>
                                }

                                <TouchableOpacity
                                    onPress={() => {
                                        props.navigation.navigate('ViewAttach', { fuel_bills: mainData.fuel_bills, hotel_bills: mainData.hotel_bills, driver_sign: mainData.driver_signature });
                                    }}
                                    style={{
                                        borderColor: '#223F9A',
                                        borderWidth: 1,
                                        borderRadius: 6,
                                        marginTop: 40,
                                        height: hp('8%'),
                                        borderStyle: 'dashed',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.Poppins_SemiBold,
                                            fontSize: hp(2),
                                            color: '#223F9A',
                                        }}>
                                        View Attachments
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Content>
                    </Container>
                ) : (

                    <View style={{ justifyContent: 'center', flex: 1 }}><Text style={{ justifyContent: 'center', textAlign: 'center' }}>No Data</Text></View>

                )}

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
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
    },
    spotTimeText: {
        fontFamily: Fonts.Poppins_Regular,
        fontSize: hp(2),
    },
    divider: {
        backgroundColor: '#E9EFF7',
        height: 1,
        width: '100%',
        marginTop: 7,
    },
});

export default ViewTravelItineray