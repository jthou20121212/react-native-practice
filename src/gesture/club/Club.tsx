import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import SimpleFlatList from '../../component/SimpleFlatList';

export enum Location {
    TOP,
    MIDDLE,
    BOTTOM
}

type ClubProps = {
    location?: Location,
    callback?: (location: Location) => void;
    children?: React.ReactNode;
}

const MAX_PULL_VELOCITY = 600;

const handleHeight = 50;
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
const statusBarHeight = StatusBar.currentHeight || 44;
const navigatorBarHeight = screenHeight - windowHeight - statusBarHeight;

// top 状态栏高度 + 44
// val imageHeight = (ScreenUtils.getScreenWidth() - 92.dp) / 4
// val textViewHeight = if (textView.measuredHeight <= 0) 36.dp
// middle statusBarHeight + 66.dp + (15.dp + imageHeight + 10.dp + textViewHeight + 15.dp) * 2
// bottom ScreenUtils.getScreenHeight() - 80.dp - 51.dp - navigationBarHeight

const top = statusBarHeight + 44;
const middle = statusBarHeight + 66 + ((windowWidth - 92) / 4 + 76) * 2;
const bottom = screenHeight - 131 - navigatorBarHeight;

export default ({ location = Location.MIDDLE, callback, children }: ClubProps) => {

    useEffect(() => {
        scrollToLocation(location);
    }, [])

    const [currentLocation, setCurrentLocation] = useState(location);

    const scrollY = useSharedValue(0);
    const translationY = useSharedValue<number>(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translationY.value },
            ]
        }
    })

    const doCallback = (location: Location) => {
        callback?.(location);
    }

    const scrollToLocation = (location: Location) => {
        'worklet'
        switch (location) {
            case Location.TOP:
                translationY.value = withSpring(top - bottom, {
                    overshootClamping: true
                });
                break;
            case Location.MIDDLE:
                translationY.value = withSpring(middle - bottom, {
                    overshootClamping: true
                });
                break;
            case Location.BOTTOM:
                translationY.value = withSpring(0, {
                    overshootClamping: true
                });
                break;
            default:
        }
        runOnJS(setCurrentLocation)(location);
        runOnJS(doCallback)(location);
    };

    // 只有两种创建 FlatList 可以滑动
    // case1 在顶部位置往上滑动
    // case2 在顶部位置往下滑动并且滑动距离大于 0 
    const tapGesture = Gesture.Tap()
        .onTouchesMove((_, manager) => {
            if (translationY.value === top - bottom) {
                console.log('jthou', 'fail');
                manager.fail();
            } else {
                manager.activate();
                console.log('jthou', 'activate');
            }
        })
        .maxDuration(1000000);

    const scrollGesture = Gesture.Native()
        .requireExternalGestureToFail(tapGesture);

    const panGesture = Gesture.Pan()
        .onChange((event) => {
            // 如果已经在顶部有两种情况不处理
            // 往上滑不处理
            // scrollY 不等于 0 时往下滑不处理
            // 这个时候滚动事件同时响应就这里不处理就区处理了事件
            const case1 = top - bottom === translationY.value && event.changeY <= 0;
            const case2 = top - bottom === translationY.value && event.changeY >= 0 && scrollY.value !== 0;

            if (case1 || case2) return;

            // min 表示底部最多滑到 bottom 位置，不能再往下滑
            // max 表示顶部最多滑到 top 位置，不能再往上滑
            translationY.value = Math.min(0, Math.max(translationY.value + event.changeY, top - bottom));
        })
        .onEnd((event) => {
            // 如果超出既定速率则滑动到下一位置
            if (Math.abs(event.velocityY) > MAX_PULL_VELOCITY && scrollY.value === 0) {
                // event.translationY < 0 是往上滑
                // event.translationY > 0 是往下滑
                if (event.translationY < 0) {
                    if (currentLocation == Location.BOTTOM) {
                        scrollToLocation(Location.MIDDLE);
                    } else if (currentLocation == Location.MIDDLE) {
                        scrollToLocation(Location.TOP);
                    }
                } else {
                    if (currentLocation == Location.TOP) {
                        scrollToLocation(Location.MIDDLE);
                    } else if (currentLocation == Location.MIDDLE) {
                        scrollToLocation(Location.BOTTOM);
                    }
                }
            } else {
                // 否则 top middle bottom 距离哪个位置近就滑到哪个位置
                // console.log('jthou', JSON.stringify(event));
                const distanceBottom = -translationY.value;
                const distanceMiddle = Math.abs(bottom - middle + translationY.value);
                const distanceTop = bottom - top + translationY.value;
                const min = Math.min(distanceTop, distanceMiddle, distanceBottom);
                if (min == distanceTop) {
                    scrollToLocation(Location.TOP);
                } else if (min == distanceMiddle) {
                    scrollToLocation(Location.MIDDLE);
                } else {
                    scrollToLocation(Location.BOTTOM);
                }
            }
        })
        .simultaneousWithExternalGesture(tapGesture, scrollGesture);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            // 记录偏移量，只能读不能写
            scrollY.value = e.contentOffset.y;

            console.log('jthou', "onScroll");

        },
    });

    // 白色手柄处可点击，在最低高度点击回到中间高度，在中间高度点击到最高高度，在最高高度点击回中间高度
    const toggle = () => {
        if (translationY.value == middle - bottom) {
            scrollToLocation(Location.TOP);
        } else {
            scrollToLocation(Location.MIDDLE);
        }
    }

    return (
        <GestureDetector gesture={panGesture} >
            <Animated.View style={[styles.container, animatedStyle]}>
                <TouchableWithoutFeedback onPress={toggle} >
                    <View style={styles.handle} >
                        <View style={styles.line} ></View>
                    </View>
                </TouchableWithoutFeedback>
                <GestureDetector gesture={Gesture.Simultaneous(tapGesture, scrollGesture)}  >
                    <SimpleFlatList
                        style={{ flexGrow: 1 , marginBottom: top,}}
                        ItemSeparatorComponent={ () => <View style={styles.separator} />}
                        onScroll={scrollHandler}
                        scrollEventThrottle={1}
                    />
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: bottom,
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        overflow: "hidden",
        backgroundColor: 'white'
    },
    handle: {
        width: '100%',
        height: handleHeight,
        alignSelf: 'center',
        backgroundColor: 'yellow'
    },
    line: {
        width: 44,
        height: 4,
        backgroundColor: 'grey',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    item: {
        flex: 1,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    separator: {
        height: 1,
        opacity: 0.2,
        backgroundColor: 'grey',
    }
});