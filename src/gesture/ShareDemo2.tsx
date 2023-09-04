import React, { useState } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const DATA = [
    '台风苏拉一天两次登陆广东',
    '4千万粉丝主播“秀才”账号被封',
    '男子不信台风威力开门被吹翻在地',
    '重庆母子人家中去世 警方回应',
    '共盼杭州亚运盛会',
    '万人老小区欲自拆重建 99%业主同意',
    '退伍残疾军人买优惠票乘车被拒',
    '98年民警收到锦旗笑得合不拢嘴',
    '日本接连发生大规模集体食物中毒',
    '女子喂流浪猫被大妈揪发撕打',
    '40岁米兰达·可儿官宣怀四胎',
    '马冬梅任北京平谷区副区长',
    '追踪苏拉海葵双台风',
    '小伙用水桶存私房钱218天共5.3万',
    '开膛手杰克身份疑被破解',
    '招行报告：316万人资产超千万',
    '核污染水排放口检测出氚',
    '10月1日起泰国对中国游客免签',
    '河南信阳一大桥夜晚出现不明飞虫',
    '老人去世留下19份不同遗嘱',
    '胡兵一公排名倒数',
    '封神票房破25亿主创整活',
    '国航航班飞行中现怪异狗叫 紧急备降',
    '中国兵器工业集团发布紧急声明',
    '北京认房不认贷后开发商深夜调价热',
    '天山天池现银色水怪？景区:无法判断',
    '摆拍女业主壁咚外卖员博主道歉',
    '韩国女星订头等舱被降经济舱',
    '专家称A股遍地黄金没人捡'
]

const MAX_VELOCITY = 600
const TRANSLATE_HEIGHT = 100;

/**
 * 标题和摘要可以滑动 TRANSLATE_HEIGHT
 * 列表可以滑动 TRANSLATE_HEIGHT + 摘要的高度（summaryHeight）
 */
export default function ShareDemo2() {

    const { width, height } = Dimensions.get('window');
    const imageHeight = width / 629 * 353;

    const [flatListCanScrollHeight, setFlatListCanScrollHeight] = useState(0);

    const translateY = useSharedValue(0);
    const flatListTranslateY = useSharedValue(0);
    const scrollHeight = useSharedValue(0);

    const translateAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value }
            ]
        }
    })

    const flatListTranslateAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: flatListTranslateY.value }
            ]
        }
    })

    const tapGestrue = Gesture.Tap()
        .onTouchesMove((e, manager) => {
            // 如果外部容器已经滑动到顶部
            // case1 继续往上滑让 FlatList 响应手势，表现是正常的
            // case2 往下滑外部容器和 FlatList 会同时响应事件，外部容器只响应不处理（不改变偏移量）
            if (flatListTranslateY.value === -flatListCanScrollHeight) {
                manager.fail();

                console.log('jthou', 'fail');
            } else {
                manager.activate();
                console.log('jthou', 'ative');
            }
        })

    const scrollGestrue = Gesture.Native()
        .requireExternalGestureToFail(tapGestrue);

    const panGesture = Gesture.Pan()
        .onChange((e) => {
            // 如果 FlatList 有滑动不处理
            if (scrollHeight.value !== 0) return;

            translateY.value = Math.min(0, Math.max(-TRANSLATE_HEIGHT, translateY.value + e.changeY));

            flatListTranslateY.value = Math.min(0, Math.max(-flatListCanScrollHeight, flatListTranslateY.value + e.changeY));;
        })
        .onEnd((e) => {
            if (Math.abs(e.velocityY) < MAX_VELOCITY) return;
            // if (scrollHeight.value !== 0) return;

            if (e.velocityY > 0) {
                flatListTranslateY.value = withTiming(0);
                translateY.value = withTiming(0);

                console.log('jthou', "> 0");
            } else {
                translateY.value = withTiming(-TRANSLATE_HEIGHT);
                flatListTranslateY.value = withTiming(-flatListCanScrollHeight);

                console.log('jthou', "<= 0");
            }
        })
        .simultaneousWithExternalGesture(tapGestrue, scrollGestrue);

    const handleScroll = useAnimatedScrollHandler({
        onScroll: e => {
            scrollHeight.value = e.contentOffset.y;
        }
    })

    return (
        <GestureDetector gesture={panGesture} >
            <View style={styles.container} >
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <View style={{ justifyContent: 'flex-end' }} >
                    <Image
                        style={[
                            {
                                width: width,
                                height: imageHeight,
                            },
                        ]}
                        source={{ uri: 'https://img.huxiucdn.com/test/img/pro_banner/202306/05/142434788388.jpeg' }}
                    />
                    <Animated.Text style={[styles.title, translateAnimatedStyle]} >邀酒摧肠三杯醉</Animated.Text>
                </View>
                <Animated.Text style={[styles.summary, translateAnimatedStyle]}
                    onLayout={(event) => {
                        const { x, y, width, height } = event.nativeEvent.layout;
                        setFlatListCanScrollHeight(height + TRANSLATE_HEIGHT);
                    }}
                >
                    很多人都设想过35岁失业后的去向，“可以开网约车、送快递”。然而，当越来越多的人进入这些行业，原本被视为“退路”的选择开始“内卷”起来了。
                    网约车市场逐渐饱和。今年多地网约车日均接单量不足10单，三亚、长沙暂停受理网约车运输证新增业务。网约车司机“月入过万”的神话，要终结了？中年人去哪再就业？
                </Animated.Text>
                <GestureDetector gesture={Gesture.Simultaneous(tapGestrue, scrollGestrue)} >
                    <Animated.FlatList
                        bounces={false}
                        style={[{ height: height, marginBottom: -(flatListCanScrollHeight) }, flatListTranslateAnimatedStyle]}
                        data={DATA}
                        renderItem={({ item, index }) => <Text style={styles.text} >{item}</Text>}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        keyExtractor={item => item.toString()}
                        onScroll={handleScroll}
                    />
                </GestureDetector>
            </View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        height: 46,
        lineHeight: 46,
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        backgroundColor: '#eeeeee'
    },
    separator: {
        height: 1,
        backgroundColor: 'white'
    },
    title: {
        position: 'absolute',
        padding: 16,
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold'
    },
    summary: {
        padding: 8,
        fontSize: 16,
        backgroundColor: 'white'
    }
})