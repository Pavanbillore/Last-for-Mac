import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Vibration,
  ImageBackground,
  Alert,
  TextInput
} from 'react-native';
import { COLORS } from '../styles/GlobalColor';
import GlobalAwesomeAlert from '../components/GlobalAwesomeAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const listWidth = deviceWidth - 60;

const Home = ({ navigation, route }) => {
  const [isInititalEmailALert, setInititalEmailALert] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setmessage] = useState('');
  const [visibleAlert, setShowAlert] = useState(false);
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  useEffect(() => {
    onShare();
  }, []);
  const onShare = async () => {
    try {
      if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const grantedwrite = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (
          granted === PermissionsAndroid.RESULTS.GRANTED &&
          grantedwrite === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Read permission accepted');
        } else {
          console.log('Read permission denied');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  {
    /* Alert */
  }
  function showAlert() {
    setShowAlert(true);
  }

  hideAlert = () => {
    setShowAlert(false);
  };

  {
    /* Functions */
  }
  const getData = async () => {
    try {
      let value = await AsyncStorage.getItem('alreadyLaunched');
      console.log('value home::' + value);

      let valueIntitial = await AsyncStorage.getItem('emailInitial');
      console.log('value Intitial home::' + valueIntitial);

      if (valueIntitial == '' || valueIntitial == null) {
        console.log('value Intitial home inside if');
        AsyncStorage.setItem('emailInitial', 'true');
        setInititalEmailALert(true);
      } else if (valueIntitial == 'true') {
        console.log('value Intitial home inside else if');
        setInititalEmailALert(true);
      } else {
        console.log('value Intitial home inside else');
        setInititalEmailALert(false);
      }
    } catch (e) {
      console.log('Error in local storage: ' + e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      () => {
        getData();
      },
      [navigation],
    );

    return unsubscribe;
  }, [navigation]);

  const callSubscriptionApi = () => {
    var details = {
      email: email,
      device_id: 'xyzabc123980',
      platform_name: Platform.OS === 'ios' ? 'ios' : 'android',
      app_name: 'last',
    };
    console.log('details:::::' + details);

    fetch('http://44.195.249.110/api/subscriptions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        device_id: 'xyzabc123980',
        platform_name: Platform.OS === 'ios' ? 'ios' : 'android',
        app_name: 'last',
      }),
    })
      .then(response => response.json())
      .then(response => {
        AsyncStorage.setItem('emailInitial', 'false');
        console.log('response for Subscription Api: ' + response);
      })
      .catch(function (error) {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
        throw error;
      });
  };

  {
    /* Button Container*/
  }
  const clickOnInfoButton = () => {
    navigation.navigate('InfoScreen');
  };

  const clickOnBeginButton = () => {
    global.pdfdata.eventstart_time = new Date();
    navigation.navigate('BeginScreen');
  };

  const onSkipButtonClicked = () => {
    AsyncStorage.setItem('emailInitial', 'false');
    setInititalEmailALert(false);
  };

  const onContinueEmailClicked = () => {
    if (email.length == 0) {
      setmessage('Please enter your registered email address');
      showAlert();
    } else if (reg.test(email) === false) {
      setmessage('Incorrect email address');
      showAlert();
    } else {
      callSubscriptionApi();
      setInititalEmailALert(false);
    }
  };


  return (
    <SafeAreaProvider style={styles.container} mode="margin">
      <StatusBar barStyle={'dark-content'} />
      <ImageBackground
        style={styles.container}
        source={require('../images/bgImage.png')}>
        {/* Nav Container */}
        <View style={styles.navContainer}>
          <View></View>
          <View style={styles.viewLeftTopContainer}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.rightTopButton}
                onPress={clickOnInfoButton}>
                <Image source={require('../images/info.png')} />
              </TouchableOpacity>
            </View>
        </View>
        <Text style={styles.mainText}>Local Anesthetic Systemic Toxicity Algorithm 4.0</Text>
        {/* Main Container*/}
        <View style={styles.mainContainer}>
        <View style={styles.asraLogoContainer}>
            <Image
              source={require('../images/asra-last_splash.png')}
              style={styles.asraLogo}
            />
            <Text style={styles.beginText}>BEGIN L.A.S.T</Text>

            <TouchableOpacity
              rippleColor="rgba(0, 0, 0, .32)"
              style={styles.pressButton}
              onPress={clickOnBeginButton}>
              <Text style={styles.pressText}>Press To Start</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
              The information provided is based on published data and expert
              opinion. It is to be used as a recommendation only. Clinical
              judgement by a physician is required in every situation. User
              assumes all responsibility for decisions made in concert with the
              use of this app.
            </Text>
          </View>
        </View>
        {isInititalEmailALert ? (
          <View position="absolute" style={styles.popUpBgViews}>
            <View style={styles.popUpSmallBgs}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => onSkipButtonClicked()}>
                <Image
                  source={require('../images/cancel.png')}
                  style={styles.popUpCloses}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.popUpMainHeaders}>
                To receive automatic updates and alerts, please enter the email
                address associated with the account used to download the app.
              </Text>

              {/* Your Email Id */}
              <View style={styles.listViewConatiners}>
                <Text style={styles.listViewTexts}>Email ID:</Text>
                <TextInput
                  style={styles.textInputStyles}
                  value={email}
                  onChangeText={email => setEmail(email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  secureTextEntry={false}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  maxLength={30}
                  placeholder="Please enter your email address"
                  color="black"
                  placeholderTextColor="gray"
                />
                <View
                  style={[
                    styles.viewDividers,
                    {backgroundColor: COLORS.TextLightGrayColor},
                  ]}></View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.popUpPinkButtons,
                  {
                    backgroundColor: COLORS.BackgroundColorPink,
                    marginTop: 30,
                  },
                ]}
                onPress={() => onContinueEmailClicked()}>
                <Text style={[styles.popUpButtonTexts, {color: 'white'}]}>
                  Continue
                </Text>
              </TouchableOpacity>

              {/* Skip Button */}
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.popUpPinkButtons,
                  {backgroundColor: 'transparent', marginTop: 0},
                ]}
                onPress={() => onSkipButtonClicked()}>
                <Text style={styles.popUpButtonTexts}>Skip</Text>
              </TouchableOpacity>

              <View style={styles.dangerContainers}>
                <Image
                  source={require('../images/alert.png')}
                  style={styles.checkedUncheckeds}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontStyle: 'italic',
                    color: 'black',
                    fontWeight: 'normal',
                  }}>
                  Skipping this, you will not receive automatic updates or
                  service alerts.
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </ImageBackground>
    </SafeAreaProvider>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  asraLogoContainer: {
    width: deviceWidth,
    height: Platform.OS === 'ios' ? deviceHeight - 240 : deviceHeight - 200,
    flexDirection: 'column',
    alignItems: 'center',
  },

  asraLogo: {
    width:200,
    height: 140,
    marginTop: Platform.OS === 'ios' ? 60 : 80,
    resizeMode: 'contain',
    borderRadius:20
  },

  beginText: {
    color: '#7D9BE1',
    fontSize: Platform.OS === 'ios' ? 45 : 40,
    fontWeight: 'bold',
    textAlign: 'center',
    width: deviceWidth,
    marginTop: 25,
  },

  pressButton: {
    width: 200,
    height: 50,
    backgroundColor: COLORS.BackgroundColorPink,
    marginTop: Platform.OS === 'ios' ? 60 : 80,
    borderRadius: 25,
    justifyContent: 'center',
  },

  pressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  bottomText: {
    color: '#7D9BE1',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop:Platform.OS === 'ios' ? 60 : 80,
  },
  navContainer: {
    width: deviceWidth,
    height: Platform.OS === 'ios' ? 90 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:10
  },

  viewLeftTopContainer: {
    width: 100,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    alignItems:"flex-end",
    textAlign:"right",
    marginLeft:-10,
    marginBottom:10
  },

  leftTopButton: {
    width: 80,
    height: 25,
    flexDirection: 'row',
  },

  leftTopImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  leftTopTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 10,
  },

  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  rightTopButton: {
    width: 25,
    height: 25,
    marginTop: 10,
    marginRight: 15,
  },
  mainContainer: {
    height: Platform.OS === 'ios' ? deviceHeight - 175 : deviceHeight - 80,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    alignItems: 'center',
  },

  listViewContainer: {
    height: 80,
    width: listWidth,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
    elevation: 10,
  },

  listViewButton: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },

  listViewText: {
    fontWeight: '500',
    marginLeft: 15,
    color: COLORS.PopUpTextBlueColor,
  },

  checkedUnchecked: { height: 20, width: 20, marginLeft: 20, marginRight: 10 },

  pinkButtonBGStyle: {
    width: 55,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    alignSelf: 'flex-start',
  },

  popUpBullet: {
    fontSize: 9,
    fontWeight: '400',
    alignSelf: 'center',
    color: COLORS.PopUpTextBlueColor,
    marginLeft: 15,
    marginTop: 5,
  },

  popUpBgView: {
    backgroundColor: COLORS.BlackHalfAlpha,
    width: deviceWidth,
    height: deviceHeight,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  popUpSmallBg: {
    backgroundColor: COLORS.BackgroundColor,
    width: deviceWidth - 60,
    borderRadius: 10,
  },

  popUpMainHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 30,
    color: COLORS.BackgroundColorPink,
  },

  popUpTitle: {
    fontSize: 15,
    textAlign: 'left',
    marginHorizontal: 30,
    color: 'black',
  },

  popUpButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },

  popUpClose: {
    width: 20,
    height: 20,
    marginTop: 20,
    marginRight: 20,
    alignSelf: 'flex-end',
  },

  bottomContainer: {
    width: deviceWidth,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popUpLastOkButton: {
    height: 55,
    marginTop: 20,
    marginHorizontal: 50,
    borderRadius: 30,
    backgroundColor: COLORS.PopUpTextBlueColor,
  },
  bottomButton: {
    flexDirection: 'row',
    height: 50,
    width: 100,
    alignItems: 'center',
  },
  popUpSmallLastBg: {
    backgroundColor: COLORS.BackgroundColor,
    width: 360,
    height: Platform.OS === 'ios' ? 410 : 415,
    borderRadius: 10,
  },

  radioContainer: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginHorizontal: 10,
  },

  radioActiveInActive: {
    height: 25,
    width: 25,
    marginLeft: 20,
  },

  popUpPinkButton: {
    height: 55,
    marginHorizontal: 50,
    borderRadius: 30,
    backgroundColor: COLORS.BackgroundColorPink,
  },

  popUpBgViews: {
    backgroundColor: COLORS.BlackHalfAlpha,
    width: deviceWidth,
    height: deviceHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  popUpSmallBgs: {
    height: 450,
    width: deviceWidth - 40,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  popUpMainHeaders: {
    fontSize: 14,
    marginHorizontal: 25,
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },

  popUpTitles: {
    fontSize: 15,
    textAlign: 'left',
    marginHorizontal: 30,
  },

  popUpButtonTexts: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },

  popUpCloses: {
    width: 15,
    height: 15,
    marginTop: 25,
    marginRight: 30,
    alignSelf: 'flex-end',
  },

  listViewConatiners: {
    width: deviceWidth - 40,
    marginTop: 30,
    flexDirection: 'column',
  },

  listViewTexts: {
    fontWeight: '500',
    marginLeft: 30,
    fontSize: 12,
    color: COLORS.TextDarkGrayColor,
    width: deviceWidth - 90,
  },

  textInputStyles: {
    width: deviceWidth - 90,
    height: Platform.OS === 'ios' ? 30 : 40,
    fontSize: 12,
    marginTop: 15,
    marginHorizontal: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
  },

  viewDividers: {
    height: 1,
    width: deviceWidth - 90,
    backgroundColor: COLORS.PowderBlueColor,
    marginTop: 5,
    marginHorizontal: 25,
  },

  popUpPinkButtons: {
    height: 50,
    width: deviceWidth - 90,
    marginHorizontal: 25,
  },

  dangerContainers: {
    width: deviceWidth - 40,
    height: 50,
    backgroundColor: COLORS.BackgroundYellowColor,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },

  checkedUncheckeds: {height: 15, width: 15, marginLeft: 10, marginRight: 5},


  
});