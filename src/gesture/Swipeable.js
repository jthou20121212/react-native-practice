import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Button, StatusBar } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d71',
        title: 'Fourth Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d70',
        title: 'Fifth Item',
    },
];

export default function App() {
    const [listData, setListData] = useState(DATA);
    let row = [];
    let prevOpenedRow;

    /**
     *
     */
    const renderItem = ({ item, index }, onClick) => {
        //
        const closeRow = (index) => {
            console.log('closerow');
            if (prevOpenedRow && prevOpenedRow !== row[index]) {
                prevOpenedRow.close();
            }
            prevOpenedRow = row[index];
        };

        const renderRightActions = (progress, dragX, onClick) => {
            return (
                <View
                    style={{
                        margin: 0,
                        alignContent: 'center',
                        justifyContent: 'center',
                        width: 70,
                    }}>
                    <Button color="red" onPress={onClick} title="DELETE"></Button>
                </View>
            );
        };

        return (
            <GestureHandlerRootView>
                <Swipeable
                    renderRightActions={(progress, dragX) =>
                        renderRightActions(progress, dragX, onClick)
                    }
                    onSwipeableOpen={() => closeRow(index)}
                    ref={(ref) => (row[index] = ref)}
                    rightOpenValue={-100}>
                    <View
                        style={{
                            margin: 4,
                            borderColor: 'grey',
                            borderWidth: 1,
                            padding: 9,
                            backgroundColor: 'white',
                        }}>
                        <Text>{item.title}</Text>
                    </View>
                </Swipeable>
            </GestureHandlerRootView>
        );
    };

    const deleteItem = ({ item, index }) => {
        console.log(item, index);
        let a = listData;
        a.splice(index, 1);
        console.log(a);
        setListData([...a]);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={listData}
                renderItem={(v) =>
                    renderItem(v, () => {
                        console.log('Pressed', v);
                        deleteItem(v);
                    })
                }
                keyExtractor={(item) => item.id}></FlatList>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});