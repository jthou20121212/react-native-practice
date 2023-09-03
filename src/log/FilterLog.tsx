import React from 'react';
import { Text, LogBox } from 'react-native';

export default function FilterLog() {

	const log = () => {
		console.log('');
		console.log('🦄');
		console.log('🐼');
		console.log('🐶');
		console.log('hehe');
		console.log('haha');
		console.log(110);
		console.log('a', 'b', 'c', 'd');
		console.error('error');

		console.log('miaotou', '');
		console.log('miaotou', '🦄');
		console.log('huxiu', '🐼');
		console.log('huxiu', '🐶');
		console.log('zhiku', 'hehe');
		console.log('zhiku', 'haha');
		console.log('louxia', 110);
		console.log('xialou', 'a', 'b', 'c', 'd');
		console.error('miaotou', 'error');
	};

	log();

	log();

	return (<Text style={{ flex: 1 }}>测试 log </Text>)

}

