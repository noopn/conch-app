var username = JSON.parse(sessionStorage.userInfo).userSessionInfo.username;
scriptUtil.excuteScriptService({
    objName: "openapi",
    serviceName: "getUsersSessionInfo",
    params: { "username": username },
    cb: (res) => {
        scriptUtil.request(`/api/metadata/organization/personnels/${res.result.userInfo.staffCode}`).then(res => {
            // const jobCode = _.get(res, 'organizations[1][0].code', {});
            // const jobShowName = _.get(res, 'organizations[1][0].showName', {});
            const jobName = _.get(res, 'organizations[1][0].name');
            if (!jobName) {
                scriptUtil.showMessage('当前用户未绑定', 'info')
                throw new Error('当前用户未绑定')
            }
            return jobName;
        }).then(nodeName => {
            return Promise.all([
                scriptUtil.request(`/api/metadata/organization/orgs/v1/${nodeName}/correlation`),
                scriptUtil.request(`/api/metadata/organization/orgs/v1/Company_default_org_company/nodes?orgType=Department&isAll=true&per_page=1000`)
            ])
        }).then(res => {
            const code = _.get(res[0], 'list[0].code');
            const nodename = _.get(res[0], 'list[0].name');
            let list = _.get(res[1], 'list');

            const cur = list.find(item => item.code === code);
            list = list.map(item => ({ ...item, label: item.showName, value: item.code }));
            function filterTreeDataItem(list, pid, result = []) {
                if (!pid) return list.filter(item => item.parent && item.parent.code);
                const arr = list.filter(item => item.parent && item.parent.code === pid);
                if (arr.length) {
                    arr.forEach(item => {
                        result.push(item);
                        filterTreeDataItem(list, item.code, result);
                    });
                }
                return result
            }
            const list1 = filterTreeDataItem(list, cur.parent && cur.parent.code);

            // 设置默认值
            const map = { [cur.code]: true }
            let node = list1.find(item => cur.parent && item.parent && cur.parent.code === item.parent.code && item.fullPath.indexOf('制成') > -1);
            function xx() {
                list1.forEach(item => {
                    if (map[item.parent.code]) {
                        map[item.code] = true;
                    }
                })
                node = list1.find(item => map[item.code] && item.fullPath.indexOf('制成') > -1);
                if (node) {
                    return node;
                }
                xx();
            }
            if (!node) {
                node = xx();
            }
            const defaultPath = (node, path = []) => {
                path.unshift(node.code);
                let $node = null;
                if (node.parent && ($node = list1.find(item => item.code === node.parent.code))) {
                    defaultPath($node, path)
                }
                return path;
            };
            function toTree(data) {
                let result = []
                if (!Array.isArray(data)) {
                    return result
                }
                data.forEach(item => {
                    delete item.children;
                });
                let map = {};
                data.forEach(item => {
                    map[item.code] = item;
                });
                data.forEach(item => {
                    let parent = map[item.parent.code];
                    if (parent) {
                        (parent.children || (parent.children = [])).push(item);
                    } else {
                        result.push(item);
                    }
                });
                return result;
            }
            const Select = scriptUtil.getRegisterReactDom('htDiv1393');
            const hidden = scriptUtil.getRegisterReactDom('htDiv369');
            console.log(Select)
            Select.setImportData(toTree(list1));
            Select.setValue(defaultPath(node));

            hidden.setValue(node.showName);
            console.log(
                hidden.getValue()
            )
            return node.name;
        }).then(nodeName => {
            return scriptUtil.request(`/api/metadata/organization/orgs/v1/${nodeName}/correlation`)
        }).then(res => {
            const Select1 = scriptUtil.getRegisterReactDom('htDiv1565');
            const list = res.list.map(item => ({
                ...item,
                optionValue: _.last(item.fullPath.split('/')),
                key: item.code,
                optionText: _.last(item.fullPath.split('/'))
            }))
            Select1.setImportData(list);
            Select1.setValue(_.first(list).optionValue);
            const hidden = scriptUtil.getRegisterReactDom('htDiv1834');
            hidden.setValue(_.first(list).optionText);
            console.log(hidden.getValue())
        })
    }
});

const Select = scriptUtil.getRegisterReactDom('htDiv1393');
const Select1 = scriptUtil.getRegisterReactDom('htDiv1565');

const selectVal = Select.getValue();
const nodeName = _.last(selectVal).name;
const hidden = scriptUtil.getRegisterReactDom('htDiv369');
hidden.setValue(_.last(selectVal).showName);
console.log(hidden.getValue())

scriptUtil.request(`/api/metadata/organization/orgs/v1/${nodeName}/correlation`).then((res) => {
    const list = res.list.map(item => ({
        ...item,
        optionValue: _.last(item.fullPath.split('/')),
        key: item.code,
        optionText: _.last(item.fullPath.split('/'))
    }))
    console.log(list);
    Select1.setImportData(list);
    Select1.setValue((_.first(list) || {}).optionValue || '');
    const hidden = scriptUtil.getRegisterReactDom('htDiv1834');
    hidden.setValue((_.first(list) || {}).optionText || '');
    console.log(hidden.getValue())
})

// 单选内容改变
const Select = scriptUtil.getRegisterReactDom('htDiv1565');
const val = Select.getValue();
const hidden = scriptUtil.getRegisterReactDom('htDiv1834');
hidden.setValue(val);
console.log(hidden.getValue())
