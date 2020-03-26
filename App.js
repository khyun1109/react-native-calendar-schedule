import React, {useRef} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider, Portal, FAB } from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MainContents from './MainScreen';
import Cal from './app/screens/Calendar';
import WeekCal from './app/screens/Weekcal';
import EditScreen from './app/screens/Edit';
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';

const BaseNavi = createBottomTabNavigator();
const Root = createStackNavigator();

export default function App() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
        <NavigationContainer>{
          <MainScreen/>
        }
        </NavigationContainer>
      </View>
    );
}

function BottomTab() {
  return (
      <BaseNavi.Navigator
        initialRouteName = "Main"
        activeTintColor = '#000' 
        inactiveTintColor = "#bdbdbd"
        tabBarOptions = {{
          showLabel : false,
        }}
        >
        <BaseNavi.Screen
          name = "MainContents"
          component = {MainContents}
          options = {{
            tabBarIcon : ({ color }) => (
              <MaterialCommunityIcons name='home-outline' size={25}  color = {color} />
            )
          }}
        />
        <BaseNavi.Screen
          name = "WeekCal"
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
  )
}

function MainScreen() {
  return (
    <>
    <Root.Navigator
      screenOptions = {{
        headerShown : false,
      }}>
      <Root.Screen
      name = "Home" 
      component = {BottomTab}
      />
      <Root.Screen
      name = "EditScreen"
      component = {EditScreen}
      />
    </Root.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },
})