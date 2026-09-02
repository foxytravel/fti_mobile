import React, {useState, useEffect} from 'react';
import { API_KEY } from '../../Config';
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
} from 'react-native';
import {Container, Content} from '../../Components/NativeBase';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {GetAuth, GetUserId} from '../../Redux/UserDetails';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../../Constants/Fonts';
import CustomDrawerHeaderBack from '../../Components/CustomDrawerHeaderBack';
import {StackActions} from '@react-navigation/native';

const ViewAttachment = props => {
  const dispatch = useDispatch();
  const charter_id = props.route.params.charter_id;
  const driverId = useSelector(state => state.userReducer.id);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    console.log('>>>', charter_id);
    fetchDocuments();
  }, [charter_id]);

  const [loading, setLoading] = useState(true);

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
              onDismiss: () => RNFetchBlob.fs.unlink(res.path()),
            });
          }, 350);
          resolve(true);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  };

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

  const fetchDocuments = async () => {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('API_KEY', API_KEY);
    data.append('driver_id', driverId);
    data.append('charter_id', charter_id);

    var config = {
      method: 'post',
      url:
        'https://fticoachcharters.com/api/driver/get_charter_attachments',
      data: data,
    };

    try {
      const res = await axios(config);
      if (res.data.Status) {
        setDocuments(res.data.data);
        setLoading(false);
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
      Toast.show('Something thing went wrong please try later');
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#223F9A'}}>
      <StatusBar backgroundColor="#223F9A" barStyle="light-content" />
      <View style={styles.screen}>
        {/* STATUS BAR  */}

        <CustomDrawerHeaderBack
          number={15}
          width={15}
          height={15}
          title="Documents"
          action={() => props.navigation.goBack()}
          calaction={() => props.navigation.navigate('CalendarScreen')}
          goHome={() => {
            props.navigation.dispatch(StackActions.popToTop());
          }}
        />

        {/* MAIN BODY  */}
        <Container style={{flex: 1, padding: 20}}>
          <Content>
            {documents.length == 0 ? (
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
                    onPress={() => {}}
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
              onPress={() => previewAttachment()}></TouchableOpacity>
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

export default ViewAttachment;
