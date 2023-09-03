import React from 'react';
import { Text, View, Dimensions, LayoutChangeEvent } from 'react-native';
import PullFlatList from "../gesture/PullFlatList";
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

export default function PullRefreshLayout() {

    const colors = [
        'red',
        'green',
        'blue'
    ]

    // 窗口高度
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const imageHeight = windowWidth / 5 * 4;

    return <>
        <Animated.Image
            style={[
                {
                    width: windowWidth,
                    height: imageHeight,
                },
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
            }
        ]} />
        <PullFlatList
            bounces={false}
            overScrollMode='never'
            ListHeaderComponent={<View style={{ width: '100%', height: 150 }} />}
            data={Array(100).fill(1).map((_, index) => (
                `item ${index}`
            ))}
            scrollEventThrottle={1}
            onLayout={(event: LayoutChangeEvent) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                console.log('jthou', `列表高度：${height}`);
            }}
            renderItem={({item, index}) => (
                <Text style={{
                    fontSize: 20,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    width: '100%',
                    height: 60,
                    backgroundColor: colors[index % colors.length]
                }}>{item}</Text>
            )} 
            />
    </>

}