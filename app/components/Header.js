import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => (
    <View style={styles.headerContainer}>
        <Text style = {styles.headerText}>skemo</Text>
    </View>
);

const styles = StyleSheet.create({
    headerContainer:{
        marginTop:0,
        marginBottom:0,
        alignItems : 'center',
        height:50,
        backgroundColor : '#fff',
        justifyContent: 'center',
    },
        headerText: {
            fontSize: 26,
            fontWeight: 'bold',
            color:'#3f4e66',
        },
})

export default Header;