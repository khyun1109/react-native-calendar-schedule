// @flow
import {
    VirtualizedList,
    View,
    TouchableOpacity,
    Image,
    Text,
  } from 'react-native';
  import _ from 'lodash';
  import moment from 'moment';
  import React from 'react';
  
  import styleConstructor from './style';
  
  import DayView from './DayView';
  
  export default class EventCalendar extends React.Component {
    constructor(props) {
      super(props);
  
      const start = props.start ? props.start : 6;
      const end = props.end ? props.end : 24;
  
      this.offset = props.offset || 80;
      this.styles = styleConstructor(props.styles, (end - start) * this.offset);
      this.state = {
        date: moment(this.props.initDate),
        index: this.props.size,
      };
    }
  
    componentDidMount() {
      if (this.props.onRef) {
        this.props.onRef(this);
      }
    }
  
    componentWillUnmount() {
      if (this.props.onRef) {
        this.props.onRef(undefined);
      }
    }
  
    static defaultProps = {
      size: 30,
      initDate: new Date(),
      formatHeader: 'DD MMMM YYYY',
    };
  
    _getItemLayout(data, index) {
      const { width } = this.props;
      return { length: width, offset: width * index, index };
    }
  
    _getItem(events, index) {
      const date = moment(this.props.initDate).add(
        index - this.props.size,
        'days'
      );
      return _.filter(events, event => {
        const eventStartTime = moment(event.start);
        return (
          eventStartTime >= date.clone().startOf('day') &&
          eventStartTime <= date.clone().endOf('day')
        );
      });
    }
  
    _renderItem({ index, item }) {
      const {
        width,
        format24h,
        initDate,
        scrollToFirst = true,
        start = 6,
        end = 24,
        showVerticalScrollIndicator = true,
        showHalfHours = true,
        withMinutes = false,
        newEventIcon,
      } = this.props;
      const date = moment(initDate).add(index - this.props.size, 'days');
      return (
        <DayView
          date={date}
          index={index}
          format24h={format24h}
          withMinutes={withMinutes}
          newEventIcon={newEventIcon}
          formatHeader={this.props.formatHeader}
          headerStyle={this.props.headerStyle}
          renderEvent={this.props.renderEvent}
          eventTapped={this.props.eventTapped}
          events={item}
          width={width}
          styles={this.styles}
          scrollToFirst={scrollToFirst}
          start={start}
          end={end}
          offset={this.offset}
          showHalfHours={showHalfHours}
          showVerticalScrollIndicator={showVerticalScrollIndicator}
          onNewEvent={this.props.onNewEvent}
          newEvents={this.props.newEvents}
        />
      );
    }
  
    _goToPage(index, animated = true) {
      if (index <= 0 || index >= this.props.size * 2) {
        return;
      }
      const date = moment(this.props.initDate).add(
        index - this.props.size,
        'days'
      );
      this.refs.calendar.scrollToIndex({ index, animated });
      this.setState({ index, date });
    }
  
    _goToDate(date) {
      const earliestDate = moment(this.props.initDate).subtract(
        this.props.size,
        'days'
      );
      const index = moment(date).diff(earliestDate, 'days');
      this._goToPage(index);
    }
  
    _previous = () => {
      this._goToPage(this.state.index - 1);
      if (this.props.dateChanged) {
        this.props.dateChanged(
          moment(this.props.initDate)
            .add(this.state.index - 1 - this.props.size, 'days')
            .format('YYYY-MM-DD')
        );
      }
    };
  
    _next = () => {
      this._goToPage(this.state.index + 1);
      if (this.props.dateChanged) {
        this.props.dateChanged(
          moment(this.props.initDate)
            .add(this.state.index + 1 - this.props.size, 'days')
            .format('YYYY-MM-DD')
        );
      }
    };
  
    render() {
      const {
        width,
        virtualizedListProps,
        events,
        initDate,
        formatHeader,
        upperCaseHeader = false,
      } = this.props;
  
      const leftIcon = this.props.headerIconLeft ? (
        this.props.headerIconLeft
      ) : (
        <Image source={require('./back.png')} style={this.styles.arrow} />
      );
      const rightIcon = this.props.headerIconRight ? (
        this.props.headerIconRight
      ) : (
        <Image source={require('./forward.png')} style={this.styles.arrow} />
      );
  
      let headerText = upperCaseHeader
        ? this.state.date.format(formatHeader || 'DD MMMM YYYY').toUpperCase()
        : this.state.date.format(formatHeader || 'DD MMMM YYYY');
  
      return (
        <View style={[this.styles.container, { width }]}>
          {this.props.renderDateHeader ? 
          this.props.renderDateHeader()
          :<View style={this.styles.header}>
            <TouchableOpacity
              style={this.styles.arrowButton}
              onPress={this._previous}
            >
              {leftIcon}
            </TouchableOpacity>
            <View style={this.styles.headerTextContainer}>
              <Text style={this.styles.headerText}>{headerText}</Text>
            </View>
            <TouchableOpacity
              style={this.styles.arrowButton}
              onPress={this._next}
            >
              {rightIcon}
            </TouchableOpacity>
          </View>}
          <VirtualizedList
            ref="calendar"
            windowSize={2}
            initialNumToRender={2}
            initialScrollIndex={this.props.size}
            data={events}
            getItemCount={() => this.props.size * 2}
            getItem={this._getItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            getItemLayout={this._getItemLayout.bind(this)}
            horizontal
            pagingEnabled
            renderItem={this._renderItem.bind(this)}
            style={{ width: width }}
            onMomentumScrollEnd={event => {
              const index = parseInt(event.nativeEvent.contentOffset.x / width);
              if (index == this.state.index) {
                return;
              }
              const date = moment(this.props.initDate).add(
                index - this.props.size,
                'days'
              );
              if (this.props.dateChanged) {
                this.props.dateChanged(index);
              }
              this.setState({ index, date });
            }}
            {...virtualizedListProps}
          />
        </View>
      );
    }
  }