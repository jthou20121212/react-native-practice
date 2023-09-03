import React, { useImperativeHandle } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GestureStateManagerType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gestureStateManager';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const maxSlideWidth = width / 3 * 2;

type ListItemProps = {
    item: any;
    callback?: (item: any) => void;
    option?: React.ReactNode;
    children?: React.ReactNode;
};

export type ListItemRefProps = {
    reset: () => void;
};

const SlideToDeleteListItem = React.forwardRef<ListItemRefProps, ListItemProps>(
    ({ item, option, children, callback }, ref) => {
        const currentTranslateX = useSharedValue(0);

        const currentStyle = useAnimatedStyle(() => {
            return {
                transform: [{
                    translateX: currentTranslateX.value
                }]
            }
        });

        const reset = () => {
            currentTranslateX.value = withTiming(0)
        };

        useImperativeHandle(ref, () => ({ reset }), [
            reset
          ]);

        const panGesture = Gesture.Pan()
            .activeOffsetX([-20, 20])
            .failOffsetY([-20, 20])
            .onChange((e) => {
                if (currentTranslateX.value === 0 && e.changeX > 0) return;
                if (Math.abs(e.changeY) > Math.abs(e.changeX)) return;
                const x = currentTranslateX.value + e.changeX;
                // 边界检查
                if (x > 0) {
                    currentTranslateX.value = 0;
                } else if (x < -maxSlideWidth) {
                    currentTranslateX.value = -maxSlideWidth;
                } else {
                    currentTranslateX.value = x;
                }
            })
            .onBegin(() => {
                if (callback) {
                    runOnJS(callback)(item);
                }
            })
            .onEnd((e) => {
                // 超出一半距离展开
                if (-currentTranslateX.value > maxSlideWidth / 2) {
                    currentTranslateX.value = withTiming(-maxSlideWidth)
                } else {
                    // 否则收起，恢复初始状态
                    currentTranslateX.value = withTiming(0)
                }
            });

        return (
            <GestureDetector gesture={panGesture} >
                <View style={{
                    backgroundColor: 'white',
                    alignItems: 'flex-end'
                }} >

                    {option}

                    <Animated.View style={[{ position: 'absolute' }, currentStyle]} >
                        {children}
                    </Animated.View>
                </View>
            </GestureDetector>
        )
    });

export default SlideToDeleteListItem;