import React from 'react';
import { View, Button } from 'react-native';
import Animated, {
    interpolateColor, useAnimatedStyle,
    useSharedValue, withTiming
} from 'react-native-reanimated';

const Component = () => {
    const progress = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                ['red', 'green']
            ),
        };
    });

    return (
        <View>
            <Animated.View style={[{ width: 100, height: 100 }, animatedStyle]} />
            <Button
                onPress={() => {
                    progress.value = withTiming(1 - progress.value, { duration: 1000 });
                }}
                title="run animation"
            />
        </View>
    );
};

export default Component;