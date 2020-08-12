var config = {
    tableCtrlId: 'htDiv81',
    coInputId: 'htDiv197'
};
var index = window.location.href.indexOf('index')
// 设置数据
if (index > 0 && window.parent) {
    var editRow = window.parent.scriptUtil.getEditRow(config.tableCtrlId);
    console.log('editRow', editRow);
    scriptUtil.handleReactDom(config.readonlyCtrlId, true, 'setReadOnly');
    //scriptUtil.setFormData(editRow);
    var InputCtrl = scriptUtil.getRegisterReactDom('htDiv197');

    InputCtrl.props.updateForm({
        user_id: editRow.user_id,
        ctrlIndex: InputCtrl.props.widgetIndex,
        ctrlType: InputCtrl.props.pageConfig.linkage
    });
    var user_id = editRow.user_id;
    var table = scriptUtil.getRegisterReactDom('htDiv81');

    function reloadTable() {
        var renderTable = function (res) {
            console.log("res:" + JSON.stringify(res.result));
            table.setObjectSource(res.result);
        }
        //3.请求表单数据
        scriptUtil.excuteScriptService({
            objName: 'userInfo',
            serviceName: 'getUserDetail',
            params: {
                user_id: user_id
            }
        }, renderTable);
    };

    reloadTable();
    var onChange = function (pangation, filters, sorter) {
        console.log(pangation, filters, sorter);
        var formIds = ['user_id'];
        var params = scriptUtil.getFormData(formIds);
        var current = pangation.current;
        var per_page = pangation.pageSize
        params['page'] = current;
        params['per_page'] = per_page;
        var renderTable = function (res) {
            console.log("res:" + JSON.stringify(res.result));
            table.setObjectSource(res.result);
        }
        //3.请求表单数据
        scriptUtil.excuteScriptService({
            objName: 'userInfo',
            serviceName: 'getUserDetail',
            params: params
        }, renderTable);
    }
    table.setTableOnChange(onChange);
}
scriptUtil.getUserInfo(user => {
    scriptUtil.excuteScriptService({
        objName: "userInformation",
        serviceName: "getCompanyid",
        params: { "username": '13588361944' || user.userInfo.username },
        cb: (res) => {
            const company_id = res.result.list[0].company_id;
            var coInput = scriptUtil.getRegisterReactDom(config.coInputId);
            coInput.setValue(company_id);
        }
    });
});


//时间选择后调用
