import React, { ReactElement } from 'react';
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Text, View, FlatList, StatusBar, Dimensions, Image } from 'react-native';
import Animated, {
    Layout,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    useDerivedValue,
    Easing,
    withTiming,
    withRepeat,
    interpolateColor,
    runOnUI,
    useAnimatedProps,
} from 'react-native-reanimated';
import { RefreshHeaderProps } from '../gesture/PullFlatList';

const strokeWidth = 2;
const canvasWidth = 20;
const canvasHeight = 17.32;
const triangleWidth = canvasWidth;
const triangleHeight = canvasHeight;
const path = Skia.Path.Make();
path.moveTo(triangleWidth / 2, strokeWidth);
path.lineTo(strokeWidth, triangleHeight - strokeWidth);
path.lineTo(triangleWidth - strokeWidth, triangleHeight - strokeWidth);
path.close();

export default function HRefreshHeader({
    pullHeight,
    headerHeight,
}: RefreshHeaderProps) {

    const rotate = useSharedValue('0deg');
    const progress = useSharedValue(0);

    const rotationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: rotate.value }
            ],
        };
    });

    progress.value = Math.min(1, (pullHeight!.value + headerHeight) / headerHeight)

    console.log('jthou', `progress.value : ${progress.value}`)

    return <>
        <View style={{ height: headerHeight, justifyContent: 'center' }}>
            <Animated.View style={
                [{
                    width: canvasWidth,
                    height: canvasHeight,
                    alignSelf: 'center',
                }, rotationStyle]
            } >
                <Canvas style={{ flex: 1 }} >
                    <Path
                        style="stroke"
                        path={path}
                        color="black"
                        strokeWidth={strokeWidth}
                        start={0}
                        end={progress}
                        opacity={progress}
                    />
                </Canvas>
            </Animated.View>
        </View>
    </>

}