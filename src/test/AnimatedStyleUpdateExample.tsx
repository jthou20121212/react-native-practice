
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
  } from 'react-native-reanimated';
  import { View, Button } from 'react-native';
  import React from 'react';
  
  function AnimatedStyleUpdateExample(): React.ReactElement {
    const randomWidth = useSharedValue(10);
  
    const style = useAnimatedStyle(() => {
      console.log('==Animated==')
      return {
        width: withTiming(randomWidth.value),
      };
    });
  
    console.log('==render==')
  
    return (
      <View>
        <Animated.View
          style={[
            { width: 100, height: 30, backgroundColor: 'cornflowerblue'},
            style,
          ]}
        />
        <Button
          title="切换宽度"
          onPress={() => {
            randomWidth.value = Math.random() * 350;
          }}
        />
      </View>
    );
  }

  export default AnimatedStyleUpdateExample