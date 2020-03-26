import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-navigation';

export default class Cal extends React.Component{
    render(){
        return(
            <SafeAreaView styles = {styles.container}>
                <Calendar current={new Date()} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    }
})