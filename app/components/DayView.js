// @flow
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import populateEvents from './Packer';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const LEFT_MARGIN = 60 - 1;
// const RIGHT_MARGIN = 10
const CALENDER_HEIGHT = 2400;
// const EVENT_TITLE_HEIGHT = 15
const TEXT_LINE_HEIGHT = 17;
// const MIN_EVENT_TITLE_WIDTH = 20
// const EVENT_PADDING_LEFT = 4

function range(from, to) {
  return Array.from(Array(to - from), (_, i) => from + i);
}

export default class DayView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.calendarHeight = (props.end - props.start) * props.offset;
    const width = props.width - LEFT_MARGIN;
    const packedEvents = populateEvents(props.events, width, props.start, props.offset);
    let initPosition =
      _.min(_.map(packedEvents, 'top')) -
      this.calendarHeight / (props.end - props.start);
    initPosition = initPosition < 0 ? 0 : initPosition;
    this.state = {
      _scrollY: initPosition,
      packedEvents,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const width = nextProps.width - LEFT_MARGIN;
    return {
      packedEvents: populateEvents(nextProps.events, width, nextProps.start, nextProps.offset),
    }
  }

  componentDidMount() {
    this.props.scrollToFirst ? this.scrollToFirst() : 
    setTimeout(() =>{
      if (this.state && this._scrollView) {
      this._scrollView.scrollTo({
        x: 0,
        y: this.getRedLineOfset(this.props.offset),
        animated: true,
      })}
    }, 300)
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true,
        });
      }
    }, 1);
  }

  getRedLineOfset(offset) {
    const timeNowHour = moment().hour();
    const timeNowMin = moment().minutes();
    const redlineOffset = offset * (timeNowHour - this.props.start) + (offset * timeNowMin) / 60;

    return redlineOffset;
  }

  _renderRedLine() {
    const { width, styles, offset } = this.props;
    if (!moment(this.props.date).isSame(moment(), 'day')) {
      return null;
    }
    return (
      <View
        key={`timeNow`}
        style={[
          styles.lineNow,
          {
            top: this.getRedLineOfset(offset),
            width: width - 20,
          },
        ]}
      />
    );
  }

  _renderLines() {
    const { format24h, start, end } = this.props;
    const offset = this.calendarHeight / (end - start);

    return range(start, end + 1).map((i, index) => {
      let timeText;
      if (i === start) {
        timeText = ``;
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : i;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : i;
      } else if (i === 24) {
        timeText = !format24h ? `12 AM` : 0;
      } else {
        timeText = !format24h ? `${i - 12} PM` : i;
      }
      
      if (this.props.withMinutes && timeText) {
        timeText +=":00"
      }
      
      const { width, styles, showHalfHours } = this.props;
      return [
        <Text
          key={`timeLabel${i}`}
          style={[styles.timeLabel, { top: offset * index - 6 }]}
        >
          {timeText}
        </Text>,
        i === start ? null : (
          <View
            key={`line${i}`}
            style={[styles.line, { top: offset * index, width: width - 20 }]}
          />
        ),
        showHalfHours && <View
          key={`lineHalf${i}`}
          style={[
            styles.line,
            { top: offset * (index + 0.5), width: width - 20 },
          ]}
        />,
      ];
    });
  }

  renderNewEventSpace() {
    const { start, end, width, styles, newEvents } = this.props;
    if (!newEvents) {
      return null;
    }
    const offset = this.calendarHeight / (end - start);
    let hours_pagging = 0;

    if (moment(this.props.date).isBefore(moment(), 'day')) {
      return null;
    }

    if (moment(this.props.date).isSame(moment(), 'day')) {
      hours_pagging = moment().get('hours') - start ;
      hours_pagging = hours_pagging > 0 ? hours_pagging : 0;
    }

    return range(start, end + 1 - hours_pagging).map((i, index) => {
      return [
        i === start ? null : <Text
          key={`newEventLineLabel${i}`}
          style={[styles.timeLabel, { top: offset * (index + hours_pagging) + (offset/2) - 6, left: 40, color: 'white' }]}
        >
          {this.props.newEventIcon || '+'}
        </Text>,
        i === start ? null : (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              const temp = new Date(this.props.date);
              temp.setHours(index+ start + hours_pagging);
              this.props.onNewEvent(temp)
            }}
            key={`newEventLine${i}`}
            style={[{ top: offset * (index + hours_pagging), width: width }, {
              // backgroundColor: ,
              // borderWidth: 2,
              // borderColor: 'red',
              // borderRadius: 10,
              height: offset - 5,
              position: 'absolute',
            }]}
          />
        ),
      ];
    });
  }

  _onEventTapped(event) {
    this.props.eventTapped && this.props.eventTapped(event);
  }

  _renderEvents() {
    const { styles } = this.props;
    const { packedEvents } = this.state;
    let events = packedEvents.map((event, i) => {
      const style = {
        left: event.left,
        height: event.height,
        width: event.width,
        top: event.top,
      };

      const eventColor = {
        backgroundColor: event.color,
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            this._onEventTapped(this.props.events[event.index])
          }
          key={event.id || i} style={[styles.event, style, event.color && eventColor]}
        >
          {this.props.renderEvent ? (
            this.props.renderEvent(event)
          ) : (
            <View>
              <Text numberOfLines={1} style={styles.eventTitle}>
                {event.title || 'Event'}
              </Text>
              {numberOfLines > 1 ? (
                <Text
                  numberOfLines={numberOfLines - 1}
                  style={[styles.eventSummary]}
                >
                  {event.summary || ' '}
                </Text>
              ) : null}
              {numberOfLines > 2 ? (
                <Text style={styles.eventTimes} numberOfLines={1}>
                  {moment(event.start).format(formatTime)} -{' '}
                  {moment(event.end).format(formatTime)}
                </Text>
              ) : null}
              </View>
          )}
        </TouchableOpacity>
      );
    });

    return (
      <View>
        <View style={{ marginLeft: LEFT_MARGIN }}>{events}</View>
      </View>
    );
  }

  render() {
    const { styles } = this.props;
    return (
      <ScrollView
        ref={ref => (this._scrollView = ref)}
        showsVerticalScrollIndicator={this.props.showVerticalScrollIndicator}
        contentContainerStyle={[
          styles.contentStyle,
          { width: this.props.width },
        ]}
      >
        {this.renderNewEventSpace()}
        {this._renderLines()}
        {this._renderEvents()}
        {this._renderRedLine()}
      </ScrollView>
    );
  }
}