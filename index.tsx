/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
// import App from './src/route/Router';

// log 配置
// 为解决 log 无限制输出问题
// 生产环境不输出 log
// 测试环境配置都为空的情况下输出所有 log
// 过滤 log 有两种方式，一种是通过 tag 一种是通过级别（log 函数）
// 第一种：取输出 log 函数的第一个参数当作 tag 只有匹配 tag 的 log 才会输出
// 比如 LOG_TAGS 为 'miaotou' 情况下 console.log('miaotou', 'log'); 会输出 log 
// 而 console.log('huxiu', 'log'); 则不会输出 log
// 可配置多项有一匹配则输出
const LOG_TAGS: string[] = [
    'jthou'
];

// 第二种：通过区分 log 函数过滤
// log 输出函数有 console.log console.info console.warn console.error 等
// 如果配置 IGNORED_LEVEL 为 info 则 console.info 不会输出其他 log 函数正常输出
// 可配置多项有一匹配则不输出
const IGNORED_LEVEL: string[] = [/* 'info', 'warn', 'error' */]

const withoutIgnored = (logger: Function, level: string) => (...args: any) => {

    // 如果传入的参数只有一个不输出
    if (args.length <= 1) return;

    // 如果需要过滤级别
    if (IGNORED_LEVEL.some((log) => level === log)) return;

    // 如果没有配置 log 则输出全部
    if (LOG_TAGS.length == 0 || LOG_TAGS.some((tag) => args[0] == tag)) {
        logger(...args);
    }
};

// typescript 获取不到函数名字所以要传入
console.log = withoutIgnored(console.log, 'log');
console.info = withoutIgnored(console.info, 'info');
console.warn = withoutIgnored(console.warn, 'warn');
console.error = withoutIgnored(console.error, 'error');

AppRegistry.registerComponent(appName, () => App);
