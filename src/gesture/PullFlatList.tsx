import React, { useEffect, useState, PropsWithChildren, ReactElement } from 'react';
import { Text, View, FlatListProps, StatusBar, Dimensions, Image } from 'react-native';
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
    useDerivedValue
} from 'react-native-reanimated';
import HRefreshHeader from '../component/HRefreshHeader';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const DARG_RATE = 1.0
const LOADING_HEIGHT = 70;
const MAX_PULL_RATE = 2.4

export interface PullHandlers {
    onScroll?: (height: number) => void;
    onBeginDrag?: () => void;
    onEndDrag?: () => void;
}

export type RefreshHeaderProps = PropsWithChildren<{
    pullHeight?: Animated.SharedValue<number>,
    headerHeight: number,
}>;

type PullFlatListProps = PropsWithChildren<{
    // 刷新头高度
    headerHeight?: number;
    // 显示下拉高度/手指真实下拉高度=阻尼效果
    dargRate?: number;
    // 最大显示下拉高度/Header标准高度
    headerMaxDragRate?: number;
    // 刷新头
    refreshHeader?: | React.ComponentType<RefreshHeaderProps>;
    // 回调
    pullHandlers?: PullHandlers
}> & FlatListProps<any>;

// header 高度 60
// 最大下拉高度 = header 高度 * 2.4
// 触发刷新高度 = header 高度 * 1
export default function PullFlatList({
    dargRate = DARG_RATE,
    headerHeight = LOADING_HEIGHT,
    headerMaxDragRate = MAX_PULL_RATE,
    refreshHeader : RefreshHeader = HRefreshHeader,
    // pullHandlers : PullHandlers,
    ...rest
}) {

    useEffect(() => {
        StatusBar.setBackgroundColor('#00000000');
    }, []);

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

    const colors = [
        'red',
        'green',
        'blue'
    ]

    const simulateRefresh = () => {

        console.log('', 'simulateRefresh');

        setTimeout(() => {
            spinner.value = 0;
            // rotate.value = '0deg';
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

                // const percent = y / LOADING_HEIGHT;
                // transformImage(percent, false)

                // progress.value = Math.min(1, (refreshY.value + LOADING_HEIGHT) / LOADING_HEIGHT)

                // console.log('jthou', `list refreshY : ${refreshY.value}`)
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
                // rotate.value = withRepeat(withTiming('-360deg', {
                //     duration: 1000,
                //     easing: Easing.linear
                // }), -1, false);

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

    const { onScroll } = rest;
    const hasOnScroll = Object.keys(rest).includes('onScroll');

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            // 记录偏移量，只能读不能写
            scrollY.value = e.contentOffset.y;

            tintColor.value = Math.min(scrollY.value / LOADING_HEIGHT / 2, 1);

            // runOnJS(setAlpha)(tintColor.value)

            // console.log('jthou', `opacity.value : ${tintColor.value}`);
            // console.log('jthou', `backgroundColor : ${backgroundColor}`);

            // 如果外部有监听行为，不影响外部监听
            if (hasOnScroll) {
                // onScroll
            }
        },
    });


    const listContainerHeight = screenHeight + LOADING_HEIGHT
    const listHeight = listContainerHeight - LOADING_HEIGHT;
    const backgroundColor = `rgba(255,255,255,${tintColor.value})`

    console.log('jthou', `refreshY.value : ${refreshY.value}`)

    return (
        <>
            <GestureHandlerRootView style={{
                position: 'absolute',
                width: '100%',
                height: listContainerHeight,
            }} >
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[{ flex: 1, flexDirection: 'column' }, animatedStyle]}>
                        <RefreshHeader headerHeight={headerHeight} pullHeight={refreshY}  />
                        <GestureDetector
                            gesture={Gesture.Simultaneous(scrollGesture, tapGesture)}>
                            <Animated.FlatList
                                {...rest}
                                // onScroll={scrollHandler}
                            />
                        </GestureDetector>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </>
    );
}