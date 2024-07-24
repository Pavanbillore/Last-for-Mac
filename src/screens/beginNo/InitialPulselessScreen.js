import React, {useState, useEffect,useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
  Alert
} from 'react-native';
import {COLORS} from '../../styles/GlobalColor';
import Voice from '@react-native-voice/voice';
var Sound = require('react-native-sound');
var whoosh;
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const listWidth = deviceWidth - 60;

const InitialPulselessScreen = ({navigation,timer, route}) => {
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
  const [isPulseAlert, setPulseAlert] = useState(false);
  const spinValue = new Animated.Value(0);
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

  const [isEndEventAlert, setEndEventAlert] = useState(false);
  const [weight, setWeight] = useState('');
  const [value, setValue] = useState(0);
  const [isButtonClicked, setButtonClicked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const [endeventpop, setendeventpop] = useState(false);
  const [isInitial, setInitial] = useState('0');
  const [isDeffered, setDeffered] = useState(false);
  const startCountdown = isChecked => {
    setChecked1(isChecked);
    setButtonClicked(isChecked);
    setRemainingTime(120); // 2 minutes in seconds
    setCounting(true);

    intervalRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setCounting(false); // Stop the countdown when it reaches 0 seconds
          clearInterval(intervalRef.current);
          // setendeventpop(true);
          return prevTime;
        }
      });
    }, 1000);

  }
  const [timerId, setTimerId] = useState(null);
  function setLoadData(weight, isDeffered, isInitial) {
    setWeight(weight);
    setDeffered(isDeffered);
    // setInitial(isInitial);
  }

  useEffect(() => {
    setValue(route.params.isRemainingTime);
    setLoadData(
      route.params.weight,
      route.params.isDeffered,
      route.params.isInitial,
    );
    setInitial(global.pdfdata.lipidimulsion);
    // console.log("passsed data -> ", global.pdfdata.lipidimulsion);
    const intervalId = setInterval(() => {
      // Update the value here. For example, increment it by 1 each second.
      setValue(prevValue => prevValue + 1);
    }, 1000); // 1000 milliseconds = 1 second
    const id = setTimeout(() => {
      Alert.alert(
        'Reassess?',
        'Would you like to reassess the patient`s pulse and rhythm or end this code event?',
        [
          {
            text: 'Reassess',
            // onPress: () => onBackClicked(),s
            style: 'cancel',
          },
          {
            text: 'End Events',
            onPress: () => onEndEventButtonClicked(),
            style: 'default',
          },
        ],
        {
          cancelable: false,
        },
      );
      timerPress();
    }, 120000);
    setTimerId(id);

    return () => {
      // Cleanup the interval when the component unmounts to avoid memory leaks.
      clearInterval(intervalId);
    };
  }, [timer]); // The empty dependency array ensures this effect runs only once.


  useEffect(() => {
    // setTimeout(() => {
    if (!isButtonClicked) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(spinValue, {
            toValue: 2,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
    // }, 120000);
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '6deg', '-5deg'],
  });


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
      if (!global.pdfdata.beginCPR) {
        setTimeout(() => whoosh.play(success => replaysound(success)), 2000);
      }

      console.log('successfully finished playing' + global.pdfdata.beginCPR);
    } else {
      console.log('playback failed due to audio decoding errors');
    }
  };

  const scaleAnimate = useRef(new Animated.Value(20)).current;
  const [seconds, setSeconds] = useState(5);
  const timerPress = () => {
    Sound.setCategory('Playback');
    whoosh = new Sound(
      require('../../images/begincpr.mp3'),
      // Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log(
          'duration in seconds: ' +
            whoosh.getDuration() +
            'number of channels: ' +
            whoosh.getNumberOfChannels(),
        );
        // Play the sound with an onEnd callback
        whoosh.play(success => replaysound(success));
      },
    );

    // animateElementIn();
    vibrationPress();
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimate, {
          toValue: 25,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnimate, {
          toValue: 20,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  };
  useEffect(() => {
    setTimeout(() => {
      timerPress();
    }, 3000);
  }, []);

  //  const spinValue = new Animated.Value(0);
  const animateElementIn = () => {
    Animated.timing(scaleAnimate, {
      toValue: 25,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };
  const animateElementOut = () => {
    Animated.timing(scaleAnimate, {
      toValue: 20,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  };
  const animationStyle = {
    width: scaleAnimate,
    height: scaleAnimate,
  };

  useEffect(() => {
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

  {
    /* Button Method */
  }
  const onBackClicked = () => {
    navigation.goBack();
  };

  const onNextClicked = () => {
    setPulseAlert(true);
  };

  const onCloseButtonClicked = () => {
    setPulseAlert(false);
  };
  const navigateToNoPulseScreen = () => {
    if(timerId){
      clearTimeout(timerId);
    }
    clearInterval(intervalRef.current);

    navigation.navigate('NoPulseScreen', {
      weight: '',
      isDeffered: false,
      isInitial: isInitial,
      isRemainingTime: value,
    });
    // setChecked1(false);
    // setChecked2(false);
    // setChecked3(false);
  };

  const onFirstButtonClicked = isChecked => {
    setChecked1(isChecked);
    isChecked == true
      ? isChecked2 == true
        ? isChecked3 == true
          ? navigateToNoPulseScreen()
          : ''
        : ''
      : '';
  };

  const onSecondButtonClicked = isChecked => {
    setChecked2(isChecked);
    isChecked == true
      ? isChecked1 == true
        ? isChecked3 == true
          ? navigateToNoPulseScreen()
          : ''
        : ''
      : '';
  };

  const onThirdButtonClicked = isChecked => {
    setChecked3(isChecked);
    isChecked == true
      ? isChecked2 == true
        ? isChecked1 == true
          ? navigateToNoPulseScreen()
          : ''
        : ''
      : '';
  };

  const onEndEventButtonClicked = () => {
    global.pdfdata.eventend_time = new Date();
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

  const onSkipClicked = () => {
    if(timerId){
      clearTimeout(timerId);
    }
    clearInterval(intervalRef.current);
    navigation.navigate('NoPulseScreen', {isRemainingTime: value});
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

          <Text style={{fontSize: 15, marginRight: 10, color: 'white'}}>
            {formattedValue}
          </Text>
        </View>

        <Text style={styles.mainText}>Initial Pulseless{'\n'}Management</Text>

        {/* Main Container*/}
        <View style={styles.mainContainer}>
          {/* List Container*/}

          {/* List 1 */}
          <View style={[styles.listViewContainer, {marginTop: 80}]}>
            <TouchableOpacity
              style={styles.listViewButton}
              onPress={() => {
                onFirstButtonClicked(!isChecked1);
                animateElementOut();
                startCountdown(!isChecked1);
                setButtonClicked(!isChecked1);
                Vibration.cancel();
                global.pdfdata.beginCPR = !isChecked1;
                global.pdfdata.beginCPR_time = new Date();
              }}>
                <Animated.Image
                source={
                  isChecked1
                    ? require('../../images/checkboxChecked.png')
                    : require('../../images/checkboxUnchecked.png')
                }
                style={[
                  styles.checkedUnchecked,
                  animationStyle,
                ]}></Animated.Image>
              <Text style={[styles.listViewText, {fontSize: 16}]}>
                BEGIN CPR
              </Text>
            </TouchableOpacity>
          </View>

          {/* List 2*/}
          <View style={[styles.listViewContainer, {marginTop: 20}]}>
            <TouchableOpacity
              style={styles.listViewButton}
              onPress={() => {
                onSecondButtonClicked(!isChecked2);
                global.pdfdata.airwaymanagement = !isChecked2;
                global.pdfdata.airwaymanagement_time = new Date();
              }}>
              <Image
                source={
                  isChecked2
                    ? require('../../images/checkboxChecked.png')
                    : require('../../images/checkboxUnchecked.png')
                }
                style={styles.checkedUnchecked}
              />
              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.listViewText, {fontSize: 16}]}>
                  Airway Management
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.popUpBullet}>{`\u25cf `}</Text>
                  <Text
                    style={[
                      styles.listViewText,
                      {fontSize: 10, marginLeft: 0, marginTop: 5},
                    ]}>
                    Ventilate with 100% Oxygen
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.popUpBullet}>{`\u25cf `}</Text>
                  <Text
                    style={[
                      styles.listViewText,
                      {fontSize: 10, marginLeft: 0, marginTop: 5},
                    ]}>
                    Consider Intubation
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* List 3*/}
          <View style={[styles.listViewContainer, {marginTop: 20}]}>
            <TouchableOpacity
              style={styles.listViewButton}
              onPress={() => {
                onThirdButtonClicked(!isChecked3);
                global.pdfdata.alertCPbypass = !isChecked3;
                global.pdfdata.alertCPbypass_time = new Date();
              }}>
              <Image
                source={
                  isChecked3
                    ? require('../../images/checkboxChecked.png')
                    : require('../../images/checkboxUnchecked.png')
                }
                style={styles.checkedUnchecked}
              />
              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.listViewText, {fontSize: 16}]}>
                  Alert - CP bypass may be needed
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[styles.popUpBullet, {bottom: 5}]}>{`\u25cf `}</Text>
                  <Text
                    style={[
                      styles.listViewText,
                      {fontSize: 10, marginLeft: 0, marginTop: 5},
                    ]}>
                    Alert the nearest facility having{'\n'}cardiopulmonary
                    bypass capability
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginLeft: -10,
              alignSelf: 'flex-start',
            }}>
            <Text
              style={[
                styles.listViewText,
                {
                  fontSize: 15,
                  marginTop: 2,
                },
              ]}>
              CPR Remaining:
            </Text>

            {/* <Text
              style={[
                styles.listViewText,
                {fontSize: 10, marginTop: 3, marginLeft: 5, fontWeight: 'bold'},
              ]}>
              2:00
            </Text> */}

            <Text
              style={[
                styles.listViewText,
                {
                  fontSize: 15,
                  marginTop: 3,
                  marginLeft: 5,
                  fontWeight: 'bold',
                },
              ]}>
              {`${String(Math.floor(remainingTime / 60)).padStart(
                2,
                '0',
              )}:${String(remainingTime % 60).padStart(2, '0')}`}
            </Text>
          </View>
          </View>

          {/* Bottom Button */}
          <View
            style={[
              styles.bottomContainer,
              {
                bottom: 67,
                height: 50,
                backgroundColor: COLORS.BackgroundYellowColor,
              },
            ]}>
            <TouchableOpacity
              style={[styles.bottomButton, {marginLeft: 15}]}
              onPress={() => onNextClicked()}>
              <Image
                source={require('../../images/reassess.png')}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
              <Text
                style={[styles.listViewText, {fontSize: 16, color: 'black'}]}>
                Reassess
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomButton, {marginRight: 30}]}
              onPress={() => onEndEventButtonClicked()}>
              <Text
                style={[
                  styles.listViewText,
                  {fontSize: 16, color: COLORS.TextRedColor},
                ]}>
                End Event
              </Text>
              <Image
                source={require('../../images/endEvent.png')}
                style={{height: 15, width: 15, marginLeft: 10}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Pink Button */}
        <View
          style={[
            styles.bottomContainer,
            {
              bottom: 0,
              height: 65,
              backgroundColor: COLORS.BackgroundColorPink,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              {
                marginLeft: 0,
                width: deviceWidth,
                justifyContent: 'center',
              },
            ]}
            onPress={() => onSkipClicked()}>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '500',
              }}>
              SKIP
            </Text>
          </TouchableOpacity>
        </View>


 {/* Pulse Alert */}
 {isPulseAlert ? (
          <View position="absolute" style={styles.popUpBgView}>
            <View style={[styles.popUpSmallLastBg, {height: 330}]}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onCloseButtonClicked}>
                <Image
                  source={require('../../images/cancel.png')}
                  style={styles.popUpClose}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.popUpMainHeader,
                  {textAlign: 'center', color: 'black', marginTop: 20},
                ]}>
                Does Patient{'\n'}Have a PULSE?
              </Text>

              <View
                style={[
                  styles.popUpLastOkButton,
                  {marginTop: 40, backgroundColor: COLORS.BackgroundColorPink},
                ]}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>setPulseAlert(false)}>
                  <Text style={[styles.popUpButtonText, {color: 'white'}]}>
                    YES
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.popUpLastOkButton}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>{
                    navigation.goBack()
                  }}>
                  <Text style={[styles.popUpButtonText, {color: 'white'}]}>
                    NO
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        {/* End Event Alert */}
        {isEndEventAlert ? (
          <View position="absolute" style={styles.popUpBgView}>
            <View
              style={[
                styles.popUpSmallBg,
                {height: Platform.OS === 'ios' ? 510 : 505},
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
                  {textAlign: 'left', marginTop: 10},
                ]}>
                End LAST Event?
              </Text>

              <Text style={[styles.popUpTitle, {marginTop: 35}]}>
              Continue monitoring for at least 2 hours after a limited CV event.
              </Text>

              <Text style={[styles.popUpTitle, {marginTop: 20}]}>
                Continue monitoring 2 hrs after a{'\n'}limited CNS event.
              </Text>

              <Text
                style={[
                  styles.popUpTitle,
                  {fontWeight: 'bold', fontSize: 16, marginTop: 35},
                ]}>
                Please select the correct option:
              </Text>

              <View>
                <TouchableOpacity
                  style={[styles.radioContainer, {marginTop: 10}]}
                  onPress={() => onPatientLabileClicked()}>
                  <Image
                    source={isPatientLabile}
                    style={styles.radioActiveInActive}
                  />

                  <View style={{flexDirection: 'column', marginLeft: 10}}>
                    <Text style={{fontSize: 15}}>Patient Labile</Text>
                    <Text
                      style={{fontSize: 10, fontWeight: 'bold', marginTop: 4}}>
                      (Transfer to ICU)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={[styles.radioContainer, {marginTop: 10}]}
                  onPress={() => onResuscitationClicked()}>
                  <Image
                    source={isResuscitation}
                    style={styles.radioActiveInActive}
                  />

                  <View style={{flexDirection: 'column', marginLeft: 10}}>
                    <Text style={{fontSize: 15}}>
                      Resuscitation Unsuccessful.
                    </Text>
                    <Text
                      style={{fontSize: 10, fontWeight: 'bold', marginTop: 4}}>
                      (Code was called)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={[styles.radioContainer, {marginTop: 10}]}
                  onPress={() => onPatientUnstableClicked()}>
                  <Image
                    source={isPatientUnstable}
                    style={styles.radioActiveInActive}
                  />

                  <View style={{flexDirection: 'row', marginLeft: 10}}>
                    <Text style={{fontSize: 15}}>Patient Unstable</Text>
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
                style={[styles.popUpPinkButton, {marginTop: 20}]}
                onPress={() => onCloseEndEventButtonClicked()}>
                <Text style={[styles.popUpButtonText, {color: 'white'}]}>
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
  },

  listViewText: {
    fontWeight: '500',
    marginLeft: 15,
    color: COLORS.PopUpTextBlueColor,
  },

  checkedUnchecked: {height: 20, width: 20, marginLeft: 20, marginRight: 10},

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
});
export default InitialPulselessScreen;
