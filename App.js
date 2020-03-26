import React, {useRef} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { Provider as PaperProvider, Portal, FAB } from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from './MainScreen';
import Cal from './app/screens/Calendar';
import WeekCal from './app/screens/Weekcal';
import EditScreen from './app/screens/Edit';
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';

const BaseNavi = createBottomTabNavigator();

export default function App() {

    const ref = React.useRef(null);
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
        <NavigationContainer>{
          <BaseNavi.Navigator
            initialRouteName = "Main"
            activeTintColor = '#000' 
            inactiveTintColor = "#bdbdbd"
            tabBarOptions = {{
              showLabel : false,
            }}
            >
            <BaseNavi.Screen
              name = "Main"
              component = {MainScreen}
              options = {{
                tabBarIcon : ({ color }) => (
                  <MaterialCommunityIcons name='home-outline' size={25}  color = {color} />
                )
              }}
            />
            <BaseNavi.Screen
              name = "Week"
              component = {WeekCal}
              options = {{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name='calendar-week' size={25} color = {color} />
                )
              }}
            />
            <BaseNavi.Screen
              name = "Month"
              component = {Cal}
              options = {{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name='calendar-blank' size={25} color = {color} />
                )
              }}
            />
          </BaseNavi.Navigator>
        }
        </NavigationContainer>
      </View>
    );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },
})