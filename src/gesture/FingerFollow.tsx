import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

type AnimatedPosition = {
    x: Animated.SharedValue<number>;
    y: Animated.SharedValue<number>;
}

const useFollowAnimatedPosition = ({ x, y }: AnimatedPosition) => {
    const followX = useDerivedValue(() => {
        return withSpring(x.value);
    });

    const followY = useDerivedValue(() => {
        return withSpring(y.value);
    });

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: followX.value },
                { translateY: followY.value },
            ]
        }
    })

    return { followX, followY, style };
}

const SIZE = 80;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FingerFollow() {

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onChange((e) => {
            translateX.value += e.changeX;
            translateY.value += e.changeY;
        })
        .onEnd((e) => {
            if (translateX.value > SCREEN_WIDTH / 2) {
                translateX.value = SCREEN_WIDTH - SIZE;
            } else {
                translateX.value = 0;
            }
        });

    const {
        followX: blueFollowX,
        followY: blueFollowY,
        style: blueAnimatedStyle,
    } = useFollowAnimatedPosition({
        x: translateX,
        y: translateY,
    });

    const {
        followX: redFollowX,
        followY: redFollowY,
        style: redAnimatedStyle,
    } = useFollowAnimatedPosition({
        x: blueFollowX,
        y: blueFollowY,
    });

    const {
        followX: greenFollowX,
        followY: greenFollowY,
        style: bAnimatedStyle,
    } = useFollowAnimatedPosition({
        x: redFollowX,
        y: redFollowY,
    });

    return <>
        <GestureHandlerRootView style={{ flex: 1 }} >
            <View style={styles.container}>
                <Animated.View
                    style={[styles.circle, { backgroundColor: 'green' }, bAnimatedStyle]}
                />
                <Animated.View
                    style={[styles.circle, { backgroundColor: 'red' }, redAnimatedStyle]}
                />
                <GestureDetector gesture={panGesture} >
                    <Animated.View style={[styles.circle, blueAnimatedStyle]} />
                </GestureDetector>
            </View>
        </GestureHandlerRootView>
    </>

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    circle: {
        position: 'absolute',
        width: 80,
        aspectRatio: 1,
        backgroundColor: 'blue',
        borderRadius: 40,
    }
})