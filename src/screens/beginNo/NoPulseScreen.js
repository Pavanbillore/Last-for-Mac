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
  ImageBackground,
  Animated
} from 'react-native';
import { COLORS } from '../../styles/GlobalColor';
import Voice from '@react-native-voice/voice';
var Sound = require('react-native-sound');
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var whoosh;
const listWidth = deviceWidth - 60;

const NoPulseScreen = ({ timer, navigation, route }) => {
  const [isEndEventAlert, setEndEventAlert] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const [counting, setCounting] = useState(false);
  const intervalRef = useRef(null);
  const [isPatientLabile, setPatientLabile] = useState(
    require('../../images/radioInactive.png'),
  );
  const [isResuscitation, setResuscitation] = useState(
    require('../../images/radioInactive.png'),
  );

  const [isPatientUnstable, setPatientUnstable] = useState(
    require('../../images/radioInactive.png'),
  );

  const [weight, setWeight] = useState('');
  const [isDeffered, setDeffered] = useState(false);
  const [isInitial, setInitial] = useState('0');
  const [value, setValue] = useState(0);

  const vibrationPress = () => {
    var ONE_SECOND_IN_MS = 1000;
    if (ONE_SECOND_IN_MS) {
      Vibration.vibrate(30 * ONE_SECOND_IN_MS);
      Voice.isAvailable();
    } else {
      Vibration.cancel();
    }
  };
  const replaysound = success => {
    if (success) {
      if (!global.pdfdata.continueCPR) {
        setTimeout(() => whoosh.play(success => replaysound(success)), 2000);
      }

      // console.log('successfully finished playing' + global.pdfdata.continueCPR);
    } else {
      console.log('playback failed due to audio decoding errors');
    }
  };
  const [endeventpop, setendeventpop] = useState(false);
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
  const [isChecked4, setChecked4] = useState(false);
  const startCountdown = isChecked => {
    setChecked1(isChecked);
    // setButtonClicked(isChecked);

    setTimeout(() => {
      if (!isRadioActive) {
        setSeizureAlert(true);
      } else {
        setSeizureAlert(false);
      }
    }, 10000);

    setRemainingTime(120); // 2 minutes in seconds
    setCounting(true);

    intervalRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setCounting(false); // Stop the countdown when it reaches 0 seconds
          clearInterval(intervalRef.current);
          setendeventpop(true);
          return prevTime;
        }
      });
    }, 1000);
  }

  function setLoadData(weight, isDeffered, isInitial, isRemainingTime) {
    setWeight(weight);
    setDeffered(isDeffered);
    // setInitial(isInitial);
    setValue(isRemainingTime);
    setInitial(global.pdfdata.lipidimulsion);
  }
  useEffect(() => {
    setLoadData(
      route.params.weight,
      route.params.isDeffered,
      route.params.isInitial,
      route.params.isRemainingTime,
    );
    console.log("no pulse screen data -> ", isInitial);
    const intervalId = setInterval(() => {
      // Update the value here. For example, increment it by 1 each second.
      setValue(prevValue => prevValue + 1);
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
      // Cleanup the interval when the component unmounts to avoid memory leaks.
      clearInterval(intervalId);
    };
  }, []); // The empty dependency array ensures this effect runs only once.

  // Convert the value to a "00:00" format
  const formattedValue = `${String(Math.floor(value / 60)).padStart(
    2,
    '0',
  )}:${String(value % 60).padStart(2, '0')}`;


  // console.log('initial value', isInitial);
  {
    /* Button Method */
  }
  const onBackClicked = () => {
    navigation.goBack();
  };

  // const initialData = {
  //   title: 'Asystole',
  //   initialCount: '0',
  // };


  const onAsystoleButtonClicked = () => {
    global.pdfdata.purpose = 'Asystole';
    // global.pdfdata.lipidimulsion=isInitial;
    // startCountdown(!isChecked1);
    navigation.navigate('AsystoleManagementScreen', {
      // data:initialData,
      weight: weight ? weight : global.pdfdata.weight,
      isDeffered: false,
      isInitial: isInitial,
      fromWhichScreen: 'Asystole',
      isRemainingTime: value,
    });
  };

  const onPeaButtonClicked = () => {
    global.pdfdata.purpose = 'Pea';
    // global.pdfdata.lipidimulsion=isInitial;
    navigation.navigate('AsystoleManagementScreen', {
      weight: weight ? weight : global.pdfdata.weight,
      isDeffered: false,
      isInitial: isInitial,
      fromWhichScreen: 'Pea',
      isRemainingTime: value,
    });
  };

  const onVtachButtonClicked = () => {
    global.pdfdata.purpose = 'Vtach';
    // global.pdfdata.lipidimulsion=isInitial;
    navigation.navigate('AsystoleManagementScreen', {
      weight: weight ? weight : global.pdfdata.weight,
      isDeffered: false,
      isInitial: isInitial,
      fromWhichScreen: 'Vtach',
      isRemainingTime: value,
    });
  };

  const onVfibButtonClicked = () => {
    global.pdfdata.purpose = 'Vfib';
    // global.pdfdata.lipidimulsion=isInitial;
    navigation.navigate('AsystoleManagementScreen', {
      weight: weight ? weight : global.pdfdata.weight,
      isDeffered: false,
      isInitial: isInitial,
      fromWhichScreen: 'Vfib',
      isRemainingTime: value,
    });
  };

  const onEndEventButtonClicked = () => {
    global.pdfdata.eventend_time = new Date();
    // global.pdfdata.lipidimulsion=isInitial;
    setEndEventAlert(true);
  };

  const onCloseEndEventButtonClicked = () => {
    setEndEventAlert(false);
    setPatientLabile(require('../../images/radioInactive.png'));
    setResuscitation(require('../../images/radioInactive.png'));
    setPatientUnstable(require('../../images/radioInactive.png'));
  };

  const onPatientLabileClicked = () => {
    setPatientLabile(require('../../images/radioActive.png'));
    setResuscitation(require('../../images/radioInactive.png'));
    setPatientUnstable(require('../../images/radioInactive.png'));

    const timeout = setTimeout(() => {
      navigation.navigate('GenerateReportScreen');
      setEndEventAlert(false);
      setPatientLabile(require('../../images/radioInactive.png'));
      setResuscitation(require('../../images/radioInactive.png'));
      setPatientUnstable(require('../../images/radioInactive.png'));
    }, 500);
  };

  const onResuscitationClicked = () => {
    setPatientLabile(require('../../images/radioInactive.png'));
    setResuscitation(require('../../images/radioActive.png'));
    setPatientUnstable(require('../../images/radioInactive.png'));

    const timeout = setTimeout(() => {
      navigation.navigate('GenerateReportScreen');
      setEndEventAlert(false);
      setPatientLabile(require('../../images/radioInactive.png'));
      setResuscitation(require('../../images/radioInactive.png'));
      setPatientUnstable(require('../../images/radioInactive.png'));
    }, 500);
  };

  const onPatientUnstableClicked = () => {
    setPatientLabile(require('../../images/radioInactive.png'));
    setResuscitation(require('../../images/radioInactive.png'));
    setPatientUnstable(require('../../images/radioActive.png'));

    const timeout = setTimeout(() => {
      navigation.navigate('GenerateReportScreen');
      setEndEventAlert(false);
      setPatientLabile(require('../../images/radioInactive.png'));
      setResuscitation(require('../../images/radioInactive.png'));
      setPatientUnstable(require('../../images/radioInactive.png'));
    }, 500);
  };

  return (
    <SafeAreaProvider style={styles.container} mode="margin">
      <StatusBar barStyle={'dark-content'} />
      <ImageBackground
        style={styles.container}
        source={require('../../images/bgImage.png')}>
        {/* Nav Container */}
        <View style={styles.navContainer}>
          <View style={styles.viewLeftTopContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.leftTopButton}
              rippleColor="rgba(0, 0, 0, .32)"
              onPress={() => onBackClicked()}>
              <Image
                source={require('../../images/back.png')}
                style={styles.leftTopImage}
              />
              <Text style={styles.leftTopTitle}>Pulse</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>
            {formattedValue}
          </Text>
        </View>

        <Text style={styles.mainText}>No Pulse:{'\n'}What is the Rhythm?</Text>

        {/* Main Container*/}
        <View style={styles.mainContainer}>
          {/* List Container*/}

          {/* List 1 */}
          <View style={[styles.listViewContainer, { marginTop: 80 }]}>
            <TouchableOpacity
              style={styles.listViewButton}
              onPress={() => {
                onAsystoleButtonClicked();
                global.pdfdata.asystoleRhythm = true;
                global.pdfdata.asystoleRhythm_time = new Date();
              }}>
              <Text style={[styles.listViewText, { fontSize: 16 }]}>
                Asystole
              </Text>
            </TouchableOpacity>
          </View>

          {/* List 2 */}
          <View style={[styles.listViewContainer, { marginTop: 20 }]}>
            <TouchableOpacity
              style={styles.listViewButton}
              onPress={() => {
                onPeaButtonClicked();
                global.pdfdata.peaRhythm = true;
                global.pdfdata.peaRhythm_time = new Date();
              }}>
              <Text style={[styles.listViewText, { fontSize: 16 }]}>PEA</Text>
            </TouchableOpacity>
          </View>

          {/* List 3*/}
          <View style={[styles.listViewContainer, { marginTop: 20 }]}>
            <TouchableOpacity
              style={styles.listViewButton}
              onPress={() => {
                onVtachButtonClicked();
                global.pdfdata.vtachRyhthm = true;
                global.pdfdata.vtachRyhthm_time = new Date();
              }}>
              <Text style={[styles.listViewText, { fontSize: 16 }]}>VTach</Text>
            </TouchableOpacity>
          </View>

          {/* List 4*/}
          <View style={[styles.listViewContainer, { marginTop: 20 }]}>
            <TouchableOpacity
              style={styles.listViewButton}
              onPress={() => {
                onVfibButtonClicked();
                global.pdfdata.vfibRhythm = true;
                global.pdfdata.vfibRhythm_time = new Date();
              }}>
              <Text style={[styles.listViewText, { fontSize: 16 }]}>VFib</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Button */}
          <View
            style={[
              styles.bottomContainer,
              {
                bottom: 0,
                height: 65,
                backgroundColor: COLORS.BackgroundYellowColor,
              },
            ]}>
            <TouchableOpacity
              style={[styles.bottomButton, { marginLeft: 15 }]}
            >
              <Image
                source={require('../../images/reassess.png')}
                style={{ height: 20, width: 20 }}
                resizeMode="contain"
              />
              <Text style={[styles.listViewText, { fontSize: 16 }]}>
                Reassess
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomButton, { marginRight: 30 }]}
              onPress={() => onEndEventButtonClicked()}>
              <Text
                style={[
                  styles.listViewText,
                  { fontSize: 16, color: COLORS.TextRedColor },
                ]}>
                End Event
              </Text>
              <Image
                source={require('../../images/endEvent.png')}
                style={{ height: 15, width: 15, marginLeft: 10 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* End Event Alert */}
        {isEndEventAlert ? (
          <View position="absolute" style={styles.popUpBgView}>
            <View
              style={[
                styles.popUpSmallBg,
                { height: Platform.OS === 'ios' ? 510 : 505 },
              ]}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => onCloseEndEventButtonClicked()}>
                <Image
                  source={require('../../images/cancel.png')}
                  style={styles.popUpClose}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.popUpMainHeader,
                  { textAlign: 'left', marginTop: 10 },
                ]}>
                End LAST Event?
              </Text>

              <Text style={[styles.popUpTitle, { marginTop: 35 }]}>
                Continue monitoring for at least 2 hours after a limited CV event.
              </Text>

              <Text style={[styles.popUpTitle, { marginTop: 20 }]}>
                Continue monitoring 2 hrs after a{'\n'}limited CNS event.
              </Text>

              <Text
                style={[
                  styles.popUpTitle,
                  { fontWeight: 'bold', fontSize: 16, marginTop: 35 },
                ]}>
                Please select the correct option:
              </Text>

              <View>
                <TouchableOpacity
                  style={[styles.radioContainer, { marginTop: 10 }]}
                  onPress={() => onPatientLabileClicked()}>
                  <Image
                    source={isPatientLabile}
                    style={styles.radioActiveInActive}
                  />

                  <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text style={{ fontSize: 15 }}>Patient Labile</Text>
                    <Text
                      style={{ fontSize: 10, fontWeight: 'bold', marginTop: 4 }}>
                      (Transfer to ICU)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={[styles.radioContainer, { marginTop: 10 }]}
                  onPress={() => onResuscitationClicked()}>
                  <Image
                    source={isResuscitation}
                    style={styles.radioActiveInActive}
                  />

                  <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text style={{ fontSize: 15 }}>
                      Resuscitation Unsuccessful.
                    </Text>
                    <Text
                      style={{ fontSize: 10, fontWeight: 'bold', marginTop: 4 }}>
                      (Code was called)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={[styles.radioContainer, { marginTop: 10 }]}
                  onPress={() => onPatientUnstableClicked()}>
                  <Image
                    source={isPatientUnstable}
                    style={styles.radioActiveInActive}
                  />

                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <Text style={{ fontSize: 15 }}>Patient Unstable</Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        marginTop: 4,
                        marginLeft: 2,
                      }}>
                      (CP Bypass Initiated)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.popUpPinkButton, { marginTop: 20 }]}
                onPress={() => onCloseEndEventButtonClicked()}>
                <Text style={[styles.popUpButtonText, { color: 'white' }]}>
                  Continue Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navContainer: {
    width: deviceWidth,
    height: Platform.OS === 'ios' ? 90 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  viewLeftTopContainer: {
    width: 100,
    height: 25,
    justifyContent: 'flex-start',
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    marginLeft: 15,
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
    justifyContent: 'center',
  },

  listViewText: {
    fontWeight: '500',
    marginLeft: 15,
    color: COLORS.PopUpTextBlueColor,
  },

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
    marginLeft: 20,
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
  },

  popUpButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  popUpSmallLastBg: {
    backgroundColor: COLORS.BackgroundColor,
    width: 360,
    height: Platform.OS === 'ios' ? 410 : 415,
    borderRadius: 10,
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

  bottomButton: {
    flexDirection: 'row',
    height: 50,
    width: 100,
    alignItems: 'center',
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
});
export default NoPulseScreen;
