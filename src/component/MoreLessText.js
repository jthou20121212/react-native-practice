import React, { useState } from 'react';

import { View, Text, Image, useWindowDimensions, Pressable } from 'react-native';

export default function MoreLessText({ route, navigation }) {

    const [showAllContent, setShowAllContent] = useState(false)

    const { width, height } = useWindowDimensions();

    const { children, numberOfLines } = route.params;

    return (

        <>
            {
                showAllContent ? (<Text
                    style={{
                        fontSize: 14,
                        lineHeight: 20,
                    }}
                >
                    <Image
                        style={{
                            width: 27, height: 16
                        }}
                        source={require('../image/free.png')}
                    />
                    {children}
                </Text>) : (<View>
                    <Text
                        style={{
                            fontSize: 14,
                            lineHeight: 20,
                        }}
                        numberOfLines={numberOfLines}
                        ellipsizeMode='tail'
                        onLayout={(event) => {
                            const { x, y, width, height } = event.nativeEvent.layout;
                        }}
                    >
                        <Image
                            style={{
                                width: 27, height: 16
                            }}
                            source={require('../image/free.png')}
                        />
                        {children}
                    </Text>
                    <Pressable
                        style={{
                            position: 'absolute',
                            marginTop: 20 * 3,
                            marginStart: width - 46
                        }}
                        onPress={() => {
                            setShowAllContent(true);
                        }} >
                        <Image
                            style={{
                                width: 46,
                                height: 20,
                            }}
                            source={require('../image/expand.png')}
                        />
                    </Pressable>
                </View>)
            }
        </>


    )
}
