import React, { useRef, useState, useEffect } from 'react';
import { Image, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";

export default function FixedHeightRlv2() {

    const pageNumber = useRef(0);
    const canLoadMore = useRef(true);
    const pageSize = 1000;
    const [data, setData] = useState([]);
    const [loadMoreStatus, setLoadMoreStatus] = useState(true);

    const { width, height } = Dimensions.get("window");
    const dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    const layoutProvider = new LayoutProvider(
        index => { return "nothing" },
        (type, dim) => {
            dim.width = width;
            dim.height = 120;
        }
    );
    layoutProvider.shouldRefreshWithAnchoring = false;

    useEffect(() => {
        fetchData();
    }, []);

    const _rowRenderer = (type, data, index) => {
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
                    <Text style={{ fontSize: 18, color: '#303030' }} >{data.title}</Text>
                    <Text
                        style={{ fontSize: 14, color: '#606060', marginTop: 6 }}
                        numberOfLines={2} ellipsizeMode='tail'
                    >
                        {data.summary}
                    </Text>
                    <Text style={{ fontSize: 10, marginTop: 6, color: '#C0C0C0' }} >{data.time} {"  "} {index} {"  rlv"} </Text>
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
        const newData = Array(pageSize).fill(undefined).map((_, index) => ({
            id: `item ${(pageNumber.current - 1) * pageSize + index}`,
            title: "库克的下一张王牌是什么？",
            summary: "市值2.6万亿美元的苹果交出了2023财年第二季度财报。在这份财报中，苹果来自iPhone的营收为513.3亿美元，同比增长1.5%。不过，其他硬件业务的表现则难言乐观。如何在iPhone之外找到“下一个时代的iPhone”，也成为苹果商业帝国得以延续的重中之重。",
            time: "2023-05-06",
            url: "https://img.huxiucdn.com/test/img/brief_content/202305/06/130607897468.png"
        }));

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
            keyExtractor={({ id }, index) => {
                return id;
            }}
            layoutProvider={layoutProvider}
            dataProvider={dataProvider.cloneWithRows(data)}
            forceNonDeterministicRendering={true}
            rowRenderer={(type, data, index) => {
                return _rowRenderer(type, data, index);
            }}
        />)
    }

}