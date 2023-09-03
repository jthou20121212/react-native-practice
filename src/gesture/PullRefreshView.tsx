import React from 'react';
import { Text, View, useWindowDimensions, StatusBar, Dimensions } from 'react-native';
import Animated, {
    withSpring,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    runOnJS,
    Easing,
    withTiming,
    withRepeat,
    useWorkletCallback,
} from 'react-native-reanimated';
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import GeneralStatusBarColor from '../component/GeneralStatusBarColor'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const LOADING_HEIGHT = 70;
const MAX_PULL_RATE = 2.4

// header 高度 60
// 最大下拉高度 = header 高度 * 2.4
// 触发刷新高度 = header 高度 * 1
export default function PanAndScrollView() {

    const refreshY = useSharedValue(-LOADING_HEIGHT);
    const spinner = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const rotate = useSharedValue('0deg');
    const progress = useSharedValue(0);

    // 屏幕高度（状态栏 + 窗口高度 + 导航栏高度）
    const screenHeight = Dimensions.get('screen').height;
    // 状态栏高度
    const statusBarHeight = StatusBar.currentHeight || 44;
    // 窗口高度
    const windowHeight = Dimensions.get('window').height;

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

    const simulateRefresh = () => {

        console.log('simulateRefresh');

        setTimeout(() => {
            spinner.value = 0;
            rotate.value = '0deg';
            refreshY.value = withTiming(-LOADING_HEIGHT, {
                duration: 300,
                easing: Easing.ease
            });
        }, 3000)
    };

    const calculateLocation = (y: number) => {
        'worklet';
        // 公式 y = M(1-100^(-x/H))
        // final double M = mHeaderMaxDragRate * mHeaderHeight;
        // final double H = Math.max(mScreenHeightPixels / 2, thisView.getHeight());
        // final double x = Math.max(0, spinner * mDragRate);
        // final double y = Math.min(M * (1 - Math.pow(100, -x / (H == 0 ? 1 : H))), x);

        const M = MAX_PULL_RATE * LOADING_HEIGHT;
        const H = windowHeight;
        const x = y > 0 ? y : -y;
        return Math.min(M * (1 - Math.pow(100, -x / (H == 0 ? 1 : H))), x);
    };

    // hack: 使用 tapGesture 手势作为控制 scrollGesture 是否执行动画的开关
    // 并不是真正的要响应 Tap 手势
    const tapGesture = Gesture.Tap()
        .onTouchesMove((_, manager) => {
            // 如果 ScrollView 容器没有顶到屏幕顶部
            // 则设置 Tap 手势内部状态为 FAILED，让 ScrollView 内容不可滚动
            if (LOADING_HEIGHT + refreshY.value === 0) {
                manager.fail();
            } else {
                manager.activate();
            }
        })
        .maxDuration(1000000);


    const scrollGesture = Gesture.Native()
        // 当 Tap 手势内部状态为 ACTIVE 则 ScrollView 滚动动画不执行
        // 当 Tap 手势内部状态为 FAILED 则 ScrollView 滚动动画执行
        .requireExternalGestureToFail(tapGesture);

    const panGesture = Gesture.Pan()
        .onChange(e => {
            if (e.changeY <= 0 && refreshY.value === -LOADING_HEIGHT) return;
            if (e.changeY > 0 && refreshY.value >= LOADING_HEIGHT * MAX_PULL_RATE) return;
            // 滚动到顶部或者容器整体偏离正常位置时，可触发手势动画
            if (scrollY.value === 0 || refreshY.value !== -LOADING_HEIGHT) {

                spinner.value = spinner.value + e.changeY;

                const y = calculateLocation(spinner.value)

                if (y < -LOADING_HEIGHT) {
                    refreshY.value = -LOADING_HEIGHT;
                } else if (y < 0) {
                    refreshY.value = spinner.value;
                } else if (y > LOADING_HEIGHT * MAX_PULL_RATE) {
                    refreshY.value = LOADING_HEIGHT * MAX_PULL_RATE;
                } else {
                    refreshY.value = y - LOADING_HEIGHT;
                }

                // runOnJS(calculateLocation) (y, windowHeight)

                // opacity.value = (refreshY.value + LOADING_HEIGHT) / TRIANGLE_HEIGHT
                progress.value = Math.min(1, (refreshY.value + LOADING_HEIGHT) / LOADING_HEIGHT)
            }
        })
        .onEnd(() => {
            // 如果拉出高度小于 loading 高度则收起
            if (refreshY.value < 0) {
                spinner.value = 0;
                refreshY.value = withTiming(-LOADING_HEIGHT, {
                    duration: 300,
                    easing: Easing.ease
                });
            } else {
                // 则使用弹性动画 withSpring，回到 loading 完全显示的位置触发刷新
                spinner.value = LOADING_HEIGHT;
                refreshY.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.ease
                });
                rotate.value = withRepeat(withTiming('-360deg', {
                    duration: 1000,
                    easing: Easing.linear
                }), -1, false);

                runOnJS(simulateRefresh)()
            }
        })
        .simultaneousWithExternalGesture(scrollGesture, tapGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: refreshY.value }],
        };
    });

    const rotationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: rotate.value }
            ],
        };
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            // 记录偏移量，只能读不能写
            scrollY.value = e.contentOffset.y;
        },
    });


    const marginTop = 50 + statusBarHeight;
    const listContainerHeight = screenHeight - marginTop + LOADING_HEIGHT
    const listHeight = listContainerHeight - LOADING_HEIGHT;

    return (

        <View style={{ flex: 1 }} >
            <GestureHandlerRootView>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[{ height: listContainerHeight, marginTop: marginTop }, animatedStyle]}>
                        <View style={{ height: LOADING_HEIGHT, justifyContent: 'center' }}>
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
                                        color="red"
                                        strokeWidth={strokeWidth}
                                        start={0}
                                        end={progress}
                                        opacity={progress}
                                    />
                                </Canvas>
                            </Animated.View>
                        </View>
                        <GestureDetector
                            gesture={Gesture.Simultaneous(scrollGesture, tapGesture)}>
                            <Animated.ScrollView
                                bounces={false}
                                style={{ height: listHeight, backgroundColor: '#0ac' }}
                                contentContainerStyle={{ alignItems: 'center' }}
                                onScroll={scrollHandler}
                                scrollEventThrottle={1}
                                onLayout={(event) => {
                                    const { x, y, width, height } = event.nativeEvent.layout;
                                }}
                            >
                                {Array(100)
                                    .fill(1)
                                    .map((_, index) => (
                                        <Text style={{ height: 60 }} key={index}>{index}</Text>
                                    ))}
                            </Animated.ScrollView>
                        </GestureDetector>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
            <View style={{ width: '100%', position: 'absolute' }}>
                <GeneralStatusBarColor barStyle='light-content' backgroundColor='black' hidden={false} />
                <Text style={{ fontSize: 20, width: '100%', height: 50, justifyContent: 'center', backgroundColor: 'black', textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>模拟标题栏</Text>
            </View>
        </View>
    );
}