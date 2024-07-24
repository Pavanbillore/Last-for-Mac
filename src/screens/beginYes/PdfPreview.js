import React,{useState,useEffect} from 'react'
import { View,Image, StyleSheet,Dimensions,TouchableOpacity,Text } from 'react-native'
import Pdf from 'react-native-pdf';


const PdfPreview = ({navigation,route}) => {
    const { pdfdatas } = route.params
    console.log('pdff',pdfdatas)
    const [page, setPage] = useState(1);
    const sources = require('../../images/download.pdf');
    const source = { uri: pdfdatas, cache: true };
    const canclepick = require('../../images/remove.png');
    
  return (
    <View style={styles.container}>
        
        <View>
        <View>
        <TouchableOpacity style={styles.contextStyl} onPress={()=>{
            navigation.goBack()
        }}>
            <Image source={canclepick} style={styles.textStyl} />
        </TouchableOpacity>
        </View>
        <Pdf
            ref={(pdf) => {pdf = pdf }}
            source={source}
            onLoadComplete={(numberOfPages,filePath) => {
                console.log('Number of pages:', numberOfPages);
            }}
            onPageChanged={(page,numberOfPages) => {
                console.log('Current page:',  page);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log('Link pressed:', uri);
            }}
            style={styles.pdf}/>
    </View>
    </View>
  )
}

export default PdfPreview;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdf: {
        width:width,
        height:height - 100,
    },
    contextStyl:{
        alignItems:'flex-end',
        left:-10,
        
    },
    textStyl:{
       height:35,
       width:35
    }
});