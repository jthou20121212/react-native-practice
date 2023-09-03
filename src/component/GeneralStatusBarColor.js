import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';

// import { useHeaderHeight } from 'react-navigation-stack';
// import { useHeaderHeight } from '@react-navigation/elements';

import { StatusBarHeight } from '../component/PlatformStatusBar' 

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
        <StatusBar translucent={true} backgroundColor={backgroundColor} {...props} />
    </View>
);

const styles = StyleSheet.create({
    statusBar: {
        height: StatusBarHeight
    }
});

export default GeneralStatusBarColor;


