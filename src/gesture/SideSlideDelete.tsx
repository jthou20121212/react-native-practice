/**
 * @Author: jthou
 * @Date: 2023/8/9 11:19:42
 * @LastEditors: jthou
 * @LastEditTime: 2023/8/9 11:19:42
 * Description: 侧滑删除
 */
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import SlideListItem from './SideSlideDeleteListItem';

const DATA = [
  {
    id: '1',
    title: '政策效果显现 有力推动经济向好',
  },
  {
    id: '2',
    title: '2名救援人员牺牲 最后说把游泳圈套上热',
  },
  {
    id: '3',
    title: '网友在驰援河北队伍偶遇王宝强',
  },
  {
    id: '4',
    title: '我们如何应对极端天气',
  },
  {
    id: '6',
    title: '小杨哥回应捐款2000万为抵税',
  },
  {
    id: '7',
    title: 'TFBOYS十周年彩排现场惊现花轿',
  },
  {
    id: '8',
    title: '涠洲岛大浪扑上路面 游客险被冲海里',
  },
  {
    id: '9',
    title: '张亮麻辣烫羊肉检测出猪鸭肉',
  },
  {
    id: '10',
    title: '台风将树连根拔起 鸭群却纹丝不动',
  },
  {
    id: '11',
    title: '俄军4000吨级军舰剧烈爆炸',
  },
  {
    id: '12',
    title: '专家称投降式睡姿弊大于利',
  },
  {
    id: '13',
    title: '吉林舒兰一副市长被水冲走？官方确认',
  },
  {
    id: '14',
    title: '女前台被患精神病住客砍杀身亡',
  },
  {
    id: '15',
    title: '医药反腐风暴：这次不一样',
  },
  {
    id: '16',
    title: '门头沟抢修人员徒步进入受灾区',
  },
  {
    id: '17',
    title: '收费员拒收5角纸币一把撕毁',
  },
  {
    id: '18',
    title: '女子被村里人吐槽回老家有目的',
  },
  {
    id: '19',
    title: '印尼41岁富婆与闺蜜16岁儿子结婚',
  },
  {
    id: '20',
    title: '意大利欲退出“一带一路”？中方回应',
  }
];

export default function App() {

  const [data, setData] = useState(DATA);

  const onDismiss = useCallback((id: string) => {
    setData((data) => data.filter((item) => id !== item.id));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <View style={styles.container}>
        <Animated.FlatList
          data={data}
          renderItem={({ item, index }) => <SlideListItem
            id={item.id}
            title={item.title}
            callback={onDismiss}
          />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    marginVertical: 15,
    color: 'black',
    FontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  }
});
