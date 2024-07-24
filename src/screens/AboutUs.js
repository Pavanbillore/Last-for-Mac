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
    Alert,
    ScrollView
} from 'react-native';
import { COLORS } from '../styles/GlobalColor';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const AboutUs = ({ navigation, route }) => {


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
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>About Us</Text>
                    </View>
                </View>

                {/* Main Container*/}
                <ScrollView
                    style={{
                        width: deviceWidth,
                        height:
                            Platform.OS === 'ios' ? deviceHeight - 90 : deviceHeight - 50,
                        // flexDirection: 'column',
                        // justifyContent: 'space-between',
                        backgroundColor: COLORS.TextLightestGrayColor,
                    }}>
                    <View>
                        <Image
                            source={require('../images/astra-splash-logo.png')}
                            style={styles.asraLogo}
                        />
                    </View>
                    <View>
                    <View style={styles.aboutAuthors}>
                        <Text style={styles.authorTitle}>2020 Guideline Authors</Text>
                    </View>
                    <View style={styles.lineview}></View>
                    <View style={styles.aboutContent}>
                        <Text style={styles.authorOne}>{'\u2023 '}Joseph M. Neal</Text>
                        <Text style={styles.authorOne}>{'\u2023 '}Erin J. Neal</Text>
                        <Text style={styles.authorOne}>{'\u2023 '}Guy L. Weinberg</Text>
                    </View>
                    <View style={styles.aboutAuthors}>
                        <Text style={styles.authorTitle}>Application Lead Developer</Text>
                    </View>
                    <View style={styles.lineview}></View>
                    <View style={styles.aboutContent}>
                        <Text style={styles.authorOne}>{'\u2023 '}Rajnish Gupta</Text>
                    </View>
                    </View>
                </ScrollView>
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
        // justifyContent: 'space-evenly',
        // marginHorizontal:10,
        // marginLeft:-70
    },
    asraLogo: {
        width: 200,
        height: 150,
        marginTop: 10,
        resizeMode: 'contain',
        alignSelf: "center"
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
    titleContainer: {

    },
    headerTitle: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: 'Verdana',
        marginLeft: Platform.OS === 'ios' ? 55 : 60,
        color: "#fff"
    },
    aboutAuthors: {
        alignItems: "center",
        // justifyContent: "center",
        padding: 10,
    },
    authorTitle: {
        // textAlign: "center",
        fontSize: 25,
        fontWeight: "500",
        color: COLORS.BackgroundColorPink,
        paddingLeft:10,
        top:20
    },
    authorOne: {
        fontSize: 18,
        color: COLORS.PopUpTextBlueColor,
        paddingTop: 10,
        fontWeight: "500",
        paddingLeft:15
    },
    authorOnes: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
        
    },
    authorOnedesc:{
        fontSize: 14,
        color: "gray",
    },
    aboutContent: {
        // borderWidth:0.5,
        // borderRadius:7,
        // borderColor:"gray",
        margin:10
    },
    lineview:{
        borderBottomWidth:0.5,
        borderColor:'gray',
        marginTop:20,
        width:deviceWidth - 40,
        alignSelf:"center"
    }
});

export default AboutUs;
