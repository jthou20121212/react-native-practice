import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const LIST_ITEM_HEIGHT = 70;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const dismiss_threshold = 0.35

interface ListItemProps {
    id: string;
    title: string;
    callback?: (id: string) => void;
}

const SlideListItem: React.FC<ListItemProps> = ({
    id,
    title,
    callback
}) => {

    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
    const marginVertical = useSharedValue(7.5);

    const tapGesture = Gesture.Tap()
        .onBegin(() => {
            console.log('jthou', title);
        });

    const panGesture = Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-20, 20])
        .onChange((e) => {
            translateX.value += e.changeX;
        })
        .onEnd((e) => {
            if (translateX.value === 0) return;
            // 滑动超出屏幕宽度的一半删除，否则还原
            if (Math.abs(translateX.value) > SCREEN_WIDTH * dismiss_threshold) {
                const sign = translateX.value > 0 ? 1 : -1;
                translateX.value = withTiming(sign * SCREEN_WIDTH);
                itemHeight.value = withTiming(0);
                marginVertical.value = withTiming(0);
                opacity.value = withTiming(0, undefined, (finished) => {
                    // 动画完成后再异步回调否则卡顿
                    if (finished) {
                        if (callback) {
                            runOnJS(callback)(id);
                        }
                    }
                });
            } else {
                translateX.value = withTiming(0);
            }
        });

    const contentStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value,
            },
        ],
    }));

    const iconStyle = useAnimatedStyle(() => {
        const opacity = withTiming(
            Math.abs(translateX.value) > SCREEN_WIDTH * dismiss_threshold ? 1 : 0
        );
        return { opacity };
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            height: itemHeight.value,
            marginVertical: marginVertical.value
        };
    });

    return (
        <Animated.View style={[styles.container, containerStyle]} >
            <Animated.View style={[styles.icon, iconStyle]} >
                <Image style={{
                    width: 44,
                    aspectRatio: 1
                }} source={require('./../image/delete.webp')} />
                <Image
                    style={{
                        width: 44,
                        height: 44
                    }}
                    source={require('./../image/delete.webp')} />
            </Animated.View>
            <View style={{ width: '90%', position: 'absolute' }} >
                <GestureDetector gesture={Gesture.Simultaneous(tapGesture, panGesture)}  >
                    <Animated.View style={[styles.item, contentStyle]} >
                        <Text>{title}</Text>
                    </Animated.View>
                </GestureDetector>
            </View>
        </Animated.View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: LIST_ITEM_HEIGHT,
        alignItems: 'center'
    },
    icon: {
        width: '90%',
        height: LIST_ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    item: {
        width: '100%',
        height: LIST_ITEM_HEIGHT,
        justifyContent: 'center',
        paddingLeft: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        // Shadow for iOS
        shadowOpacity: 0.08,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowRadius: 10,
        // Shadow for Android
        elevation: 5,
    },
});

export default SlideListItem;