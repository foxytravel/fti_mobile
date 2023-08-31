import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    Modal,
    Pressable,
    Alert,
} from 'react-native';
import { Container, Content, Icon } from 'native-base';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { GetAuth, GetUserId } from '../../Redux/UserDetails';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../../Constants/Fonts';
import CustomDrawerHeaderBack from '../../Components/CustomDrawerHeaderBack';
import { StackActions } from '@react-navigation/native';

const ViewAttach = props => {
    const dispatch = useDispatch();
    const charter_id = props.route.params.charter_id;
    const hotel_bills = props.route.params.hotel_bills;
    const fuel_bills = props.route.params.fuel_bills;
    const driver_sign = props.route.params.driver_sign;
    const driverId = useSelector(state => state.userReducer.id);
    const [documents, setDocuments] = useState([]);
    const [image,setImage]=useState('')
    useEffect(() => {
        console.log('>>>', driver_sign);

    }, []);
    const [modalVisible, setModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const showFile = fileUrl => {
        const ext = fileUrl.split(/[#?]/)[0].split('.').pop().trim();
        return new Promise((resolve, reject) => {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: ext,
            })
                .fetch('GET', fileUrl)
                .then(res => {
                    console.log('The file saved to ', res.path());
                    const downloadFile =
                        Platform.OS === 'android'
                            ? 'file://' + res.path()
                            : '' + res.path();
                    setTimeout(() => {
                        FileViewer.open(downloadFile, {
                            showOpenWithDialog: true,
                            showAppsSuggestions:true,
                            onDismiss: () => RNFetchBlob.fs.unlink(res.path()),
                        });
                    }, 350);
                    resolve(true);
                })
                .catch(err => {
                    console.log('err',err);
                    reject(err);
                });
        });
    };
    const showPhoto = () => {
        return (
            

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                ><Pressable 
                style={{flex:1}}
                onPress={()=>setModalVisible(false)}
                >
                    <View style={{flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,.7)'}}>
                        {/* <Icon
                        style={{alignSelf:'flex-end',marginHorizontal:20, color:'white', fontSize:30}}
                        name={'cross'}
                        type={'Entypo'}
                        onPress={()=>setModalVisible(false)}
                        /> */}
                        <Pressable onPress={()=>setModalVisible(false)}>
                        <Image
                            style={{width:'90%', height:Dimensions.get('screen').height-50, alignSelf:"center", resizeMode:'contain'}}
                            source={{uri:image}}
                            />
                        </Pressable>
                           
                    </View>
            </Pressable>

              </Modal>

        );
    }
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
    const driver = () => {

return(

    <Image
    source={{uri:"https://fticoachcharters.com/"+driver_sign}}
    style={{width:'100%', height:200, resizeMode:'contain'}}

    />
)

        // if (!driver_sign) return null
        // var file_name = driver_sign.file_path;
        // var extention = file_name?.split(".");
        // console.log(extention)
        // var img_ext = extention[1];
        // if (img_ext == 'jpg' || img_ext == "jpeg" || img_ext == "png") {
        //     return (
        //         <TouchableOpacity
        //         onPress={() => {
        //             setImage("https://fticoachcharters.com/" +driver_sign.file_path)
        //             setModalVisible(true)
        //         }} >
                

                
        //         <Image
        //             style={{ width: '90%', alignSelf: 'center', height: 200, marginVertical: 20 }}
        //             source={{ uri: "https://fticoachcharters.com/" + driver_sign.file_path }}
        //         />
        //         </TouchableOpacity>
        //     )
        // }
        // else {
        //     return (
        //         <TouchableOpacity
        //             onPressIn={() =>
        //                 showFile(
        //                     `https://fticoachcharters.com/${driver_sign.file_path}`,
        //                 )
        //             }
        //             onPress={() => { }}
        //             style={{
        //                 width: '100%',
        //                 marginBottom: hp('2%'),
        //                 height: hp('20%'),
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //                 borderWidth: 1,
        //                 borderColor: '#223F9A',
        //                 borderRadius: 10,
        //             }}>
        //             <Image
        //                 style={{
        //                     width: hp('10%'),
        //                     height: hp('10%'),
        //                     resizeMode: 'contain',
        //                 }}
        //                 source={require('../../Assets/Images/document.png')}
        //             />
        //             <Text
        //                 style={{
        //                     fontSize: hp(2),
        //                     fontFamily: Fonts.Poppins_Regular,
        //                     marginTop: 10,
        //                     paddingHorizontal: 10,
        //                 }}>

        //             </Text>
        //             <Text>{driver_sign.file_path.split('/')[driver_sign.file_path.split('/').length - 1]}</Text>
        //         </TouchableOpacity>
        //     )
        // }

    }
    function GetFilename(url) {
        if (url) {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1) {
                return m[1];
            }
        }
        return '';
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#223F9A' }}>
            {showPhoto()}
            <StatusBar backgroundColor="#223F9A" barStyle="light-content" />
            <View style={styles.screen}>
                {/* STATUS BAR  */}

                <CustomDrawerHeaderBack
                    number={15}
                    width={15}
                    height={15}
                    title="Documents"
                    action={() => props.navigation.goBack()}
                    // calaction={() => props.navigation.navigate('CalendarScreen')}
                    goHome={() => {
                        props.navigation.dispatch(StackActions.popToTop());
                    }}
                />

                {/* MAIN BODY  */}
                <Container style={{ flex: 1, padding: 20 }}>
                    <Content>
                        {
                            hotel_bills.length > 0 &&
                            <Text style={{ textAlign: 'center', fontSize: 20, fontFamily: Fonts.Poppins_Medium }}>Hotel Bills</Text>
                        }
                        {
                            hotel_bills.map((i, index) => {
                                var file_name = i.file_path;
                                var extention = file_name?.split(".");
                                var img_ext = extention[1];
                                console.log(img_ext, '-----')
                                if (img_ext == 'jpg' || img_ext == "jpeg" || img_ext == "png") {
                                    return (
                                        <TouchableOpacity onPress={() => {
                                            setImage("https://fticoachcharters.com/" + i.file_path)
                                            setModalVisible(true)
                                        }} key={index}>
                                            <Image
                                                style={{ width: '90%', alignSelf: 'center', height: 200, marginVertical: 20 }}
                                                source={{ uri: "https://fticoachcharters.com/" + i.file_path }}
                                            />
                                        </TouchableOpacity>
                                    )
                                }
                                else {
                                    return (
                                        <TouchableOpacity
                                            onPressIn={() =>
                                                showFile(
                                                    `https://fticoachcharters.com/${i.file_path}`,
                                                )
                                            }
                                            key={index}
                                            onPress={() => { }}
                                            style={{
                                                width: '100%',
                                                marginBottom: hp('2%'),
                                                height: hp('20%'),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: 1,
                                                borderColor: '#223F9A',
                                                borderRadius: 10,
                                            }}>
                                            <Image
                                                style={{
                                                    width: hp('10%'),
                                                    height: hp('10%'),
                                                    resizeMode: 'contain',
                                                }}
                                                source={require('../../Assets/Images/document.png')}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: hp(2),
                                                    fontFamily: Fonts.Poppins_Regular,
                                                    marginTop: 10,
                                                    paddingHorizontal: 10,
                                                }}>

                                            </Text>
                                            <Text>{i.file_path.split('/')[i.file_path.split('/').length - 1]}</Text>
                                        </TouchableOpacity>
                                    )

                                }
                            })
                        }
                        {
                            fuel_bills.length > 0 &&
                            <Text style={{ textAlign: 'center', fontSize: 20, fontFamily: Fonts.Poppins_Medium, marginVertical: 20 }}>Fuel Bills</Text>
                        }
                        {
                            fuel_bills.map((i, index) => {
                                var file_name = i.file_path;
                                var extention = file_name?.split(".");
                                var img_ext = extention[1];
                                console.log(img_ext, '-----')
                                if (img_ext == 'jpg' || img_ext == "jpeg" || img_ext == "png") {
                                    return (
                                        <TouchableOpacity onPress={() => {
                                            setImage("https://fticoachcharters.com/" + i.file_path)
                                            setModalVisible(true)
                                        }} key={index}>
                                            <Image
                                                style={{ width: '90%', alignSelf: 'center', height: 200, marginTop: 20 }}
                                                source={{ uri: "https://fticoachcharters.com/" + i.file_path }}
                                            />
                                        </TouchableOpacity>
                                    )
                                }
                                else {
                                    return (
                                        <TouchableOpacity
                                            onPressIn={() =>
                                                showFile(
                                                    `https://fticoachcharters.com/${i.file_path}`,
                                                )
                                            }
                                            key={index}
                                            onPress={() => { }}
                                            style={{
                                                width: '100%',
                                                marginBottom: hp('2%'),
                                                height: hp('20%'),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: 1,
                                                borderColor: '#223F9A',
                                                borderRadius: 10,
                                            }}>
                                            <Image
                                                style={{
                                                    width: hp('10%'),
                                                    height: hp('10%'),
                                                    resizeMode: 'contain',
                                                }}
                                                source={require('../../Assets/Images/document.png')}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: hp(2),
                                                    fontFamily: Fonts.Poppins_Regular,
                                                    marginTop: 10,
                                                    paddingHorizontal: 10,
                                                }}>

                                            </Text>
                                            <Text>{i.file_path.split('/')[i.file_path.split('/').length - 1]}</Text>
                                        </TouchableOpacity>
                                    )

                                }
                            })
                        }
                        {
                            fuel_bills.length > 0 &&
                            <Text style={{ textAlign: 'center', fontSize: 20, fontFamily: Fonts.Poppins_Medium, marginVertical: 10 }}>Driver Signature</Text>
                        }
                        {
                            driver()

                        }
                        {/* {documents.length == 0 ? (
                            <Text
                                style={{
                                    fontFamily: Fonts.Poppins_Medium,
                                    fontSize: hp(2),
                                }}>
                                Nothing To Show!
                            </Text>
                        ) : (
                            documents.map((data, index) => {
                                return (
                                    <TouchableOpacity
                                        onPressIn={() =>
                                            showFile(
                                                `https://fticoachcharters.com/${data.file_path}`,
                                            )
                                        }
                                        key={index}
                                        onPress={() => { }}
                                        style={{
                                            width: '100%',
                                            marginBottom: hp('2%'),
                                            height: hp('20%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: '#223F9A',
                                            borderRadius: 10,
                                        }}>
                                        <Image
                                            style={{
                                                width: hp('10%'),
                                                height: hp('10%'),
                                                resizeMode: 'contain',
                                            }}
                                            source={require('../../Assets/Images/document.png')}
                                        />
                                        <Text
                                            style={{
                                                fontSize: hp(2),
                                                fontFamily: Fonts.Poppins_Regular,
                                                marginTop: 10,
                                                paddingHorizontal: 10,
                                            }}>
                                            {GetFilename(
                                                `https://fticoachcharters.com/api/driver/get_charter_attachments/${data.file_path}`,
                                            )}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                        <TouchableOpacity
                            onPress={() => previewAttachment()}></TouchableOpacity> */}
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
    container: {
        marginTop: 10,
        height: 250,
        width: '100%',
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default ViewAttach;
