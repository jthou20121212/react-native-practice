import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    withTiming,
    withSpring,
    SharedValue,
    scrollTo,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    cancelAnimation,
    useAnimatedRef,
    runOnJS
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DATA = [
    '复耕补种进行时',
    '张伟丽卫冕UFC女子草量级金腰带',
    '演训首日45架次解放军军机现身台海',
    '多地市监部门加入医药反腐风暴',
    '景区游客被吸入水上乐园排水口身亡',
    '痞幼追星Angelababy',
    '21岁姑娘暴瘦30斤结果悔惨',
    '伪装成功人士相亲实际为杀猪',
    '为何多次威胁用核武？俄外长回应',
    '李荣浩演唱会抓包提前走的粉丝',
    '男子被骗去缅甸电诈3年遭4次转卖',
    '丈夫反对妻子成网红把家全砸了',
    '甘肃一古建筑被改造成日式餐厅',
    '医生在面馆对女子说她可能有肿瘤',
    '马斯克要砍掉X“屏蔽”功能',
    '美媒：好莱坞电影打不过中国电影了',
    '白俄总统：普京曾提出掩护请求',
    '许家印“离婚”是在曲线避债吗？',
    'SUV连撞多车 亲历者:肇事司机在冷笑',
    '游客曝导游强制购物还不让提前走',
    '吴艳妮回应网友质疑在赛场太高调',
    '男子在山洪来前30秒救下一家3口',
    '乌防长称要辞职：不是我理想的工作',
    '林俊杰被激光笔照眼',
    '骑手被商家冤枉偷餐到店当面对峙',
    '超长三伏天终于结束了热',
    '98岁老人吃免费早饭 因没有豆腐砸店',
    '800多赞的朋友圈长什么样',
    '一岁多孩子高铁哭闹遭女子要求闭嘴'
]

const CELL_HEIGHT = 60
const SEPARATOR_HEIGHT = 0.5

type DragDropCellProps = {
    topMap: SharedValue<number[]>,
    item: string,
    index: number,
    scrollY: SharedValue<number>
}

function DragDropCell({ topMap, item, index, scrollY }: DragDropCellProps) {

    const insets = useSafeAreaInsets();
    const dimensions = useWindowDimensions();
    const top = useSharedValue(topMap.value[index]);
    const moving = useSharedValue(false);
    const changeY = useSharedValue(topMap.value[index]);

    const panGesture = Gesture.Pan()
        .activateAfterLongPress(500)
        .onChange((e) => {
            // 累加平移量
            changeY.value += e.changeY;
            // 改变当前拖动的 cell 的位置
            top.value = changeY.value;
            // 改变当前拖动的 cell 覆盖的 cell 的位置

        })
        .onStart((e) => {
            moving.value = true;
        })
        .onEnd((e) => {
            moving.value = false;
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            left: 0,
            right: 0,
            top: top.value,
            zIndex: moving.value ? 1 : 0,
            shadowColor: 'black',
            shadowOffset: {
                height: 0,
                width: 0,
            },
            shadowOpacity: withSpring(moving.value ? 0.2 : 0),
            shadowRadius: 10,
        };
    }, [moving]);

    return (<GestureDetector gesture={panGesture} >
        <Animated.View style={[styles.cell, animatedStyle]} >
            <Text style={styles.text} >{item}</Text>
        </Animated.View>
    </GestureDetector>)
}

export default function DragDropFlatList() {

    const scrollY = useSharedValue(0);
    // const scrollViewRef = useAnimatedRef();

    // useAnimatedReaction(
    //     () => scrollY.value,
    //     (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
    // );

    const topMap = useSharedValue(DATA.map((value, index) => {
        return index * CELL_HEIGHT;
    }));


    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;

        console.log('jthou', 'scrollY.value : ' + scrollY.value);
    });

    const renderItem = (item: string, index: number) => {
        return <DragDropCell topMap={topMap} item={item} index={index} scrollY={scrollY} />
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
            <Animated.ScrollView
                // ref={scrollViewRef}
                style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: 'green'
                }}
                contentContainerStyle={{
                    height: DATA.length * CELL_HEIGHT,
                }}
                data={DATA}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                overScrollMode={'never'}
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    console.log('jthou', 'y : ' + y);
                }}
            >
                {DATA.map((value, index) => (
                    <DragDropCell
                        topMap={topMap}
                        item={value}
                        index={index}
                        scrollY={scrollY} />
                ))}

            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'red'
    },
    cell: {
        width: '100%',
        height: CELL_HEIGHT,
        backgroundColor: 'white',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    text: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
        lineHeight: CELL_HEIGHT
    },
    separator: {
        height: SEPARATOR_HEIGHT,
        backgroundColor: 'grey'
    }
})