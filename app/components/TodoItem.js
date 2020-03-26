import React from "react"
import {View, Text, StyleSheet, Dimensions} from "react-native"

const TodoItem= () => (
    <View style={styles.todoContainer}>
        <View>
            <Text style={styles.todoitem}>할일 1</Text>
        </View>
    </View>
);

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    todoContainer: {
        padding: 5,
        marginTop: 10,
        marginLeft: 10,
        borderBottomWidth: 1,
        width: width-80,
        height: height-600,
    },
    todoitem: {
        fontSize: 20,
    },
})

export default TodoItem;