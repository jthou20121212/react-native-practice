
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View, Button, Dimensions, StatusBar } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');
const height = width / 5 * 4;

function AnimatedImage(): React.ReactElement {

  const animatedWidth = useSharedValue(width);
  const animatedHeight = useSharedValue(height);
  const animatedScaleX = useSharedValue(1);
  const animatedScaleY = useSharedValue(1);
  const animatedTranslateX = useSharedValue(0);
  const animatedTranslateY = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(animatedWidth.value),
      height: withTiming(animatedHeight.value),
      transform: [
        { scaleX: withTiming(animatedScaleX.value) },
        { scaleY: withTiming(animatedScaleY.value) },
        { translateX: withTiming(animatedTranslateX.value) },
        { translateY: withTiming(animatedTranslateY.value) },
      ]
    };
  });

  // const style = useAnimatedStyle(() => {
  //   return {
  //     width: withTiming(animatedWidth.value),
  //     height: withTiming(animatedHeight.value),
  //     scaleX: withTiming(animatedScaleX.value),
  //     scaleY: withTiming(animatedScaleY.value),
  //     translateX: withTiming(animatedTranslateX.value),
  //     translateY: withTiming(animatedTranslateY.value),
  //   };
  // });

  return (
    <View>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <Animated.Image
        style={[
          {
            width: width,
            height: height,
          },
          style
        ]}
        source={{ uri: 'https://img.huxiucdn.com/test/img/pro_banner/202302/06/184222689658.jpeg' }}
      />
      <Button
        title="点击切换图片宽度"
        onPress={() => {
          const newWidth = width * 1.5;
          const newHeight = newWidth / 5 * 4;

          animatedWidth.value = newWidth;
          animatedHeight.value = newHeight;

          animatedScaleX.value = 1.5
          animatedScaleY.value = 1.5

          animatedTranslateX.value = (width - newWidth) / 2
          animatedTranslateY.value = (height - newHeight) / 2

        }}
      />
    </View>
  );
}

export default AnimatedImage