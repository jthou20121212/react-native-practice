import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StatusBar, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const imageHeight = width / 629 * 353;

const TITLE_TRANSLATE_HEIGHT = 100
const MAX_VELOCITY = 600

function AnimatedFlatList(): React.ReactElement {

  const colors = [
    'red',
    'green',
    'blue'
  ]
  const [data, setData] = useState<number[]>([]);

  const contontRef = useRef(null);
  // 内容的高度，也是 FlatList 要平移的高度
  const [contentHeight, setContentHeight] = useState(0);

  // 标题和内容要平移的高度
  const translateTitleY = useSharedValue(0);
  // 列表要平移的高度
  const translateFlatListY = useSharedValue(0);

  // FlatList 滚动高度
  const flatListScrollHeight = useSharedValue(0);

  // 标记要处理 fling 事件
  const flingEvent = useSharedValue(false);

  const renderItem = (item: number, index: number) => {
    return <View style={{ height: 120, backgroundColor: colors[index % colors.length], justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }} >index：{index}</Text>
    </View>
  }

  useEffect(() => {
    const newListData: number[] = Array(20).fill(undefined).map((_, i) => i);
    setData(newListData)
  }, []);

  const tapGesture = Gesture.Tap()
    .onTouchesMove((e, manager) => {
      // 列表偏移量已经到指定位置
      if (contentHeight === -translateFlatListY.value && translateFlatListY.value != 0) {
        manager.fail();

        // console.log('tapGesture', 'fail');

      } else {
        manager.activate();

        // console.log('tapGesture', 'activate');

        // console.log('tapGesture', contentHeight);
        // console.log('tapGesture', -translateFlatListY.value);
      }
    })
    .maxDuration(1000000);

  const scrollGesture = Gesture.Native()
    .requireExternalGestureToFail(tapGesture);

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      // console.log('panGesture', 'onChange ' + flatListScrollHeight.value);

      // 如果 flatListScrollHeight.current !== 0 说明 FlatList 处于滚动状态不需要处理
      if (flatListScrollHeight.value !== 0) return;
      // 如果默认状态下往下滚动不处理
      if (translateFlatListY.value === 0 && e.changeY > 0) return;

      // 负数：往上滚动
      // 正数：往下滚动

      // 因为下面的判断条件会用到这里 translateContentY 所以这一坨代码比如放在下一坨前面
      // 列表最多滚动内容高度 + TITLE_TRANSLATE_HEIGHT
      const case3 = -translateFlatListY.value < contentHeight && e.changeY < 0
      const case4 = translateFlatListY.value < 0 && e.changeY > 0;
      if (case3 || case4) {
        const tempHeight = translateFlatListY.value + e.changeY
        const scrollHeight =
          e.changeY < 0 ? (-tempHeight > contentHeight ? -contentHeight : tempHeight)
            : (tempHeight > 0 ? 0 : tempHeight);
        translateFlatListY.value = scrollHeight;
      }
      // 标题最多滚动 TITLE_TRANSLATE_HEIGHT 
      const case1 = -translateTitleY.value < TITLE_TRANSLATE_HEIGHT && e.changeY < 0
      const case2 = translateTitleY.value < 0 && e.changeY > 0 && -translateFlatListY.value <= TITLE_TRANSLATE_HEIGHT;
      if (case1 || case2) {
        const tempHeight = translateTitleY.value + e.changeY
        const scrollHeight =
          e.changeY < 0 ? (-tempHeight > TITLE_TRANSLATE_HEIGHT ? -TITLE_TRANSLATE_HEIGHT : tempHeight)
            : (tempHeight > 0 ? 0 : tempHeight);
        translateTitleY.value = scrollHeight;
      }

      console.log('jthou', 'onChange');
    })
    .onStart((e) => {
      // console.log('panGesture', 'onStart ' + JSON.stringify(e));
      flingEvent.value = false;
    })
    .onEnd((e) => {
      // console.log('panGesture', 'onEnd ' + JSON.stringify(e));
      // 负数：往上滚动
      // 正数：往下滚动
      if (Math.abs(e.velocityY) < MAX_VELOCITY) return;
      if (flatListScrollHeight.value !== 0) return;

      flingEvent.value = true;
      if (e.velocityY > 0) {
        translateTitleY.value = translateFlatListY.value = 0;
      } else {
        translateTitleY.value = -TITLE_TRANSLATE_HEIGHT;
        translateFlatListY.value = -contentHeight;
      }

      console.log('jthou', 'onEnd');
    })
    .simultaneousWithExternalGesture(scrollGesture, tapGesture);

  const titleStyle = useAnimatedStyle(() => {
    return {
      // translateY: withTiming(translateTitleY.value)
     
      transform: [{
        translateY: flingEvent.value ? withTiming(translateTitleY.value, {
          duration: 100,
        }, (finished) => {
          // if (finished) {
          //   console.log("ANIMATION ENDED");
          // } else {
          //   console.log("ANIMATION GOT CANCELLED");
          // }
        }) : translateTitleY.value
      }],
    }
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      // translateY: withTiming(translateContentY.value)
      
      transform: [{
        translateY: flingEvent.value ? withTiming(translateFlatListY.value, {
          duration: 100,
        }, (finished) => {
          // if (finished) {
          //   console.log("ANIMATION ENDED");
          // } else {
          //   console.log("ANIMATION GOT CANCELLED");
          // }
        }) : translateFlatListY.value
      }],
    }
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      flatListScrollHeight.value = e.contentOffset.y;

      // console.log('scrollHandler', JSON.stringify(e));
    },
  });

  return (
    <GestureHandlerRootView style={{ width: '100%', height: '100%', backgroundColor: 'black' }} >
      <GestureDetector gesture={panGesture} >
        <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }} >
          <StatusBar translucent={true} backgroundColor={'transparent'} />
          <View style={{ justifyContent: 'flex-end' }} >
            <Animated.Image
              style={[
                {
                  width: width,
                  height: imageHeight,
                },
              ]}
              source={{ uri: 'https://img.huxiucdn.com/test/img/pro_banner/202306/05/142434788388.jpeg' }}
            />
            <Animated.Text style={[{
              position: 'absolute',
              padding: 16,
              fontSize: 24,
              color: 'white',
              fontWeight: 'bold',
            }, titleStyle]} >邀酒摧肠三杯醉</Animated.Text>
          </View>
          <Animated.Text ref={contontRef} style={[{ padding: 8, fontSize: 16, backgroundColor: 'white' }, titleStyle]}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              setContentHeight(height + TITLE_TRANSLATE_HEIGHT);
            }}  >
            很多人都设想过35岁失业后的去向，“可以开网约车、送快递”。然而，当越来越多的人进入这些行业，原本被视为“退路”的选择开始“内卷”起来了。
            网约车市场逐渐饱和。今年多地网约车日均接单量不足10单，三亚、长沙暂停受理网约车运输证新增业务。网约车司机“月入过万”的神话，要终结了？中年人去哪再就业？
          </Animated.Text>
          <GestureDetector
            gesture={Gesture.Simultaneous(scrollGesture, tapGesture)} >
            <Animated.FlatList
              bounces={false}
              style={[{ width: '100%', height: '100%', marginBottom: -contentHeight }, contentStyle]}
              contentContainerStyle={{ flexGrow: 1 }}
              data={data}
              renderItem={({ item, index }) => renderItem(item, index)}
              keyExtractor={item => item.toString()}
              scrollEventThrottle={1}
              onScroll={scrollHandler}
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                // console.log('列表高度', height);
              }}
            />
          </GestureDetector>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );

}

export default AnimatedFlatList