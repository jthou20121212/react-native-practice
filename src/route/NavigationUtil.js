
export default class NavigationUtil  {

    static goPage(params, page) {

        // console.log('jthou', params);

        const navigation = NavigationUtil.navigation || (params || {}).navigation
        if (!navigation) {
            console.log('navigation 不能为空')
            return
        }
        navigation.navigate(page, {
            ...params,
            // fix Non-serializable values were found in the navigation state.
            navigation: undefined
        })
    }

    static goBack(navigation) {
        navigation.goBack()
    }

}

NavigationUtil.navigation = undefined;
