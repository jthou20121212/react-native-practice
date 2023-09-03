import React from 'react';

import { PixelRatio, StyleSheet, Text, View } from 'react-native';

const CHILDREN: string[] = ['Html5', '大数据', 'Vue.js', 'Node.js', 'Java', 'Python', 'Go', 'Flutter', 'Android', 'iOS', 'AI', '算法'];

export default function FlowLayout() {

	const children = CHILDREN.map((value, index) => {
		return <View key={index} style={[styles.child]}><Text>{value}</Text></View>
	})

	return (
		<View style={[styles.container]} >
			{children}
		</View>)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
