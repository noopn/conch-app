var select = scriptUtil.getRegisterReactDom('htDiv980');
var arrlx = [
    {
        key: 'lx',
        optionText: '兰溪红狮',
        optionPageValue: '/#/runtime-fullscreen/runtime-fullscreen/Page_9461e4323cb44539837ec40a12d45c05'
    }
];
var arryc = [
    {
        key: 'yc',
        optionText: '宜春红狮',
        optionPageValue: '/#/runtime-fullscreen/runtime-fullscreen/Page_6c9e35d89d8a4c0d8ddedfa36cf5cfa5'
    }
];
var arrjt = [{
    key: 'lx',
    optionText: '兰溪红狮',
    optionPageValue: '/#/runtime-fullscreen/runtime-fullscreen/Page_9461e4323cb44539837ec40a12d45c05'

}, {
    key: 'yc',
    optionText: '宜春红狮',
    optionPageValue: '/#/runtime-fullscreen/runtime-fullscreen/Page_6c9e35d89d8a4c0d8ddedfa36cf5cfa5'

}]


var username = JSON.parse(sessionStorage.userInfo).userSessionInfo.username;
scriptUtil.excuteScriptService({
    objName: "openapi",
    serviceName: "getUsersSessionInfo",
    params: { "username": username },
    cb: (res) => {
        scriptUtil.request(`/api/metadata/organization/persons?keywords=${res.result.userInfo.staffCode}&hasAccount=true&includeOrgs=true`).then(res => {
            // const jobCode = _.get(res, 'organizations[1][0].code', {});
            // const jobShowName = _.get(res, 'organizations[1][0].showName', {});
            const nodeName = _.get(res, 'list[0].organizations[1].name');
            if (!nodeName) {
                scriptUtil.showMessage('当前用户未绑定', 'info')
                throw new Error('当前用户未绑定')
            }
            return nodeName;
        }).then(nodeName => {
            return scriptUtil.request(`/api/metadata/organization/orgs/v1/${nodeName}/correlation`)
        }).then(res => {
            if (res.list[0].fullPath.indexOf('宜春红狮') > -1) {
                select.setImportData(arryc);
                console.log('arrayc')
            } else if (res.list[0].fullPath.indexOf('兰溪红狮') > -1) {
                select.setImportData(arrlx);
                console.log('arralx')
            } else if (res.list[0].fullPath.indexOf('红狮控股集团') > -1) {
                select.setImportData(arrjt);
                console.log('arrajt')
            } else {
                scriptUtil.showMessage('您所在公司暂未开通看板权限', 'waring')
            }
                var btn = scriptUtil.getRegisterReactDom('htDiv1367');
                btn.handleClick({
                    preventDefault: function () { }

            })
        })
    }
});