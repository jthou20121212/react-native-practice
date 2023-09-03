import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const RADIUS = 60;

export default function ShareDemo1() {
    
    const screen = useWindowDimensions()

    const isPress = useSharedValue(false);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onBegin((e) => {
            isPress.value = true;
        })
        .onFinalize((e) => {
            isPress.value = false;
        })
        .onChange((e) => {
            translationX.value += e.changeX;
            translationY.value += e.changeY;
        })
        .onEnd((e) => {
            const leftDistance = translationX.value;
            const rightDistance = screen.width - leftDistance - RADIUS; 

            if (leftDistance <= rightDistance) {
                translationX.value = 0;
            } else {
                translationX.value = screen.width - RADIUS; 
            }
        })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: withSpring(translationX.value) },
                { translateY: withSpring(translationY.value) }
            ],
            backgroundColor: isPress.value ? '#0000ffaa' : '#0000ff'
        }
    })

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture} >
                <Animated.View style={[styles.circle, animatedStyle]} />
            </GestureDetector>
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    circle: {
        width: RADIUS,
        height: RADIUS,
        borderRadius: RADIUS,
        backgroundColor: '#0000ff',
    }
})