import React from 'react';

import { RectButton, GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { Platform, SectionList, Text, StyleSheet, View, StatusBar } from "react-native";
import { ParamListBase, NavigationContainer } from '@react-navigation/native';

import AnimatedImage from './src/animate/AnimatedImage'
import AnimatedFlatList from './src/animate/AnimatedFlatList'
import PanAndFlatList from './src/gesture/PanAndFlatList'
import ImageViewPager from './src/animate/ImageViewPager'
import InterpolateColor from './src/animate/InterpolateColor'
import FingerFollow from './src/gesture/FingerFollow'
import SlideToDelete from './src/gesture/SlideToDelete'
import SideSlideDelete from './src/gesture/SideSlideDelete'
import Club from './src/gesture/club/Club'
import BottomSheet from './src/gesture/bottomsheet/App'
import DragSort from './src/gesture/react-native-reanimated-drag-sort_apple-music'
import DragDropFlatList from './src/gesture/DragDropFlatList'
import ShareDemo1 from './src/gesture/ShareDemo1'
import ShareDemo2 from './src/gesture/ShareDemo2'

import Triangle from './src/draw/Triangle'
import WaterDrop from './src/draw/WaterDrop'
import HelloWorld from './src/draw/HelloWorld'
import AnimationWithTouchHandler from './src/draw/AnimationWithTouchHandler'

import RecyclerListView from './src/route/Router'

import FlowLayout from './src/component/FlowLayout'
import ExpandText from './src/component/ExpandText'
import MoreOrLess from './src/component/MoreLessUsage'
import MoreLessText from './src/component/MoreLessText'
import Overlap from './src/animate/Overlap'
import Transforms from './src/animate/Transforms'

import TextLabel from './src/test/TextLabel'
import Simple from './src/test/Simple'
import zIndexAndPosition from './src/test/zIndexAndPosition'
import AnimatedStyleUpdateExample from './src/test/AnimatedStyleUpdateExample'

const EXAMPLES = [
  {
    title: '动画&手势',
    data: [
      { name: 'Image', component: AnimatedImage },
      { name: 'FlatList', component: AnimatedFlatList },
      { name: 'PanAndFlatList', component: PanAndFlatList },
      { name: 'FingerFollow', component: FingerFollow },
      { name: 'ImageViewPager', component: ImageViewPager },
      { name: 'SlideToDelete', component: SlideToDelete },
      { name: 'SideSlideDelete', component: SideSlideDelete },
      { name: 'Club', component: Club },
      { name: 'BottomSheet', component: BottomSheet },
      { name: 'DragDropFlatList', component: DragDropFlatList },
      { name: 'ShareDemo1', component: ShareDemo1 },
      { name: 'ShareDemo2', component: ShareDemo2 },
      // { name: 'DragSort', component: DragSort },
    ]
  },
  {
    title: '绘制',
    data: [
      { name: 'Triangle', component: Triangle },
      { name: 'WaterDrop', component: WaterDrop },
      { name: 'HelloWorld', component: HelloWorld },
      { name: 'AnimationWithTouchHandler', component: AnimationWithTouchHandler }
    ]
  },
  {
    title: 'RecyclerListView',
    data: [
      { name: '不同场景下的表现对比', component: RecyclerListView},
    ]
  },
  {
    title: '其他',
    data: [
      { name: 'FlowLayout', component: FlowLayout },
      { name: 'ExpandText', component: ExpandText },
      { name: 'MoreOrLess', component: MoreOrLess },
      { name: 'MoreLessText', component: MoreLessText },
      { name: 'Overlap', component: Overlap },
      { name: 'Transforms', component: Transforms },
      { name: 'InterpolateColor', component: InterpolateColor },
    ]
  },
  {
    title: '测试',
    data: [
      { name: 'TextLabel', component: TextLabel },
      { name: 'zIndexAndPosition', component: zIndexAndPosition },
      { name: '改变宽度动画', component: AnimatedStyleUpdateExample },
      { name: '一个测试', component: Simple },
    ]
  }
]

interface HomeScreenCellProps {
  name: string;
  onPressItem: (name: string) => void;
}

const HomeScreenCell = ({ name, onPressItem }: HomeScreenCellProps) => {
  return (
    <RectButton style={[styles.button]} onPress={() => onPressItem(name)}>
      <Text>{name}</Text>
    </RectButton>
  );
}

const HomeScreen = ({ navigation }: StackScreenProps<ParamListBase>) => {
  return (<View style={styles.container} >
    <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
    <SectionList
      style={styles.list}
      sections={EXAMPLES}
      keyExtractor={(example) => example.name}
      renderItem={({ item }) => (
        <HomeScreenCell
          name={item.name}
          onPressItem={(name) => navigation.navigate(name)}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  </View>);
}

type RootStackParamList = {
  Home: undefined;
} & {
  [Screen: string]: undefined;
}

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ title: '✌️ React Native Practice' }}
            component={HomeScreen}
          />
          {EXAMPLES.flatMap(({ data }) => data).flatMap(
            ({ name, component }) => (
              <Stack.Screen
                key={name}
                name={name}
                getComponent={() => component}
                options={{ headerShown: true }}
              />
            )
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  sectionTitle: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: '500',
      },
      android: {
        fontSize: 19,
        fontFamily: 'sans-serif-medium',
      },
    }),
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    backgroundColor: '#efefef',
  },
  list: {
    flex: 1
  },
  separator: {
    height: 2,
  },
  button: {
    flex: 1,
    height: 50,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});