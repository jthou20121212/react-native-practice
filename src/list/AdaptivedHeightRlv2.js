import React, { useRef, useState, useEffect } from 'react';
import { Image, Text, View, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";

import getNumberOfLines from '../utils/getNumberOfLine'

export default function AdaptivedHeightRlv2() {

    const pageNumber = useRef(0);
    const canLoadMore = useRef(true);
    const pageSize = 1000;
    const [data, setData] = useState([]);
    const [loadMoreStatus, setLoadMoreStatus] = useState(true);

    const { width } = Dimensions.get("window");
    const availableWidth = width - 146
    const linesMap = new Map();

    const [dataProvider, setDataProvider] = React.useState(
        new DataProvider((r1, r2) => {
            return r1 !== r2
        })
    )
    React.useEffect(() => {
        setDataProvider((prevState) => prevState.cloneWithRows(data))
    }, [data])

    const layoutProvider = new LayoutProvider(
        (index) => "nothing",
        (type, dim, index) => {
            var lines = linesMap.get(index);
            if (lines) {
                dim.width = width;
                dim.height = 62 + lines * 20;
            } else {
                const item = dataProvider.getDataForIndex(index);
                if (item) {
                    lines = getNumberOfLines(item.summary, 14, availableWidth);
                    linesMap.set(index, lines);
                    dim.width = width;
                    dim.height =  62 + lines * 20;
                }
            }
        }
    )
    layoutProvider.shouldRefreshWithAnchoring = false;

    useEffect(() => {
        fetchData();
    }, []);

    const _rowRenderer = (type, data, index) => {

        var lines = linesMap.get(index);
        if (!lines) {
            lines = getNumberOfLines(data.summary, 14, availableWidth);
            linesMap.set(index, lines);
        }

        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
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
                    <Text style={[Styles.title]} >{data.title}</Text>
                    <Text style={[Styles.summary]} numberOfLines={lines} >{data.summary}</Text>
                    <Text style={[Styles.time]} >{data.time} {"  "} {index} {` rlv ${lines}行`} </Text>
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

    const renderFooter = () => {
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
        return (<RecyclerListView
            style={{ flex: 1 }}
            keyExtractor={({ id }, index) => {
                return id;
            }}
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            forceNonDeterministicRendering={true}
            rowRenderer={(type, data, index) => {
                return _rowRenderer(type, data, index);
            }}
        />)
    }

}

const Styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: '#303030',
        lineHeight: 25.7
    },
    summary: {
        fontSize: 14,
        color: '#606060',
        marginTop: 6,
        lineHeight: 20
    },
    time: {
        fontSize: 10,
        marginTop: 6,
        color: '#C0C0C0',
        lineHeight: 14.3
    }
});