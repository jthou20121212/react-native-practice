import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
    Directions,
    Gesture,
    GestureDetector
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

export default function Fling() {
    const position = useSharedValue(0);

    const flingGesture = Gesture.Fling()
        .direction(Directions.RIGHT)
        .onStart((e) => {
            position.value = withTiming(position.value + 10, { duration: 100 });
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
    }));

    return (
        <GestureDetector gesture={flingGesture}>
            <Animated.View style={[styles.box, animatedStyle]} />
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
