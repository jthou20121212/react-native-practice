import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StatusBar, Dimensions, Image } from 'react-native';
import Animated, {
    Layout,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    runOnJS,
    Easing,
    withTiming,
    withRepeat,
    interpolateColor,
    runOnUI,
} from 'react-native-reanimated';
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import GeneralStatusBarColor from '../component/GeneralStatusBarColor'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const LOADING_HEIGHT = 70;
const MAX_PULL_RATE = 2.4

// header 高度 60
// 最大下拉高度 = header 高度 * 2.4
// 触发刷新高度 = header 高度 * 1
export default function PanAndFlatList() {

    useEffect(() => {
        StatusBar.setBackgroundColor('#00000000');
    }, []);

    const colors = [
        'red',
        'green',
        'blue'
      ]

    // 屏幕高度（状态栏 + 窗口高度 + 导航栏高度）
    const screenHeight = Dimensions.get('screen').height;
    // 状态栏高度
    const statusBarHeight = StatusBar.currentHeight || 44;
    // 窗口高度
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const imageHeight = windowWidth / 5 * 4;

    const refreshY = useSharedValue(-LOADING_HEIGHT);
    const spinner = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const rotate = useSharedValue('0deg');
    const progress = useSharedValue(0);

    const animatedWidth = useSharedValue(windowWidth);
    const animatedHeight = useSharedValue(imageHeight);
    // const animatedScaleX = useSharedValue(1);
    // const animatedScaleY = useSharedValue(1);
    const animatedTranslateX = useSharedValue(0);
    const animatedTranslateY = useSharedValue(0);

    const [alpha, setAlpha] = useState(0);
    const tintColor = useSharedValue(0);

    const tintColorStyle = useAnimatedStyle(() => {
        return {
            tintColor: interpolateColor(
                tintColor.value,
                [0, 1],
                ['white', 'black']
            ),
        };
    });

    const statusBarStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                tintColor.value,
                [0, 1],
                ['#ffffff00', '#ffffffff']
            ),
        };
    });

    const titleBarStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                tintColor.value,
                [0, 1],
                ['#00000000', '#000000ff']
            ),
            backgroundColor: interpolateColor(
                tintColor.value,
                [0, 1],
                ['#ffffff00', '#ffffffff']
            )
        };
    });

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: animatedWidth.value,
            height: animatedHeight.value,
            transform: [
                // { scaleX: animatedScaleX.value },
                // { scaleY: animatedScaleY.value },
                { translateX: animatedTranslateX.value },
                { translateY: animatedTranslateY.value },
            ]
        };
    });

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

        console.log('', 'simulateRefresh');

        setTimeout(() => {
            spinner.value = 0;
            rotate.value = '0deg';
            refreshY.value = withTiming(-LOADING_HEIGHT, {
                duration: 300,
                easing: Easing.ease
            });
            transformImage(0, true)
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

    const transformImage = (percent: number, timing: boolean) => {
        'worklet';
        const rate = 1 + percent * 0.4;
        const newWidth = windowWidth * rate;
        const newHeight = newWidth / 5 * 4;

        animatedWidth.value = timing ? withTiming(newWidth) : newWidth;
        animatedHeight.value = timing ? withTiming(newHeight) : newHeight;;

        // animatedScaleX.value = timing ? withTiming(rate) : rate;
        // animatedScaleY.value = timing ? withTiming(rate) : rate;

        animatedTranslateX.value = timing ? withTiming((windowWidth - newWidth) / 2) : (windowWidth - newWidth) / 2
        animatedTranslateY.value = timing ? withTiming((imageHeight - newHeight) / 2) : (imageHeight - newHeight) / 2
    
        console.log('jthou', `animatedTranslateX.value : ${animatedTranslateX.value}`);
    }

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

                const percent = y / LOADING_HEIGHT;
                transformImage(percent, false)

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

                transformImage(0, true)
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

                transformImage(1, true)

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

            tintColor.value = Math.min(scrollY.value / LOADING_HEIGHT / 2, 1);

            // runOnJS(setAlpha)(tintColor.value)

            // console.log('jthou', `opacity.value : ${tintColor.value}`);
            // console.log('jthou', `backgroundColor : ${backgroundColor}`);
        },
    });


    const listContainerHeight = screenHeight + LOADING_HEIGHT
    const listHeight = listContainerHeight - LOADING_HEIGHT;
    const backgroundColor = `rgba(255,255,255,${tintColor.value})`

    return (
        <>
            <Animated.Image
                style={[
                    {
                        width: windowWidth,
                        height: imageHeight,
                    },
                    imageStyle
                ]}
                resizeMode="cover"
                source={{ uri: 'https://img.huxiucdn.com/test/img/pro_banner/202302/06/184222689658.jpeg' }}
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    console.log('jthou', `图片宽度：${width}`);
                    console.log('jthou', `图片高度：${height}`);
                }}
            />
            <Animated.View style={[
                {
                    width: windowWidth,
                    height: imageHeight,
                    position: 'absolute',
                    backgroundColor: '#0000004d'
                }, imageStyle
            ]} />
            <GestureHandlerRootView style={{
                position: 'absolute',
                width: '100%',
                height: listContainerHeight,
            }} >
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[animatedStyle]}>
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
                                        color="black"
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
                            <Animated.FlatList
                                bounces={false}
                                ListHeaderComponent={<View style={{ width: '100%', height: 150 }} />}
                                style={{ height: listHeight }}
                                data={Array(100).fill(1).map((_, index) => (
                                    `item ${index}`
                                ))}
                                onScroll={scrollHandler}
                                scrollEventThrottle={1}
                                onLayout={(event) => {
                                    const { x, y, width, height } = event.nativeEvent.layout;
                                    console.log('jthou', `列表高度：${height}`);
                                }}
                                renderItem={({ item, index }) => (
                                    <Text style={{
                                        fontSize: 20,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        width: '100%',
                                        height: 60,
                                        backgroundColor: colors[index % colors.length]
                                    }} >{item}</Text>
                                )}
                            />
                        </GestureDetector>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
            <View style={{ width: '100%', position: 'absolute' }} >
                <View style={{ width: '100%', position: 'absolute' }} >
                    <Animated.View style={[{ height: StatusBar.currentHeight || 44 }, statusBarStyle]} />
                    <View style={{ width: '100%', position: 'absolute', flexDirection: 'column' }} >
                        <GeneralStatusBarColor barStyle='dark-content' backgroundColor={'#00000000'} hidden={false} />
                        <Animated.Text style={[{ fontSize: 20, width: '100%', height: 46, justifyContent: 'center', textAlign: 'center', textAlignVertical: 'center' }, titleBarStyle]}>模拟标题栏</Animated.Text>
                    </View>
                </View>
                <View style={{ marginTop: StatusBar.currentHeight || 44, flexDirection: 'row', height: 46, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 6 }} >
                    <Animated.Image
                        style={[{
                            width: 28,
                            height: 28,
                            tintColor: 'white'
                        }, tintColorStyle]}
                        source={require('../image/pro_ic_repair_dark.png')}
                    />

                    <Animated.Image
                        style={[{
                            width: 28,
                            height: 28,
                            tintColor: 'white'
                        }, tintColorStyle]}
                        source={require('../image/pro_ic_repair_dark.png')}
                    />
                </View>
            </View>
        </>
    );
}