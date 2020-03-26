import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import Header from './app/components/Header';
import moment from 'moment';
import EditScreen from './app/screens/Edit';
import { SafeAreaView } from 'react-navigation';
import { useNavigation } from '@react-navigation/native';
import EventCalendar from './app/components/EventCalendar';
import {FAB} from 'react-native-paper';



let { width } = Dimensions.get('window');
export default class MainContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          start: '2020-03-26 22:30:00',
          end: '2020-03-26 23:30:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
          color: 'green',
        },
        {
          start: '2020-03-26 14:30:00',
          end: '2020-03-26 16:30:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
      ],
    };
  }
  _eventTapped(event) {
    alert(JSON.stringify(event));
  }
  render() {
    const date = moment().format('YYYY-MM-DD');
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header/>
        <EventCalendar
          eventTapped={this._eventTapped.bind(this)}
          events={this.state.events}
          width={width}
          initDate={date}
          scrollToFirst
          upperCaseHeader
          uppercase
          scrollToFirst={false}

        />
        <Fabbutton/>
      </SafeAreaView>
    );
  }
}

function Fabbutton() {
  const navigation = useNavigation();
  return(
    <View> 
      <FAB
        onPress={() => {navigation.navigate('EditScreen', {screen : 'EditScreen'})}}
        icon = "pencil"
        style = {{
          position: 'absolute',
          bottom: 30,
          right: 20,
        }}
        color = "white"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    justifyContent : "center",
    alignItems: "center"
  }
});