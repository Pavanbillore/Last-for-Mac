import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ImageBackground,
  PermissionsAndroid,
  Alert
} from 'react-native';
import { COLORS } from '../styles/GlobalColor';
import Pdf from 'react-native-pdf';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const OriginalArticleScreen = ({ navigation, route }) => {
  const pdfUrl = { 
    uri: 'https://banter-curve.s3.us-west-1.amazonaws.com/original_article.pdf',
    cache: true 
  };


  return (
    <SafeAreaProvider style={styles.container} mode="margin">
      <StatusBar barStyle={'dark-content'} />

      <ImageBackground
        style={styles.container}
        source={require('../images/bgImage.png')}>
        {/* Nav Container */}
        <View style={styles.navContainer}>
          <View style={styles.leftNavView}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.leftTopButton}
              rippleColor="rgba(0, 0, 0, .32)"
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../images/back.png')}
                style={styles.leftNavImage}
              />
              <Text style={styles.leftTopTitle}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Container*/}
        <View
          style={{
            width: deviceWidth,
            height:
              Platform.OS === 'ios' ? deviceHeight - 90 : deviceHeight - 50,
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: COLORS.TextLightestGrayColor,
          }}>
          <Pdf
          trustAllCerts={false}
          ref={(pdf) => {pdf = pdf }}
            source={pdfUrl}
            onLoadComplete={(numberOfPages, filePath) => {
              // console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              // console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
              Alert.alert('Error', 'Failed to load the PDF file.');
            }}
            onPressLink={(uri) => {
              // console.log('Link pressed:', uri);
          }}
            style={styles.pdf}
          />
        </View>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containers: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  navContainer: {
    height: Platform.OS === 'ios' ? 90 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftNavView: {
    width: 70,
    height: 25,
    justifyContent: 'flex-start',
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    marginLeft: 15,
  },

  leftTopButton: {
    flexDirection: 'row',
  },

  leftNavImage: {
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
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
}
});

export default OriginalArticleScreen;
