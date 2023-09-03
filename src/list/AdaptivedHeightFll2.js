import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";

export default function AdaptivedHeightFll2() {

    const pageSize = 1000;
    const pageNumber = useRef(0);
    const canLoadMore = useRef(true);
    const [data, setData] = useState([]);
    const [loadMoreStatus, setLoadMoreStatus] = useState(true);

    let { width, height } = Dimensions.get("window");

    useEffect(() => {
        fetchData();
    }, []);

    const _rowRenderer = (data, index) => {
        return (
            <View
                style={{ flex: 1, flexDirection: 'row' }}>
                <Image
                    style={{
                        marginTop: 10,
                        marginBottom: 10,
                        marginStart: 16,
                        width: 100,
                        height: 100,
                        borderRadius: 6
                    }}
                    source={{
                        uri: data.url
                    }}
                />
                <View style={{ flex: 1, flexDirection: 'column', marginTop: 10, marginStart: 14, marginEnd: 16 }}>
                    <Text style={{ fontSize: 18, color: '#303030' }} >{data.title}</Text>
                    <Text
                        style={{ fontSize: 14, color: '#606060', marginTop: 6 }}
                    >
                       {data.summary}
                    </Text>
                    <Text style={{ fontSize: 10, marginTop: 6, color: '#C0C0C0' }} >{data.time} {"  "} {index} {"  FlashList"} </Text>
                </View>
            </View>
        );
    }

    const fetchData = () => {
        if (!canLoadMore.current) {
            return;
        }
        canLoadMore.current = false;
        pageNumber.current += 1;
        setLoadMoreStatus(true);
        setTimeout(() => {
            fetchDataInternal();
        }, 300);
    }

    const fetchDataInternal = () => {
        const newData = Array(pageSize).fill(undefined).map((_, index) => {
            const count = Math.random() * (11 - 1) + 1;
            return ({
                id: `item ${(pageNumber.current - 1) * pageSize + index}`,
                title: "库克的下一张王牌是什么？",
                summary: "市值2.6万亿美元的苹果交出了2023财年第二季度财报".repeat(count),
                time: "2023-05-06",
                url: "https://img.huxiucdn.com/test/img/brief_content/202305/06/130607897468.png"
            })
        });

        setData((current) => [...current, ...newData]);
        setLoadMoreStatus(false);
        canLoadMore.current = true;
    }

    const ListFooter = () => {
        return <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 64,
        }}>
            <ActivityIndicator
                style={{ margin: 10 }}
                size="large"
                color={'black'}
            />
        </View>;
    };

    if (data.length == 0) {
        return (<Text> 数据为空 </Text>)
    } else {
        return (<FlashList
            data={data}
            keyExtractor={({ id }, index) => {
                return id;
            }}
            estimatedItemSize={200}
            renderItem={({ item, index }) => _rowRenderer(item, index)}
        />)
    }

}