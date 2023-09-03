import React from 'react';
import { FlatListProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

type SimpleFlatListProps = {
    style?: StyleProp<ViewStyle> | undefined;
} & Partial<FlatListProps<any>>

export default function SimpleFlatList({ style, ...rest }: SimpleFlatListProps) {

    const { onScroll } = rest;
    console.log('jthou', 'onScroll : ' + onScroll);
    console.log('jthou', 'onScroll typeof : ' + typeof onScroll);

    const renderItem = (item: string, index: number) => {
        return (
            <View style={styles.item} >
                <Text style={{ fontSize: 20 }} >{item}</Text>
            </View>
        )
    }

    return (
        <Animated.FlatList
            style={style}
            data={Array(18).fill(undefined).map((_, index) => `item : ${index}`)}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(_, index) => index.toString()}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
