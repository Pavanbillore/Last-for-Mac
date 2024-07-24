import React,{useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  Platform,
   PermissionsAndroid,
} from 'react-native';
import Navigation from './src/navigation/Navigation';
global.pdfdata = {};
const App = () => {
  const requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to read PDF files.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    } finally {
      console.log("Permission Granted")
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestExternalStoragePermission();
    } else {
      console.log("ERROR")
    }
  }, []);
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
