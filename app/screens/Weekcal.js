import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const WeekCal = () => (
    <View style = {styles.noticontainer}>
        <Text>This will be updated soon!</Text>
    </View>
);

const styles = StyleSheet.create({
    noticontainer: {
        marginTop:100,
        height:50,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default WeekCal;