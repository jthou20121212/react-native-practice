/**
 * @Author: jthou
 * @Date: 2023/8/9 11:20:13
 * @LastEditors: jthou
 * @LastEditTime: 2023/8/9 11:20:13
 * Description: 左滑删除
 */
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StatusBar, Text, View, TouchableWithoutFeedback } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SlideToDeleteListItem, { ListItemRefProps } from './SlideToDeleteListItem';

import generateRandomColor from '../utils/generateRandomColor';

const { width } = Dimensions.get('window');
const maxSlideWidth = width / 3 * 2;

type Item = {
    id: string;
    color: string;
}

function SlideLeftToDelete(): React.ReactElement {

    useEffect(() => {
        const newListData: Item[] = Array(20).fill(undefined).map((_, i) => ({ id: i.toString(), color: generateRandomColor() }) as Item);
        setData(newListData)
    }, []);

    const rowRefs = new Map<string, ListItemRefProps | null>;
    const [data, setData] = useState<Item[]>([]);

    // 比如第一次滑动了 item1
    // 这次又滑动了 item2
    // 需要把 item1 恢复  
    const onDismiss = (id: string) => {
        rowRefs.forEach((value, key) => {
            if (id !== key) {
                value?.reset();
            }
        });
    }

    const slideOption = (id: string) => {
        return <View style={{ width: maxSlideWidth, height: 70, backgroundColor: 'black', flexDirection: 'row' }} >
            <Text style={{ width: maxSlideWidth / 2, backgroundColor: 'grey', textAlign: 'center', lineHeight: 70, color: 'white', fontSize: 20 }} onPress={() => {
                setData((data) => data.filter((item) => id !== item.id));
            }} >删除</Text>
            <Text style={{ width: maxSlideWidth / 2, backgroundColor: 'black', textAlign: 'center', lineHeight: 70, color: 'white', fontSize: 20 }} onPress={() => {
                rowRefs.get(id)?.reset();
            }} >取消</Text>
        </View>
    }

    const renderItem = (item: Item) => {
        return <SlideToDeleteListItem
            ref={(ref) => {
                rowRefs.set(item.id, ref);
            }}
            item={item}
            option={slideOption(item.id)}
            callback={() => {
                onDismiss(item.id);
            }} >
            <Text style={{
                width: width,
                height: 70,
                fontSize: 20,
                textAlign: 'center',
                lineHeight: 70,
                backgroundColor: item.color,
            }}
                onPress={() => {
                    console.log('jthou', 'click item ' + item.id);
                }}
            >id：{item.id}</Text>
        </SlideToDeleteListItem>
    }

    return (
        <GestureHandlerRootView>
            <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }} >
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <FlatList
                    data={data}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={item => item.id}
                    scrollEventThrottle={1}
                    onLayout={(event) => {
                        const { x, y, width, height } = event.nativeEvent.layout;
                        // console.log('列表高度', height);
                    }}
                />
            </View>
        </GestureHandlerRootView>
    );

}

export default SlideLeftToDelete