import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import Home from '../Home';

import AdaptivedHeightFl from '../list/AdaptivedHeightFl';
import AdaptivedHeightRlv from '../list/AdaptivedHeightRlv';
import FixedHeightFl from '../list/FixedHeightFl';
import FixedHeightRlv from '../list/FixedHeightRlv';

import AdaptivedHeightFl2 from '../list/AdaptivedHeightFl2';
import AdaptivedHeightRlv2 from '../list/AdaptivedHeightRlv2';
import FixedHeightFl2 from '../list/FixedHeightFl2';
import FixedHeightRlv2 from '../list/FixedHeightRlv2';

import AdaptivedHeightFll from '../list/AdaptivedHeightFll';
import AdaptivedHeightFll2 from '../list/AdaptivedHeightFll2';
import FixedHeightFll from '../list/FixedHeightFll';
import FixedHeightFll2 from '../list/FixedHeightFll2';

const Stack = createNativeStackNavigator()

export default function App(props) {

    return (
        <NavigationContainer independent={true} >
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FixedHeightFl"
                    component={FixedHeightFl}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FixedHeightRlv"
                    component={FixedHeightRlv}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FixedHeightFll"
                    component={FixedHeightFll}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="AdaptivedHeightFl"
                    component={AdaptivedHeightFl}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AdaptivedHeightRlv"
                    component={AdaptivedHeightRlv}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AdaptivedHeightFll"
                    component={AdaptivedHeightFll}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="FixedHeightFl2"
                    component={FixedHeightFl2}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FixedHeightRlv2"
                    component={FixedHeightRlv2}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FixedHeightFll2"
                    component={FixedHeightFll2}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="AdaptivedHeightFl2"
                    component={AdaptivedHeightFl2}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AdaptivedHeightRlv2"
                    component={AdaptivedHeightRlv2}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AdaptivedHeightFll2"
                    component={AdaptivedHeightFll2}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}