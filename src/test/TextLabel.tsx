import React from 'react';

import { PixelRatio, StyleSheet, Text, View, Image } from 'react-native';

export default function TextLabel() {
    return (
        <View style={[styles.container]} >
            <View style={[styles.cell]}>
                <Image source={require('./../image/free.png')} />
                <Text>污染中文互联网，AI成了“罪魁祸首”之一。 近日，有位网友在问了Bing一个问题后，顺手点开了回复下方的链接。他发现用户主页的回答都比较“机里机气”，后来发现，在这些话语的背后，其实是AI在操纵。类似这样的情况还有很多...... AI已经在侵占互联网阵地，未来如何？</Text>
                <Image source={require('./../image/expand.png')} />
            </View>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    cell: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginHorizontal: 8
    },
    child: {
        borderColor: '#D0D0D0',
        borderWidth: 1 / PixelRatio.get(),
        borderRadius: 5,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 10,
        marginTop: 10,
    }
});
