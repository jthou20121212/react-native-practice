import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import GeneralStatusBarColor from './component/GeneralStatusBarColor';

import NavigationUtil from './route/NavigationUtil';

export default function Home(props) {

    const navigation = useNavigation();
    const isHermes = () => !!alobal.HermesInternal;

    useEffect(() => {
        NavigationUtil.navigation = navigation;
    }, []);

    return (

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} >
            <GeneralStatusBarColor barStyle='dark-content' backgroundColor='transparent' hidden={false} />
            <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >{`当前 js 引擎 hermes：${isHermes ? '是' : '否'}`}</Text></View>
            <View style={[Styles.separator]} ><Text style={[Styles.text]} >我是一条占位的分隔线</Text></View>
            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'FixedHeightFl')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >固定高度的 fl</Text></View>
            </Pressable>
            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'FixedHeightRlv')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >固定高度的 rlv</Text></View>
            </Pressable>
            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'FixedHeightFll')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >固定高度的 FlashList</Text></View>
            </Pressable>
            <View style={[Styles.separator]} ><Text style={[Styles.text]} >我是一条占位的分隔线</Text></View>

            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'AdaptivedHeightFl')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >自适应高度的 fl</Text></View>
            </Pressable>
            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'AdaptivedHeightRlv')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >自适应高度的 rlv</Text></View>
            </Pressable>
            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'AdaptivedHeightFll')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >自适应高度的 FlashList</Text></View>
            </Pressable>
            <View style={[Styles.separator]} ><Text style={[Styles.text]} >我是一条占位的分隔线</Text></View>

            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'FixedHeightFl2')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >固定高度的 fl 一次加载 1000 条数据</Text></View>
            </Pressable>
            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'FixedHeightRlv2')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >固定高度的 rlv 一次加载 1000 条数据</Text></View>
            </Pressable>
            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'FixedHeightFll2')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >固定高度的 FlashList 一次加载 1000 条数据</Text></View>
            </Pressable>
            <View style={[Styles.separator]} ><Text style={[Styles.text]} >我是一条占位的分隔线</Text></View>

            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'AdaptivedHeightFl2')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >自适应高度的 fl 一次加载 1000 条数据</Text></View>
            </Pressable>

            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'AdaptivedHeightRlv2')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >自适应高度的 rlv 一次加载 1000 条数据</Text></View>
            </Pressable>

            <Pressable
                onPress={() => {
                    NavigationUtil.goPage({}, 'AdaptivedHeightFll2')
                }}
            >
                <View style={[Styles.item]} ><Text style={{ fontSize: 18 }} >自适应高度的 FlashList 一次加载 1000 条数据</Text></View>
            </Pressable>

            <View style={[Styles.separator]} ><Text style={[Styles.text]} >我是一条占位的分隔线</Text></View>
            
        </ScrollView>
    )

}

const Styles = StyleSheet.create({
    item: {
        height: 46,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray'
    },
    separator: {
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'black',
        fontSize: 18
    }
});