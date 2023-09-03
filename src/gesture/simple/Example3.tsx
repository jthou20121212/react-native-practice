import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function Example() {
    const singleTap = Gesture.Tap()
        .maxDuration(250)
        .onStart(() => {
            Alert.alert('Single tap!');
            // Alert.alert("Error", "Enter an item", [{ text: "OK" }]);
        });

    const doubleTap = Gesture.Tap()
        .maxDuration(250)
        .onStart(() => {
            Alert.alert('Double tap!');
            // Alert.alert("Error", "Enter an item", [{ text: "OK" }]);
        });

    return (
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
            <View style={styles.box} />
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 200,
        height: 200,
        backgroundColor: '#ff000066'
    }
})
