import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar
} from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Club, { Location } from './Club';
import SimpleFlatList from '../../component/SimpleFlatList';

export default function App() {

    const statusBarHeight = StatusBar.currentHeight || 44;

    const [title, setTitle] = useState('我是标题');

    return (
        <GestureHandlerRootView style={styles.container} >
            <View style={{ flex: 1, backgroundColor: 'yellow' }}>
                <View style={styles.background} ><Text style={styles.text} >我是背景列表</Text></View>
                <View style={{
                    width: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: statusBarHeight + 10
                }}>
                    <Text style={styles.text} >{title}</Text>
                </View>
                <Club callback={(location) => {
                    switch (location) {
                        case Location.TOP:
                            setTitle('顶部');
                            break;
                        case Location.MIDDLE:
                            setTitle('中部');
                            break;
                        case Location.BOTTOM:
                            setTitle('底部');
                            break;
                    }
                }} >
                    {/* <GestureDetector>
                        <SimpleFlatList />
                    </GestureDetector> */}
                </Club>
            </View>
        </GestureHandlerRootView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green'
    },
    text: {
        color: 'white',
        fontSize: 20
    }
});