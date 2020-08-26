import React from 'react';
import PropTypes from 'prop-types';
var css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `
    .l-table-row-active > td { 
        background: #ced3db;
    }
`;
document.getElementsByTagName('head')[0].appendChild(css);
import {
    Row,
    Col,
    Button,
    Input,
    Table,
    Modal,
    message,
    Form,
    Checkbox,
    Select,
    InputNumber,
    Icon,
    Radio,
    Switch,
} from 'antd';
import {
    get,
    map,
    isFunction,
    forEach,
    split,
    head,
    last,
    toLower,
    delay,
    merge,
} from 'lodash';
import '../extensions/AlarmManager/source/index.css';

// 默认每页条数
const DEFAULT_SIZE = 10;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
// const OBJ_NAME_TEST = 'alarm_obj_alias';
// const PROP_NAME_TEST = 'alarm_prop_alias';
const OBJ_NAME_TEST = '全部';
const PROP_NAME_TEST = '全部';
const PROP_LABEL_TEST = '全部';
let objNameTimeout; // 获取对象属性定时器
let objNameCurrentValue; // 对象属性临时内容

class AlarmManager extends React.PureComponent {
    static propTypes = {
        form: PropTypes.shape({
            getFieldDecorator: PropTypes.func.isRequired,
            validateFields: PropTypes.func.isRequired,
            resetFields: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            tableData: [], // 表格数据
            alarmInfoModalVisible: false, // 新增、编辑弹出框显示隐藏
            alarmItemDelModalVisible: false, // 控制删除弹出框显示隐藏
            isAddAlarm: true, // 是否为新增
            pageIndex: 1, // 页数
            pageSize: DEFAULT_SIZE, // 每页条数
            currentTotal: 0, // 总条数
            tableLoading: false, // 表格加载状态
            infoConfirmLoading: false, // 新增编辑确认按钮
            delComfirmLoading: false, // 删除确认按钮加载状态
            objNameList: [], // 对象列表
            propNameList: [], // 属性列表
            propLabelList: [],// 属性标签列表
            selectRowRecord: {
                objName: '', // 新增、编辑中对象信息
                propName: '', // 新增、编辑中属性信息
                alarmType: '', // 报警条件
                limitValue: '', // 报警限值
                enabled: '', // 是否启用
                propType: '', // 属性类型
            }, // 选中行内容
            instationMessageVisible: false, // 站内信modal显示隐藏
            dingTalkGroupVisible: false, // 钉钉群组modal显示隐藏
            dingTalkUserVisible: false, // 钉钉个人modal显示隐藏
            alarmId: '', // 传入操作栏用于展示的行id
            queryObjName: '' || OBJ_NAME_TEST, // 查询对象名称
            queryPropName: '' || PROP_NAME_TEST, // 查询属性名称
            objName: '',//对象名称
            propName: '',//属性名称
            propDesc: '',//属性描述
            priority: '',//优先级(报警等级)
            objLabel: '',//对象标签
            alarmName: '',//报警名称
            alarmDesc: '',//报警描述
            propLabel: '',//属性标签
            queryPropLabel: '' || PROP_LABEL_TEST,// 属性标签
            queryPropObj: '' || PROP_LABEL_TEST,// 对象标签
            objLabelList: [],
            level: '' || '请选择',//报警等级
            queryObjLabelByid: '',
            queryPropObjById: '',
            typeInfoList: [],//报警类别数据
            typeId: '',//报警类别id
            typeName: '' || '请选择',//报警类别名字
            objType: '' || '全部',//对象分类
            objTypeList: [],//对象分类列表
            objTypeName: '',//对象分类名字
        };

        this.handleAlarmInfoModalOpen = this.handleAlarmInfoModalOpen.bind(this);
        this.handleAlarmInfoModalClose = this.handleAlarmInfoModalClose.bind(this);
        this.handleAlarmItemDelModalOpen = this.handleAlarmItemDelModalOpen.bind(
            this
        );
        this.handleAlarmItemDelModalClose = this.handleAlarmItemDelModalClose.bind(
            this
        );
        this.handleObjNameSearch = this.handleObjNameSearch.bind(this);
        this.handleObjNameChange = this.handleObjNameChange.bind(this);
        this.getPropNameList = this.getPropNameList.bind(this);
        this.handlePropNameDropdownOpen = this.handlePropNameDropdownOpen.bind(
            this
        );
        this.handlePropNameChange = this.handlePropNameChange.bind(this);
        this.handleAlarmInfoComfirm = this.handleAlarmInfoComfirm.bind(this);
        this.handleAlarmItemAdd = this.handleAlarmItemAdd.bind(this);
        this.handleAlarmItemDelete = this.handleAlarmItemDelete.bind(this);
        this.handleInstationMessageModalClose = this.handleInstationMessageModalClose.bind(
            this
        );
        this.handleInstationMessageModalOpen = this.handleInstationMessageModalOpen.bind(
            this
        );
        this.handleDingTalkGroupModalClose = this.handleDingTalkGroupModalClose.bind(
            this
        );
        this.handleDingTalkGroupModalOpen = this.handleDingTalkGroupModalOpen.bind(
            this
        );
        this.handleDingTalkUserModalClose = this.handleDingTalkUserModalClose.bind(
            this
        );
        this.handleDingTalkUserModalOpen = this.handleDingTalkUserModalOpen.bind(
            this
        );
        // this.handleQueryObjNameSearch = this.handleQueryObjNameSearch.bind(this);
        this.handleQueryObjNameChange = this.handleQueryObjNameChange.bind(this);
        this.handleQueryPropNameChange = this.handleQueryPropNameChange.bind(this);
        this.handleLimitValueChange = this.handleLimitValueChange.bind(this);
        this.handleEnabledChange = this.handleEnabledChange.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleSearchParamsChange = this.handleSearchParamsChange.bind(this);
        this.handlePropLabelDropdownOpen = this.handlePropLabelDropdownOpen.bind(this);
        this.getPropLabelList = this.getPropLabelList.bind(this);
        this.handleQueryPropLabelChange = this.handleQueryPropLabelChange.bind(this);
        this.handleQueryObjLabelChange = this.handleQueryObjLabelChange.bind(this);
        this.handleQueryLevelChange = this.handleQueryLevelChange.bind(this);
        this.getTypeInfoList = this.getTypeInfoList.bind(this);
        this.handleQueryAlarmTypeChange = this.handleQueryAlarmTypeChange.bind(this);
        this.getObjTypeList = this.getObjTypeList.bind(this);//获取对象分类
        this.handleObjTypeSearch = this.handleObjTypeSearch.bind(this);//对象分类搜索
        this.handleObjTypeChange = this.handleObjTypeChange.bind(this);//对象分类改变
    }

    componentDidMount() {
        this.getTableData();
        // this.handleQueryPriorityChange();
        this.getTypeInfoList();
        this.getObjTypeList();//获取对象类别列表
    }

    // 获取类别的list
    getTypeInfoList = () => {
        scriptUtil.excuteScriptService({
            objName: 'classification',
            serviceName: 'getClassifications',
        },
            res => {
                console.log(res)
                if (
                    res &&
                    get(res, ['code']) &&
                    parseInt(get(res, ['code']), 10) === 200 &&
                    get(res, ['result'])
                ) {
                    console.log(res.result)
                    this.setState({
                        typeInfoList: get(res.result, ['list'], [])
                    });
                    console.log(this.state.typeInfoList)
                } else {
                    this.setState({
                        tableLoading: false,
                    });
                    message.error('加载失败');
                }
            });
    }

    // 获取表格数据
    getTableData(
        objName = OBJ_NAME_TEST,
        propName = PROP_NAME_TEST,
        pageIndex = 1,
        pageSize = DEFAULT_SIZE
    ) {
        // 请求表格数据
        this.setState(
            {
                tableLoading: true,
            },
            () => {
                scriptUtil.excuteScriptService(
                    {
                        objName: 'tb_alarm_config',
                        serviceName: 'queryAlarm',
                        params: {
                            pageIndex,
                            pageSize,
                            // objName,
                            // propName,
                        },
                    },
                    res => {
                        if (
                            res &&
                            get(res, ['code']) &&
                            parseInt(get(res, ['code']), 10) === 200 &&
                            get(res, ['result'])
                        ) {
                            const resultObj = get(res, ['result']);
                            const { code, body } = resultObj;
                            const resultData = JSON.parse(resultObj.body);
                            if (code === 200 || code === '200') {
                                // 成功
                                console.log('res', resultData);
                                this.setState({
                                    tableLoading: false,
                                    tableData: get(resultData, ['list'], []),
                                    currentTotal: get(resultData, ['total'], 0),
                                    totalPage: get(resultData, ['totalPage'], 0),
                                });
                                // message.success('加载成功');
                            } else {
                                this.setState({
                                    tableLoading: false,
                                });
                                message.error('加载失败');
                            }
                        } else {
                            this.setState({
                                tableLoading: false,
                            });
                            message.error('加载失败');
                        }
                    }
                );
            }
        );
    }


    // 获取优先级
    handleSearchParamsChange() {

        var serviceConfig = {
            objName: 'tb_alarm_config',
            serviceName: 'queryAlarm',
            params: {
                pageIndex: 1,
                pageSize: 20,
                // objName: this.state.objName,//对象名称
                propDesc: this.state.propDesc,//属性描述(暂时无法调通)
                priority: this.state.level == 0 ? '' : this.state.level,//优先级(报警等级)
                alarmName: this.state.alarmName,//报警名称
                alarmDesc: this.state.alarmDesc,//报警描述
                objLabel: this.state.queryPropObjById == '全部' ? '' : this.state.queryPropObjById,//对象标签
                propLabel: this.state.queryObjLabelByid == '全部' ? '' : this.state.queryObjLabelByid,//属性标签
                propName: this.state.queryPropName == '全部' ? '' : this.state.queryPropName,//属性名称
                objName: this.state.queryObjName == '全部' ? '' : this.state.queryObjName,//对象名称
                typeId: this.state.typeId == '请选择' ? '' : this.state.typeId,//报警类别id
            },
        };
        scriptUtil.excuteScriptService(serviceConfig, (res) => {
            if (
                res &&
                get(res, ['code']) &&
                parseInt(get(res, ['code']), 10) === 200 &&
                get(res, ['result'])
            ) {
                const resultObj = get(res, ['result']);
                const { code, body } = resultObj;
                const resultData = JSON.parse(body);
                if (code === 200 || code === '200') {
                    // 成功
                    console.log('res', resultData);
                    this.setState({
                        tableLoading: false,
                        tableData: get(resultData, ['list'], []),
                        currentTotal: get(resultData, ['total'], 0),
                        totalPage: get(resultData, ['totalPage'], 0),
                    });
                    message.success('加载成功');
                } else {
                    this.setState({
                        tableLoading: false,
                    });
                    message.error('加载失败');
                }
            }
        });
    }

    // 获取对象分类的列表
    getObjTypeList = () => {
        scriptUtil.excuteScriptService({
            objName: 'classification',
            serviceName: 'getClassifications',
        },
            res => {
                console.log(res)
                if (
                    res &&
                    get(res, ['code']) &&
                    parseInt(get(res, ['code']), 10) === 200 &&
                    get(res, ['result'])
                ) {
                    console.log(res.result)
                    this.setState({
                        objTypeList: get(res.result, ['list'], [])
                    });
                    console.log(this.state.typeInfoList)
                } else {
                    this.setState({
                        tableLoading: false,
                    });
                    message.error('加载失败');
                }
            });
    }

    // 获取对象名称
    getObjNameList = (value, callback) => {
        if (objNameTimeout) {
            clearTimeout(objNameTimeout);
            objNameTimeout = null;
        }
        objNameCurrentValue = value;

        function getQueryObject() {
            scriptUtil.excuteScriptService(
                {
                    objName: 'common_service',
                    serviceName: 'queryObject',
                    params: {
                        pageIndex: 1,
                        pageSize: 100, // 临时采用大数解决分页问题
                        name: objNameCurrentValue,
                    },
                },
                res => {
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        const resultObj = get(res, ['result']);
                        const { code, body } = resultObj;
                        const resultData = JSON.parse(body);
                        if (code === 200 || code === '200') {
                            // 成功
                            console.log('objName', resultData);
                            callback(get(resultData, 'list', []));
                            // message.success('加载成功');
                        } else {
                            message.error('加载失败');
                        }
                    } else {
                        message.error('加载失败');
                    }
                }
            );
        }
        objNameTimeout = setTimeout(getQueryObject, 100);
    };

    // 获取属性标签列表
    getPropLabelList = (labelType, callback) => {
        scriptUtil.excuteScriptService({
            objName: 'common_service',
            serviceName: 'queryLabelsByType',
            params: {
                labelType: labelType,
            },
        },
            res => {
                if (
                    res &&
                    get(res, ['code']) &&
                    parseInt(get(res, ['code']), 10) === 200 &&
                    get(res, ['result'])
                ) {
                    const resultObj = get(res, ['result']);
                    const { code, body } = resultObj;
                    // const resultData = JSON.parse(body);
                    const resultData = body;
                    if (code === 200 || code === '200') {
                        // 成功
                        console.log('propLabel', resultData);
                        callback(get(resultData, 'list', []));
                    } else {
                        message.error('加载失败');
                    }
                } else {
                    message.error('加载失败');
                }
            })
    }

    // 获取属性名称
    getPropNameList = (objName, callback) => {
        scriptUtil.excuteScriptService(
            {
                objName: 'common_service',
                serviceName: 'queryPropInObject',
                params: {
                    objName,
                },
            },
            res => {
                if (
                    res &&
                    get(res, ['code']) &&
                    parseInt(get(res, ['code']), 10) === 200 &&
                    get(res, ['result'])
                ) {
                    const resultObj = get(res, ['result']);
                    const { code, body } = resultObj;
                    const resultData = JSON.parse(body);
                    if (code === 200 || code === '200') {
                        // 成功
                        console.log('propName', resultData);
                        callback(get(resultData, 'list', []));
                        // message.success('加载成功');
                    } else {
                        message.error('加载失败');
                    }
                } else {
                    message.error('加载失败');
                }
            }
        );
    };

    // 获取报警条件展示
    showAlarmType = text => {
        switch (text) {
            case 'lt':
                return <span>{'<'}</span>;
            case 'le':
                return <span>≤</span>;
            case 'eq':
                return <span>=</span>;
            case 'ge':
                return <span>≥</span>;
            case 'gt':
                return <span>{'>'}</span>;
            default:
                return '';
        }
    };

    // 打开新增modal框
    handleAlarmInfoModalOpen(isAddAlarm, record) {
        this.setState({
            alarmInfoModalVisible: true,
            isAddAlarm,
            selectRowRecord: record,
            objNameList: [],
            propNameList: [],
        });
    }

    // 关闭新增modal框
    handleAlarmInfoModalClose() {
        delay(() => {
            const {
                form: { resetFields },
            } = this.props;
            resetFields();
        }, 1000);
        this.setState({
            alarmInfoModalVisible: false,
            objNameList: [],
            propNameList: [],
        });
    }

    // 点击确认新增、编辑modal框
    handleAlarmInfoComfirm() {
        const { isAddAlarm, selectRowRecord } = this.state;
        console.log('isAddAlarm', isAddAlarm);
        const {
            form: { validateFields },
        } = this.props;
        validateFields((errors, value) => {
            if (!errors) {
                console.log(value);
                const propName = head(split(value.propName, ':'));
                if (isAddAlarm) {
                    // 新增报警
                    const addAlarmInfo = {
                        objName: value.objName,
                        propName,
                        showName: value.showName,
                        priority: value.priority,
                        alarmType: value.alarmType,
                        limitValue: value.limitValue,
                        duration: value.duration,
                        enabled: value.enabled,
                        description: value.description,
                        objType: value.objType,//对象分类
                    };
                    this.handleAlarmItemAdd(addAlarmInfo);
                } else {
                    // 编辑报警信息
                    const editAlarmInfo = {
                        alarmId: selectRowRecord.alarmId,
                        objName: value.objName,
                        propName,
                        showName: value.showName,
                        priority: value.priority,
                        alarmType: value.alarmType,
                        limitValue: value.limitValue,
                        duration: value.duration,
                        enabled: value.enabled,
                        description: value.description,
                        objType: value.objType,//对象分类
                    };
                    this.handleAlarmItemEdit(editAlarmInfo);
                }
            }
        });
    }
    // 外部修改table字段实时编辑保存
    handleOuterAlarmInfoComfirm(value) {
        console.log(value);
        const propName = head(split(value.propName, ':'));
        const editAlarmInfo = {
            alarmId: value.alarmId,
            objName: value.objName,
            propName,
            showName: value.alarmName,
            priority: value.priority,
            alarmType: value.alarmType,
            limitValue: value.limitValue,
            duration: value.duration,
            enabled: value.enabled,
            description: value.description,
            objType: value.objType,//对象分类
        };
        this.handleAlarmItemEdit(editAlarmInfo);
    }
    // 请求新增报警信息
    handleAlarmItemAdd(addAlarmInfo) {
        this.setState(
            {
                infoConfirmLoading: true,
            },
            () => {
                scriptUtil.excuteScriptService(
                    {
                        objName: 'tb_alarm_config',
                        serviceName: 'addAlarm',
                        params: addAlarmInfo,
                    },
                    res => {
                        console.log('addRes', res);
                        if (
                            res &&
                            get(res, ['code']) &&
                            parseInt(get(res, ['code']), 10) === 200 &&
                            get(res, ['result'])
                        ) {
                            const resultObj = get(res, ['result']);
                            const { code } = resultObj;
                            if (`${code} `.substr(0, 1) === '2') {
                                this.handleAlarmInfoModalClose();
                                this.setState(
                                    {
                                        infoConfirmLoading: false,
                                        // alarmInfoModalVisible: false,
                                        selectRowRecord: {},
                                        objNameList: [],
                                        propNameList: [],
                                    },
                                    () => {
                                        this.getTableData();
                                    }
                                );
                                message.success('添加成功');
                            } else {
                                message.error('新增失败');
                                this.setState({
                                    infoConfirmLoading: false,
                                });
                            }
                        } else {
                            message.error('新增失败');
                            this.setState({
                                infoConfirmLoading: false,
                            });
                        }
                    }
                );
            }
        );
    }

    // 请求编辑报警信息
    handleAlarmItemEdit(editAlarmInfo) {
        this.setState(
            {
                infoConfirmLoading: true,
            },
            () => {
                scriptUtil.excuteScriptService(
                    {
                        objName: 'tb_alarm_config',
                        serviceName: 'editAlarm',
                        params: editAlarmInfo,
                    },
                    res => {
                        console.log('editRes', res);
                        if (
                            res &&
                            get(res, ['code']) &&
                            parseInt(get(res, ['code']), 10) === 200 &&
                            get(res, ['result'])
                        ) {
                            const resultObj = get(res, ['result']);
                            const { code } = resultObj;
                            if (`${code} `.substr(0, 1) === '2') {
                                this.handleAlarmInfoModalClose();
                                this.setState(
                                    {
                                        infoConfirmLoading: false,
                                        // alarmInfoModalVisible: false,
                                        selectRowRecord: {},
                                        objNameList: [],
                                        propNameList: [],
                                    },
                                    () => {
                                        this.getTableData();
                                    }
                                );
                                message.success('添加成功');
                            } else {
                                message.error('编辑失败');
                                this.setState({
                                    infoConfirmLoading: false,
                                });
                            }
                        } else {
                            message.error('编辑失败');
                            this.setState({
                                infoConfirmLoading: false,
                            });
                        }
                    }
                );
            }
        );
    }

    // 打开删除modal框
    handleAlarmItemDelModalOpen(alarmId) {
        this.setState({
            alarmItemDelModalVisible: true,
            delAlarmId: alarmId,
        });
    }

    // 关闭删除modal框
    handleAlarmItemDelModalClose() {
        this.setState({
            alarmItemDelModalVisible: false,
        });
    }

    // 删除报警信息
    handleAlarmItemDelete() {
        this.setState(
            {
                delComfirmLoading: true,
            },
            () => {
                // 获取当前选中行内容
                const { delAlarmId } = this.state;
                scriptUtil.excuteScriptService(
                    {
                        objName: 'tb_alarm_config',
                        serviceName: 'delAlarm',
                        params: {
                            alarmId: delAlarmId,
                        },
                    },
                    res => {
                        console.log('deleteRes', res);
                        if (
                            res &&
                            get(res, ['code']) &&
                            parseInt(get(res, ['code']), 10) === 200 &&
                            get(res, ['result'])
                        ) {
                            const resultObj = get(res, ['result']);
                            const { code } = resultObj;
                            if (`${code} `.substr(0, 1) === '2') {
                                this.setState(
                                    {
                                        delComfirmLoading: false,
                                        alarmItemDelModalVisible: false,
                                        delAlarmId: '',
                                    },
                                    () => {
                                        this.getTableData();
                                    }
                                );
                                message.success('删除成功');
                            } else {
                                message.error('删除失败');
                                this.setState({
                                    delComfirmLoading: false,
                                });
                            }
                        } else {
                            message.error('删除失败');
                            this.setState({
                                delComfirmLoading: false,
                            });
                        }
                    }
                );
            }
        );
    }

    //对象分类设置
    handlObjTypeList(value) {

    }

    // 搜索展开选择对象名称选择器
    handleObjNameSearch(value) {
        // if (value) {
        this.getObjNameList(value, listData =>
            this.setState({
                objNameList: listData,
            })
        );
        // } else {
        //   this.setState({
        //     objNameList: [],
        //   });
        // }
    }
    // 对象名称选择器名称改变
    handleObjTypeSearch(value) {
        this.getObjTypeList(value, listData =>
            this.setState({
                objTypeList: listData
            })
        )
    }
    // 对象名字改变
    handleObjNameChange(value) {
        const { selectRowRecord } = this.state;
        this.setState({
            selectRowRecord: merge(selectRowRecord, {
                objName: value,
            }),
        });
    }

    // 对象分类改变
    handleObjTypeChange(value) {
        const { selectRowRecord } = this.state;
        this.setState({
            selectRowRecord: merge(selectRowRecord, {
                objTypeName: value,
            }),
        });
    }


    // 展开选择属性名称选择器
    handlePropNameDropdownOpen(objName) {
        this.getPropNameList(objName, listData =>
            this.setState({
                propNameList: listData,
            })
        );
    }

    // 展开属性标签内容项
    handlePropLabelDropdownOpen(labelType) {
        if (labelType == 'object') {
            this.getPropLabelList(labelType, listData =>
                this.setState({
                    objLabelList: listData,
                })
            );
        } else {
            this.getPropLabelList(labelType, listData =>
                this.setState({
                    propLabelList: listData,
                })
            );
        }
    }

    // 属性名称选择器名称改变
    handlePropNameChange(value) {
        const valueList = split(value, ':');
        const { selectRowRecord } = this.state;
        this.setState({
            selectRowRecord: merge(selectRowRecord, {
                propName: head(valueList),
                propType: last(valueList),
            }),
        });
    }

    // 关联站内信modal打开
    handleInstationMessageModalOpen(e, record) {
        e.stopPropagation();
        this.setState({
            instationMessageVisible: true,
            alarmId: get(record, 'alarmId', ''),
        });
    }

    // 关联站内信modal关闭
    handleInstationMessageModalClose() {
        this.setState({
            instationMessageVisible: false,
        });
    }

    // 关联钉钉群组modal打开
    handleDingTalkGroupModalOpen(e, record) {
        e.stopPropagation();
        this.setState({
            dingTalkGroupVisible: true,
            alarmId: get(record, 'alarmId', ''),
        });
    }

    // 关联钉钉群组modal关闭
    handleDingTalkGroupModalClose() {
        this.setState({
            dingTalkGroupVisible: false,
        });
    }

    // 关联钉钉个人modal打开
    handleDingTalkUserModalOpen(e, record) {
        e.stopPropagation();
        this.setState({
            dingTalkUserVisible: true,
            alarmId: get(record, 'alarmId', ''),
        });
    }

    // 关联钉钉个人modal关闭
    handleDingTalkUserModalClose() {
        this.setState({
            dingTalkUserVisible: false,
        });
    }

    // 查询对象名称选择器名称改变
    handleQueryObjNameChange(value) {
        console.log(value)
        this.setState(
            {
                queryObjName: value,
            },
            () => {
                // this.getTableData(value);
                this.handleSearchParamsChange();
            }
        );
    }

    // 查询属性分类切换
    handleQueryPropNameChange(value) {
        const { queryObjName } = this.state;
        const valueList = split(value, ':');
        this.setState(
            {
                queryPropName: head(valueList),
            },
            () => {
                // this.getTableData(queryObjName, head(valueList));
                this.handleSearchParamsChange();
            }
        );
    }

    // 属性标签下拉列表
    handleQueryPropLabelChange(value) {
        console.log('handleQueryPropLabelChange')
        const valueList = split(value, ':');
        this.setState(
            {
                queryPropLabel: valueList[1],
                queryObjLabelByid: head(valueList)
            },
            () => {
                this.handleSearchParamsChange();
            }
        );
    }


    //对象标签下拉列表
    handleQueryObjLabelChange(value) {
        console.log('handleQueryObjLabelChange')
        const valueList = split(value, ':');
        this.setState(
            {
                queryPropObj: valueList[1],
                queryPropObjById: head(valueList)
            },
            () => {
                this.handleSearchParamsChange();
            }
        );
    }

    // 报警等级
    handleQueryLevelChange(value) {
        this.setState({
            level: value
        }, () => {
            this.handleSearchParamsChange();
        })
    }

    // 报警类别赛选
    handleQueryAlarmTypeChange(value) {
        const valueList = split(value, ':');
        console.log(valueList)
        this.setState({
            typeId: head(valueList),
            typeName: valueList[1]
        }, () => {
            this.handleSearchParamsChange()
        })
    }


    // boolean类型下报警限值改变事件
    handleLimitValueChange(value) {
        const { selectRowRecord } = this.state;
        this.setState({
            selectRowRecord: merge(selectRowRecord, {
                limitValue: value,
            }),
        });
    }

    // 是否启用改变
    handleEnabledChange(value) {
        const { selectRowRecord } = this.state;
        this.setState({
            selectRowRecord: merge(selectRowRecord, {
                enabled: value,
            }),
        });
    }

    // 表格分页，排序，筛选变化时触发
    handleTableChange(pagination) {
        const { queryObjName, queryPropName } = this.state;
        const pageIndex = get(pagination, 'current', 1);
        const pageSize = get(pagination, 'pageSize', 10);
        this.setState(
            {
                pageIndex,
                pageSize,
            },
            () => {
                this.getTableData(queryObjName, queryPropName, pageIndex, pageSize);
            }
        );
    }

    // 在外部更改启用状态 
    handleEnabledOuterChange = (checked, row, index) => {
        const newData = [...this.state.tableData];
        const selectRowRecord = {
            ...row,
            enabled: checked
        }
        newData.splice(index, 1, selectRowRecord)
        this.setState({
            tableData: newData,
            selectRowRecord
        })
        this.handleOuterAlarmInfoComfirm(selectRowRecord)
    }

    handleRowClick = (record, index) => {
        const { activeRowIndex } = this.state;
        console.log(record);
        this.setState({
            activeRowIndex: activeRowIndex === index ? '' : index,
            selectRowRecord: activeRowIndex === index ? {} : {
                propLable: record.propLable,//属性分类
                propName: record.propName,//属性名称
                // objTypeName: record.objLabelName,//对象分类
                objName: record.objName,//对象名称
            }
        })
    }

    setClassName = (record, index) => {//record代表表格行的内容，index代表行索引
        //判断索引相等时添加行的高亮样式
        return index === this.state.activeRowIndex ? 'l-table-row-active' : "";
    }
    render() {
        const {
            alarmInfoModalVisible,
            alarmItemDelModalVisible,
            isAddAlarm,
            tableLoading,
            tableData,
            currentTotal,
            infoConfirmLoading,
            delComfirmLoading,
            objNameList,
            propNameList,
            selectRowRecord,
            instationMessageVisible,
            dingTalkGroupVisible,
            dingTalkUserVisible,
            alarmId,
            queryObjName,
            queryPropName,
            queryPropLabel,
            propLabelList,
            objLabelList,
            queryPropObj,
            level,
            typeInfoList,
            typeName,
            objTypeList,
        } = this.state;

        const {
            form: { getFieldDecorator },
        } = this.props;

        // 对象分类 {typeName: "成本指标", id: 2}
        const objTypeListOption = map(objTypeList, item => (
            <Option key={get(item, 'id', '')}>{get(item, 'typeName', '')}</Option>
        ));

        const objNameInfoListOption = map(objNameList, item => (
            <Option key={get(item, 'id', '')}>{get(item, 'showName', '')}</Option>
        ));
        const propNameInfoListOption = map(propNameList, item => (
            <Option key={`${get(item, 'id', '')}:${get(item, 'dataType', '')}`}>
                {get(item, 'showName', '')}
            </Option>
        ));
        // 属性下拉标签
        const propLabelInfoListOption = map(propLabelList, item => (
            <Option key={`${get(item, 'id', '')}:${get(item, 'name', '')}`}>
                {get(item, 'name', '')}
            </Option>
        ));

        // 对象下拉标签
        const objLabelInfoListOption = map(objLabelList, item => (
            <Option key={`${get(item, 'id', '')}:${get(item, 'name', '')}`}>
                {get(item, 'name', '')}
            </Option>
        ));
        // 报警类别下拉
        const alarmTypeList = map(typeInfoList, item => (
            <Option key={`${get(item, 'id', '')}:${get(item, 'typeName', '')}`}>
                {get(item, 'typeName', '')}
            </Option>
        ))

        const columns = [
            {
                title: '对象分类',//车间
                dataIndex: 'objShowName',
                key: 'objShowName',
                width: '5%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '对象名称',
                dataIndex: 'objShowName',
                key: 'objShowName',
                width: '5%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '属性名称',
                dataIndex: 'propShowName',
                key: 'propShowName',
                width: '5%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '属性分类',
                dataIndex: 'propLabelShowName',
                key: 'propLabelShowName',
                width: '5%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '报警分类',
                dataIndex: 'objLabelShowName',
                key: 'objLabelShowName',
                width: '5%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '报警名称',
                dataIndex: 'alarmName',
                key: 'alarmName',
                width: '8%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '报警描述',
                dataIndex: 'description',
                key: 'description',
                width: '12%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '报警等级',
                dataIndex: 'priority',
                key: 'priority',
                width: '5%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '触发条件',
                dataIndex: 'triggerCondition',
                key: 'triggerCondition',
                width: '6%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '推送频率（分钟）',
                dataIndex: 'duration',
                key: 'duration',
                width: '6%',
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: '是否启用',
                dataIndex: 'enabled',
                key: 'enabled',
                width: '5%',
                render: (text, record, index) => <Checkbox checked={text} onChange={(e) => this.handleEnabledOuterChange(e.target.checked, record, index)} />,
            },
            {
                title: '推送关联',
                dataIndex: 'action',
                key: 'action',
                width: '14%',
                render: (text, record) => {
                    return (
                        <div className="tableLineStyle">
                            <span
                                className="anction"
                                onClick={e => this.handleInstationMessageModalOpen(e, record)}
                            >
                                站内信
              </span>
                            <span
                                className="anction"
                                onClick={e => this.handleDingTalkGroupModalOpen(e, record)}
                            >
                                钉钉群
              </span>
                            <span
                                className="anction"
                                onClick={e => this.handleDingTalkUserModalOpen(e, record)}
                            >
                                钉钉个人
              </span>
                        </div>
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '6%',
                render: (text, record) => {
                    return (
                        <div className="tableLineStyle">
                            <span
                                className="editButton"
                                onClick={(e) => { e.stopPropagation(); this.handleAlarmInfoModalOpen(false, record) }}
                            >
                                编辑
              </span>
                            <span
                                className="delButton"
                                onClick={(e) => { e.stopPropagation(); this.handleAlarmItemDelModalOpen(record.alarmId) }}
                            >
                                删除
              </span>
                        </div>
                    );
                },
            },
        ];

        return (
            <div className="alarm">
                {/* 新增、编辑弹框 */}
                <Modal
                    visible={alarmInfoModalVisible}
                    title={isAddAlarm ? '新增' : '编辑'}
                    footer={false}
                    onCancel={this.handleAlarmInfoModalClose}
                    className="infoModalStyle"
                >
                    <div>
                        <Form>

                            <FormItem
                                label="对象分类"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('objType', {
                                    initialValue: selectRowRecord.objTypeName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择对象分类',
                                        },
                                    ],
                                })(
                                    <Select
                                        showSearch
                                        filterOption={false}
                                        onSearch={this.handleObjTypeSearch}
                                        onChange={this.handleObjTypeChange}
                                        notFoundContent={null}
                                        defaultActiveFirstOption={false}
                                        // 展开下拉菜单时获取对象名称
                                        onDropdownVisibleChange={visible => {
                                            if (visible) {
                                                this.getObjNameList('', listData => {
                                                    this.setState({
                                                        objNameList: listData,
                                                    });
                                                });
                                            }
                                        }}
                                    >
                                        {objTypeListOption}
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem
                                label="对象名称"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('objName', {
                                    initialValue: selectRowRecord.objName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入对象名称',
                                        },
                                    ],
                                })(
                                    <Select
                                        showSearch
                                        filterOption={false}
                                        onSearch={this.handleObjNameSearch}
                                        onChange={this.handleObjNameChange}
                                        notFoundContent={null}
                                        defaultActiveFirstOption={false}
                                        onDropdownVisibleChange={visible => {
                                            if (visible) {
                                                this.getObjNameList('', listData => {
                                                    this.setState({
                                                        objNameList: listData,
                                                    });
                                                });
                                            }
                                        }}
                                    >
                                        {objNameInfoListOption}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="属性分类"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('propName', {
                                    initialValue: selectRowRecord.propName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入属性名称',
                                        },
                                    ],
                                })(
                                    <Select
                                        notFoundContent={null}
                                        onDropdownVisibleChange={visible => {
                                            if (visible) {
                                                this.handlePropNameDropdownOpen(
                                                    selectRowRecord.objName
                                                );
                                            }
                                        }}
                                        onChange={this.handlePropNameChange}
                                    >
                                        {propNameInfoListOption}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="属性名称"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('propName', {
                                    initialValue: selectRowRecord.propName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入属性名称',
                                        },
                                    ],
                                })(
                                    <Select
                                        notFoundContent={null}
                                        onDropdownVisibleChange={visible => {
                                            if (visible) {
                                                this.handlePropNameDropdownOpen(
                                                    selectRowRecord.objName
                                                );
                                            }
                                        }}
                                        onChange={this.handlePropNameChange}
                                    >
                                        {propNameInfoListOption}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="报警分类"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('typeName', {
                                    initialValue: selectRowRecord.typeName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入报警分类',
                                        },
                                    ],
                                })(
                                    <Select
                                        value={typeName}
                                        filterOption={false}
                                        notFoundContent={null}
                                        defaultActiveFirstOption={false}
                                        onChange={this.handleQueryAlarmTypeChange}
                                    >
                                        <Select.Option key="请选择:请选择">
                                            请选择
                                        </Select.Option>
                                        {alarmTypeList}
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem
                                label="报警名称"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('showName', {
                                    initialValue: selectRowRecord.alarmName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入报警名称',
                                        },
                                    ],
                                })(<Input />)}
                            </FormItem>
                            <FormItem
                                label="报警等级"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('priority', {
                                    initialValue: selectRowRecord.priority,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入报警等级',
                                        },
                                    ],
                                })(
                                    <Select>
                                        <Option value={1}>1</Option>
                                        <Option value={2}>2</Option>
                                        <Option value={3}>3</Option>
                                        <Option value={4}>4</Option>
                                        <Option value={5}>5</Option>
                                        <Option value={6}>6</Option>
                                        <Option value={7}>7</Option>
                                        <Option value={8}>8</Option>
                                        <Option value={9}>9</Option>
                                        <Option value={10}>10</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="报警条件"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('alarmType', {
                                    initialValue: selectRowRecord.alarmType,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入报警条件',
                                        },
                                    ],
                                })(
                                    toLower(selectRowRecord.propType) === 'boolean' ? (
                                        <Select>
                                            <Option value="eq">=</Option>
                                        </Select>
                                    ) : (
                                            <Select>
                                                <Option value="lt">{'<'}</Option>
                                                <Option value="le">≤</Option>
                                                <Option value="eq">=</Option>
                                                <Option value="ge">≥</Option>
                                                <Option value="gt">{'>'}</Option>
                                            </Select>
                                        )
                                )}
                            </FormItem>
                            <FormItem
                                label="报警限值"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('limitValue', {
                                    initialValue: selectRowRecord.limitValue,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入报警限值',
                                        },
                                    ],
                                })(
                                    toLower(selectRowRecord.propType) === 'boolean' ? (
                                        <RadioGroup
                                            onChange={e =>
                                                this.handleLimitValueChange(e.target.value)
                                            }
                                            value={selectRowRecord.limitValue}
                                        >
                                            <Radio value>true</Radio>
                                            <Radio value={false}>false</Radio>
                                        </RadioGroup>
                                    ) : (
                                            <InputNumber />
                                        )
                                )}
                            </FormItem>
                            <FormItem
                                label="推送频率"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('duration', {
                                    initialValue: selectRowRecord.duration,
                                })(<InputNumber />)}
                            </FormItem>
                            <FormItem
                                label="是否启用"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('enabled', {
                                    initialValue: selectRowRecord.enabled,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择是否启用',
                                        },
                                    ],
                                })(
                                    <RadioGroup
                                        onChange={e => this.handleEnabledChange(e.target.value)}
                                        value={selectRowRecord.enabled}
                                    >
                                        <Radio value>启用</Radio>
                                        <Radio value={false}>不启用</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem
                                label="报警描述"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign="left"
                            >
                                {getFieldDecorator('description', {
                                    initialValue: selectRowRecord.description,
                                })(<TextArea />)}
                            </FormItem>
                        </Form>
                        <div className="modalBodyButton">
                            <Button
                                type="primary"
                                onClick={this.handleAlarmInfoComfirm}
                                loading={infoConfirmLoading}
                                className="modalSureBtn"
                            >
                                保存
                            </Button>
                            <Button
                                onClick={this.handleAlarmInfoModalClose}
                                className="modalCancelBtn"
                            >
                                取消
                            </Button>
                        </div>
                    </div>
                </Modal>
                {/* 删除弹框 */}
                <Modal
                    title="删除"
                    visible={alarmItemDelModalVisible}
                    footer={false}
                    onCancel={this.handleAlarmItemDelModalClose}
                    className="delModalStyle"
                    bodyStyle={{ textAlign: 'center' }}
                >
                    <p className="delModalBodyContent">是否删除？</p>
                    <div className="modalBodyButton">
                        <Button
                            loading={delComfirmLoading}
                            type="primary"
                            onClick={this.handleAlarmItemDelete}
                            className="modalSureBtn"
                        >
                            确定
                        </Button>
                        <Button
                            onClick={this.handleAlarmItemDelModalClose}
                            className="modalCancelBtn"
                        >
                            取消
                        </Button>
                    </div>
                </Modal>
                {/* 站内信关联弹框 */}
                <Modal
                    title="站内信关联"
                    visible={instationMessageVisible}
                    onCancel={this.handleInstationMessageModalClose}
                    footer={false}
                    className="tableModalStyle"
                >
                    {instationMessageVisible && (
                        <InstationMessageModal
                            alarmId={alarmId}
                            onClose={this.handleInstationMessageModalClose}
                        />
                    )}
                </Modal>
                {/* 钉钉群组关联弹框 */}
                <Modal
                    title="钉钉群组关联"
                    visible={dingTalkGroupVisible}
                    onCancel={this.handleDingTalkGroupModalClose}
                    footer={false}
                    className="tableModalStyle"
                >
                    {dingTalkGroupVisible && (
                        <DingTalkGroup
                            alarmId={alarmId}
                            onClose={this.handleDingTalkGroupModalClose}
                        />
                    )}
                </Modal>
                {/* 钉钉个人关联弹框 */}
                <Modal
                    title="钉钉个人关联"
                    visible={dingTalkUserVisible}
                    onCancel={this.handleDingTalkUserModalClose}
                    footer={false}
                    className="tableModalStyle"
                >
                    {dingTalkUserVisible && (
                        <DingTalkUser
                            alarmId={alarmId}
                            onClose={this.handleDingTalkUserModalClose}
                        />
                    )}
                </Modal>
                <Row className="alarmHeader">
                    <Col span={24}>

                        <span className="alarmObj">对象分类:</span>
                        <Select
                            showSearch
                            filterOption={false}
                            placeholder="请输入对象分类"
                            dropdownMatchSelectWidth
                            // onSearch={this.handleObjNameSearch}
                            // onChange={this.handleQueryObjNameChange}
                            notFoundContent={null}
                            defaultActiveFirstOption={false}
                            // value={queryObjName}
                            style={{ width: '200px' }}
                            onDropdownVisibleChange={visible => {
                                if (visible) {
                                    this.getObjNameList('', listData => {
                                        this.setState({
                                            objNameList: listData,
                                        });
                                    });
                                }
                            }}
                        >
                            <Select.Option key="全部">
                                全部
                            </Select.Option>
                            {/*{objNameInfoListOption}*/}
                        </Select>

                        <span style={{ 'margin-left': '10px' }} className="alarmObj">对象实例:</span>
                        <Select
                            showSearch
                            filterOption={false}
                            placeholder="请输入对象实例"
                            dropdownMatchSelectWidth
                            onSearch={this.handleObjNameSearch}
                            onChange={this.handleQueryObjNameChange}
                            notFoundContent={null}
                            defaultActiveFirstOption={false}
                            value={queryObjName}
                            style={{ width: '200px' }}
                            onDropdownVisibleChange={visible => {
                                if (visible) {
                                    this.getObjNameList('', listData => {
                                        this.setState({
                                            objNameList: listData,
                                        });
                                    });
                                }
                            }}
                        >
                            <Select.Option key="全部">
                                全选
                            </Select.Option>
                            {objNameInfoListOption}
                        </Select>

                        {/*<span style={{'margin-left': '10px'}}  className="propLabel">属性标签:</span>*/}
                        {/*<Select*/}
                        {/*    placeholder="请输入属性标签"*/}
                        {/*    value={queryPropLabel}*/}
                        {/*    dropdownMatchSelectWidth*/}
                        {/*    notFoundContent={null}*/}
                        {/*    onDropdownVisibleChange={*/}
                        {/*        visible => {*/}
                        {/*            if (visible) {*/}
                        {/*                this.handlePropLabelDropdownOpen('property');*/}
                        {/*            }*/}
                        {/*        }*/}
                        {/*    }*/}
                        {/*    onChange={this.handleQueryPropLabelChange}*/}
                        {/*    style={{ width: '200px','margin-left': '10px' }}*/}
                        {/*>*/}
                        {/*    <Select.Option key ="全部">*/}
                        {/*        全选*/}
                        {/*    </Select.Option>*/}
                        {/*    {propLabelInfoListOption}*/}
                        {/*</Select>*/}

                        <span style={{ 'margin-left': '10px' }} className="alarmProp">属性分类:</span>
                        <Select
                            placeholder="请输入属性分类"
                            value={queryPropName}
                            dropdownMatchSelectWidth
                            notFoundContent={null}
                            onDropdownVisibleChange={visible => {
                                if (queryObjName !== '') {
                                    if (visible) {
                                        this.handlePropNameDropdownOpen(queryObjName);
                                    }
                                } else {
                                    message.warning('请先选择对象!');
                                }
                            }}
                            onChange={this.handleQueryPropNameChange}
                            style={{ width: '200px' }}
                        >
                            <Select.Option key="全部">
                                全选
                            </Select.Option>
                            {propNameInfoListOption}
                        </Select>

                        <span style={{ 'margin-left': '10px' }} className="propDesc">属性名称:</span>
                        <Input
                            placeholder="请输入属性描述"
                            onBlur={(e) => {
                                this.handleSearchParamsChange()
                            }}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                console.log(nextValue)
                                this.setState(
                                    {
                                        propDesc: nextValue
                                    }
                                )
                            }}
                            style={{ width: '200px', position: 'absolute', 'margin-left': '10px' }}
                        />
                        <Switch
                            style={{ 'margin-left': '220px' }}
                            checkedChildren="已设置"
                            unCheckedChildren="未设置" defaultChecked />


                        {/*<span style={{'margin-left': '10px'}}  className="propLabel">对象标签:</span>*/}
                        {/*<Select*/}
                        {/*    placeholder="请输入对象标签"*/}
                        {/*    value={queryPropObj}*/}
                        {/*    dropdownMatchSelectWidth*/}
                        {/*    notFoundContent={null}*/}
                        {/*    onDropdownVisibleChange={*/}
                        {/*        visible => {*/}
                        {/*            if (visible) {*/}
                        {/*                this.handlePropLabelDropdownOpen('object');*/}
                        {/*            }*/}
                        {/*        }*/}
                        {/*    }*/}
                        {/*    onChange={this.handleQueryObjLabelChange}*/}
                        {/*    style={{ width: '200px','margin-left': '10px' }}*/}
                        {/*>*/}
                        {/*    <Select.Option key ="全部">*/}
                        {/*        全选*/}
                        {/*    </Select.Option>*/}
                        {/*    {objLabelInfoListOption}*/}
                        {/*</Select>*/}


                    </Col>
                </Row>
                <Row className="alarmHeader2">
                    <Col span={24}>
                        <span
                            // style={{'margin': '10px'}}
                            className="alarmType">报警分类:</span>
                        <Select
                            value={typeName}
                            style={{ width: '200px', 'margin-left': '10px' }}
                            onChange={this.handleQueryAlarmTypeChange}
                        >
                            <Select.Option key="请选择:请选择">
                                请选择
                            </Select.Option>
                            {alarmTypeList}
                        </Select>

                        <span style={{ 'margin-left': '10px' }} className="alarmName">报警名称:</span>
                        <Input
                            placeholder="请输入报警名称"
                            onBlur={(e) => {
                                this.handleSearchParamsChange()
                            }}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                console.log(nextValue)
                                this.setState(
                                    {
                                        alarmName: nextValue
                                    }
                                )
                            }}
                            style={{ width: '200px', position: 'absolute', 'margin-left': '10px' }}
                        />

                        <span style={{ 'margin-left': '220px' }} className="alarmProp">报警等级:</span>
                        <Select
                            value={level}
                            style={{ width: '200px' }}
                            onChange={this.handleQueryLevelChange}
                        >
                            <Option value={0}>请选择</Option>
                            <Option value={1}>1</Option>
                            <Option value={2}>2</Option>
                            <Option value={3}>3</Option>
                            <Option value={4}>4</Option>
                            <Option value={5}>5</Option>
                            <Option value={6}>6</Option>
                            <Option value={7}>7</Option>
                            <Option value={8}>8</Option>
                            <Option value={9}>9</Option>
                            <Option value={10}>10</Option>
                        </Select>


                        <span style={{ 'margin-left': '10px' }} className="alarmDesc">报警描述:</span>
                        <Input
                            placeholder="请输入报警描述"
                            onBlur={(e) => {
                                this.handleSearchParamsChange()
                            }}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                console.log(nextValue)
                                this.setState(
                                    {
                                        alarmDesc: nextValue
                                    }
                                )
                            }}
                            style={{ width: '200px', position: 'absolute', 'margin-left': '10px' }}
                        />
                        <Button
                            style={{ 'margin-left': '220px' }}
                            className="addButton"
                            type="primary"
                            onClick={() => this.handleAlarmInfoModalOpen(true, this.state.selectRowRecord)}
                        >
                            新增
                        </Button>
                        <Button
                            style={{ 'margin-left': '10px' }}
                            className="addButton"
                            type="primary"
                            onClick={() => this.handleImportExcel(true, {})}
                        >
                            导入
                        </Button>
                        <Button
                            style={{ 'margin-left': '10px' }}
                            className="addButton"
                            type="primary"
                            onClick={() => this.handleOutputExcel(true, {})}
                        >
                            导出
                        </Button>





                    </Col>
                </Row>
                <div style={{ 'margin-top': '10px' }} className="alarmTable">
                    <Table
                        onRow={(record, index) => {
                            return {
                                onClick: event => this.handleRowClick(record, index), // 点击行
                            };
                        }}
                        rowClassName={this.setClassName}
                        loading={tableLoading}
                        columns={columns}
                        dataSource={tableData}
                        rowKey={record => record.alarmId}
                        onChange={this.handleTableChange}
                        pagination={{
                            total: currentTotal,
                            showTotal: (total, range) =>
                                `显示${range[0]}-${range[1]},共${total}条`,
                            showQuickJumper: true,
                            size: 'small',
                        }}
                    />
                </div>
            </div >
        );
    }
}

export default Form.create()(AlarmManager);

// 站内信modal内部内容
class InstationMessageModal extends React.PureComponent {
    static propTypes = {
        alarmId: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            tableData: [], // 站内信表格数据
            tableLoading: false, // 站内信表格加载状态
            pageIndex: 1, // 页数
            pageSize: DEFAULT_SIZE, // 每页条数
            currentTotal: 0, // 站内信表格总数
            selectedRowKeys: [], // 站内信表格选中行
            condition: '', // 搜索内容
        };

        this.getTableData = this.getTableData.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleRowSelected = this.handleRowSelected.bind(this);
        this.handleAllRowSelected = this.handleAllRowSelected.bind(this);
        this.searchKeyword = this.searchKeyword.bind(this);
    }

    componentDidMount() {
        this.getTableData();
    }

    // 获取站内信modal表格数据
    getTableData(condition = '', pageIndex = 1, pageSize = DEFAULT_SIZE) {
        const { alarmId } = this.props;
        this.setState(
            {
                tableLoading: true,
            },
            () => {
                scriptUtil.excuteScriptService(
                    {
                        objName: 'tb_alarm_mail_map',
                        serviceName: 'queryMailMap',
                        params: {
                            alarmId,
                            name: condition,
                            pageIndex,
                            pageSize,
                        },
                    },
                    res => {
                        if (
                            res &&
                            get(res, ['code']) &&
                            parseInt(get(res, ['code']), 10) === 200 &&
                            get(res, ['result'])
                        ) {
                            const resultObj = get(res, ['result']);
                            const { code, body } = resultObj;
                            const resultData = JSON.parse(body);
                            console.log('instationMessage', resultData);
                            const isSelectedList = [];
                            forEach(resultData.list, item => {
                                if (item.correlated) {
                                    isSelectedList.push(item.code);
                                }
                            });
                            if (code === 200 || code === '200') {
                                // 成功
                                this.setState({
                                    tableLoading: false,
                                    tableData: get(resultData, ['list'], []),
                                    currentTotal: get(resultData, ['total'], 0),
                                    selectedRowKeys: isSelectedList,
                                });
                                // message.success('加载成功');
                            } else {
                                this.setState({
                                    tableLoading: false,
                                });
                                message.error('加载失败');
                            }
                        } else {
                            this.setState({
                                tableLoading: false,
                            });
                            message.error('加载失败');
                        }
                    }
                );
            }
        );
    }

    // 站内信表格选中行
    handleSelectedRowKeyChange = selectedRowKeys => {
        this.setState({
            selectedRowKeys,
        });
    };

    // 关闭modal操作
    handleClose() {
        const { onClose } = this.props;
        if (isFunction(onClose)) {
            onClose();
        }
    }

    // 表格分页，排序，筛选变化时触发
    handleTableChange(pagination) {
        const { condition } = this.state;
        const pageIndex = get(pagination, 'current', 1);
        const pageSize = get(pagination, 'pageSize', 10);
        this.getTableData(condition, pageIndex, pageSize);
    }

    // 手动选中/取消某项的回调
    handleRowSelected(record, selected) {
        const { alarmId } = this.props;
        console.log('record', record, record.userName);
        if (selected) {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_mail_map',
                    serviceName: 'addMailMap',
                    params: {
                        alarmId,
                        userName: record.userName,
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联成功');
                    } else {
                        message.error('关联失败');
                    }
                }
            );
        } else {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_mail_map',
                    serviceName: 'delMailMap',
                    params: {
                        alarmId,
                        userName: record.userName,
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联删除成功');
                    } else {
                        message.error('关联删除失败');
                    }
                }
            );
        }
    }

    // 手动选择全部
    handleAllRowSelected(selected, selectedRows, changeRows) {
        const { alarmId } = this.props;
        const selectedChangeRowKeys = map(changeRows, item => item.userName);
        if (selected) {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_mail_map',
                    serviceName: 'batchAddMailMap',
                    params: {
                        alarmId,
                        userNames: String(selectedChangeRowKeys),
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联成功');
                    } else {
                        message.error('关联失败');
                    }
                }
            );
        } else {
            // 全部取消，删除所有关联
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_mail_map',
                    serviceName: 'batchDelMailMap',
                    params: {
                        alarmId,
                        userNames: String(selectedChangeRowKeys),
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联删除成功');
                    } else {
                        message.error('关联删除失败');
                    }
                }
            );
        }
    }

    // 选择框内容改变事件
    searchKeyword(value) {
        this.setState(
            {
                selectedRowKeys: [],
                condition: value,
            },
            () => {
                this.getTableData(value);
            }
        );
    }

    //修改连接地址
    handleEditLink(e, row, index) {
        const newData = [...this.state.tableData];
        newData.splice(index, 1, { ...row, url: e.target.value })
        this.setState({ tableData: [...newData] })
    }
    columns = [
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '人员名称',
            dataIndex: 'staffName',
            key: 'staffName',
        },
        {
            title: '账户',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '链接',
            dataIndex: 'url',
            key: 'url',
            render: (text, row, index) => <Input value={text} onChange={(e) => this.handleEditLink(e, row, index)} />
        },
    ];
    render() {
        const {
            tableData, // 站内信表格数据
            tableLoading, // 站内信表格加载状态
            currentTotal, // 站内信表格总数
            selectedRowKeys, // 站内信表格选中行
            condition, // 搜索框内容
        } = this.state;



        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleSelectedRowKeyChange,
            onSelect: this.handleRowSelected,
            onSelectAll: this.handleAllRowSelected,
        };

        return (
            <div className="modalListContent">
                <div className="modalListCondition">
                    <Input
                        placeholder="请输入查询内容"
                        className="listSearchInput"
                        suffix={
                            condition ? (
                                <Icon
                                    type="close-circle"
                                    onClick={() => this.searchKeyword('')}
                                    className="modalSearchIcon"
                                />
                            ) : (
                                    <Icon type="search" className="modalSearchIcon" />
                                )
                        }
                        onChange={e => this.searchKeyword(e.target.value)}
                        value={condition}
                    />
                </div>
                <Table
                    className="modalTableStyle"
                    columns={this.columns}
                    dataSource={tableData}
                    loading={tableLoading}
                    rowKey={record => record.code}
                    rowSelection={rowSelection}
                    pagination={{
                        simple: true,
                        total: currentTotal,
                        // showTotal: (total, range) =>
                        //   `显示${range[0]}-${range[1]},共${total}条`,
                        // size: 'small',
                    }}
                    onChange={this.handleTableChange}
                />
                <div className="modalBodyButton">
                    <Button onClick={this.handleClose} className="modalCancelBtn">
                        关闭
                    </Button>
                </div>
            </div>
        );
    }
}

// 钉钉群modal内部内容
class DingTalkGroup extends React.PureComponent {
    static propTypes = {
        alarmId: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            tableData: [], // 钉钉群组表格数据
            tableLoading: false, // 钉钉群组表格加载状态
            pageIndex: 1, // 页数
            pageSize: DEFAULT_SIZE, // 每页条数
            currentTotal: 0, // 钉钉群组表格总数
            selectedRowKeys: [], // 钉钉群组表格选中行
            condition: '',
        };

        this.getTableData = this.getTableData.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleRowSelected = this.handleRowSelected.bind(this);
        this.handleAllRowSelected = this.handleAllRowSelected.bind(this);
        this.searchKeyword = this.searchKeyword.bind(this);
    }

    componentDidMount() {
        this.getTableData();
    }

    // 获取钉钉群组modal表格数据
    getTableData(condition = '', pageIndex = 1, pageSize = DEFAULT_SIZE) {
        const { alarmId } = this.props;
        this.setState(
            {
                tableLoading: true,
            },
            () => {
                scriptUtil.excuteScriptService(
                    {
                        objName: 'tb_alarm_dingtalk_group_map',
                        serviceName: 'getDingtalkGroupMap',
                        params: {
                            almId: alarmId,
                            name: condition,
                            pageIndex,
                            pageSize,
                        },
                    },
                    res => {
                        if (
                            res &&
                            get(res, ['code']) &&
                            parseInt(get(res, ['code']), 10) === 200 &&
                            get(res, ['result'])
                        ) {
                            const resultObj = get(res, ['result']);
                            const { code, body } = resultObj;
                            const resultData = JSON.parse(body);
                            console.log('DingTalkGroup', resultData);
                            const isSelectedList = [];
                            forEach(resultData.list, item => {
                                if (item.selected === 1) {
                                    isSelectedList.push(item.id);
                                }
                            });
                            if (code === 200 || code === '200') {
                                // 成功
                                this.setState({
                                    tableLoading: false,
                                    tableData: get(resultData, ['list'], []),
                                    currentTotal: get(resultData, ['total'], 0),
                                    selectedRowKeys: isSelectedList,
                                });
                                // message.success('加载成功');
                            } else {
                                this.setState({
                                    tableLoading: false,
                                });
                                message.error('加载失败');
                            }
                        } else {
                            this.setState({
                                tableLoading: false,
                            });
                            message.error('加载失败');
                        }
                    }
                );
            }
        );
    }

    // 钉钉群组表格选中行
    handleSelectedRowKeyChange = selectedRowKeys => {
        this.setState({
            selectedRowKeys,
        });
    };

    // 关闭modal操作
    handleClose() {
        const { onClose } = this.props;
        if (isFunction(onClose)) {
            onClose();
        }
    }

    // 表格分页，排序，筛选变化时触发
    handleTableChange(pagination) {
        const { condition } = this.state;
        const pageIndex = get(pagination, 'current', 1);
        const pageSize = get(pagination, 'pageSize', 10);
        this.getTableData(condition, pageIndex, pageSize);
    }

    // 手动选中/取消某项的回调
    handleRowSelected(record, selected) {
        const { alarmId } = this.props;
        if (selected) {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_group_map',
                    serviceName: 'addDingtalkGroupMap',
                    params: {
                        alarmId,
                        groupId: record.id,
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联成功');
                    } else {
                        message.error('关联失败');
                    }
                }
            );
        } else {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_group_map',
                    serviceName: 'delDingtalkGroupMap',
                    params: {
                        alarmId,
                        groupId: record.id,
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联删除成功');
                    } else {
                        message.error('关联删除失败');
                    }
                }
            );
        }
    }

    // 手动选择全部
    handleAllRowSelected(selected, selectedRows, changeRows) {
        const { alarmId } = this.props;
        const selectedChangeRowKeys = map(changeRows, item => item.id);
        if (selected) {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_group_map',
                    serviceName: 'batchAddDingtalkGroupMap',
                    params: {
                        almId: alarmId,
                        groups: String(selectedChangeRowKeys),
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联成功');
                    } else {
                        message.error('关联失败');
                    }
                }
            );
        } else {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_group_map',
                    serviceName: 'batchDelDingtalkGroupMap',
                    params: {
                        alarmId,
                        groupIds: String(selectedChangeRowKeys),
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联删除成功');
                    } else {
                        message.error('关联删除失败');
                    }
                }
            );
        }
    }

    // 选择框内容改变事件
    searchKeyword(value) {
        this.setState(
            {
                selectedRowKeys: [],
                condition: value,
            },
            () => {
                this.getTableData(value);
            }
        );
    }

    render() {
        const {
            tableData, // 钉钉群组表格数据
            tableLoading, // 钉钉群组表格加载状态
            currentTotal, // 钉钉群组表格总数
            selectedRowKeys, // 钉钉群组表格选中行
            condition, // 搜索框内容
        } = this.state;

        const columns = [
            {
                title: '钉钉群',
                dataIndex: 'name',
                key: 'name',
            },
        ];

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleSelectedRowKeyChange,
            onSelect: this.handleRowSelected,
            onSelectAll: this.handleAllRowSelected,
        };

        return (
            <div className="modalListContent">
                <div className="modalListCondition">
                    <Input
                        placeholder="请输入查询内容"
                        className="listSearchInput"
                        suffix={
                            condition ? (
                                <Icon
                                    type="close-circle"
                                    onClick={() => this.searchKeyword('')}
                                    className="modalSearchIcon"
                                />
                            ) : (
                                    <Icon type="search" className="modalSearchIcon" />
                                )
                        }
                        onChange={e => this.searchKeyword(e.target.value)}
                        value={condition}
                    />
                </div>
                <Table
                    className="modalTableStyle"
                    columns={columns}
                    dataSource={tableData}
                    loading={tableLoading}
                    rowKey={record => record.id}
                    rowSelection={rowSelection}
                    pagination={{
                        simple: true,
                        total: currentTotal,
                        // showTotal: (total, range) =>
                        //   `显示${range[0]}-${range[1]},共${total}条`,
                        // size: 'small',
                    }}
                    onChange={this.handleTableChange}
                />
                <div className="modalBodyButton">
                    <Button onClick={this.handleClose} className="modalCancelBtn">
                        关闭
                    </Button>
                </div>
            </div>
        );
    }
}

// 钉钉个人modal内部内容
class DingTalkUser extends React.PureComponent {
    static propTypes = {
        alarmId: PropTypes.string.isRequired,
        onClose: PropTypes.func,
    };

    static defaultProps = {
        onClose: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            tableData: [], // 钉钉人员表格数据
            tableLoading: false, // 钉钉人员表格加载状态
            pageIndex: 1, // 页数
            pageSize: DEFAULT_SIZE, // 每页条数
            currentTotal: 0, // 钉钉人员表格总数
            selectedRowKeys: [], // 钉钉人员表格选中行
            condition: '', // 搜索内容
        };

        this.getTableData = this.getTableData.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleRowSelected = this.handleRowSelected.bind(this);
        this.handleAllRowSelected = this.handleAllRowSelected.bind(this);
        this.searchKeyword = this.searchKeyword.bind(this);
    }

    componentDidMount() {
        this.getTableData();
    }

    // 获取钉钉个人modal表格数据
    getTableData(condition = '', pageIndex = 1, pageSize = DEFAULT_SIZE) {
        const { alarmId } = this.props;
        this.setState(
            {
                tableLoading: true,
            },
            () => {
                scriptUtil.excuteScriptService(
                    {
                        objName: 'tb_alarm_dingtalk_user_map',
                        serviceName: 'queryDingtalkUserMap',
                        params: {
                            alarmId,
                            name: condition,
                            pageIndex,
                            pageSize,
                        },
                    },
                    res => {
                        if (
                            res &&
                            get(res, ['code']) &&
                            parseInt(get(res, ['code']), 10) === 200 &&
                            get(res, ['result'])
                        ) {
                            const resultObj = get(res, ['result']);
                            const { code, body } = resultObj;
                            const resultData = JSON.parse(body);
                            console.log('DingTalkUser', resultData);
                            const isSelectedList = [];
                            forEach(resultData.list, item => {
                                if (item.selected) {
                                    isSelectedList.push(item.id);
                                }
                            });
                            if (code === 200 || code === '200') {
                                // 成功
                                this.setState({
                                    tableLoading: false,
                                    tableData: get(resultData, ['list'], []),
                                    currentTotal: get(resultData, ['total'], 0),
                                    selectedRowKeys: isSelectedList,
                                });
                                // message.success('加载成功');
                            } else {
                                this.setState({
                                    tableLoading: false,
                                });
                                message.error('加载失败');
                            }
                        } else {
                            this.setState({
                                tableLoading: false,
                            });
                            message.error('加载失败');
                        }
                    }
                );
            }
        );
    }

    // 钉钉人员表格选中行
    handleSelectedRowKeyChange = selectedRowKeys => {
        this.setState({
            selectedRowKeys,
        });
    };

    // 点击确认/取消 关闭modal操作
    handleClose() {
        const { onClose } = this.props;
        if (isFunction(onClose)) {
            onClose();
        }
    }

    // 表格分页，排序，筛选变化时触发
    handleTableChange(pagination) {
        const { condition } = this.state;
        const pageIndex = get(pagination, 'current', 1);
        const pageSize = get(pagination, 'pageSize', 10);
        this.getTableData(condition, pageIndex, pageSize);
    }

    // 手动选中/取消某项的回调
    handleRowSelected(record, selected) {
        const { alarmId } = this.props;
        if (selected) {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_user_map',
                    serviceName: 'addDingtalkUserMap',
                    params: {
                        alarmId,
                        userId: record.id,
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联成功');
                    } else {
                        message.error('关联失败');
                    }
                }
            );
        } else {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_user_map',
                    serviceName: 'delDingtalkUserMap',
                    params: {
                        alarmId,
                        userId: record.id,
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联删除成功');
                    } else {
                        message.error('关联删除失败');
                    }
                }
            );
        }
    }

    // 手动选择全部
    handleAllRowSelected(selected, selectedRows, changeRows) {
        const { alarmId } = this.props;
        const selectedChangeRowKeys = map(changeRows, item => item.id);
        if (selected) {
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_user_map',
                    serviceName: 'batchAddDingtalkUserMap',
                    params: {
                        almId: alarmId,
                        users: String(selectedChangeRowKeys),
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联成功');
                    } else {
                        message.error('关联失败');
                    }
                }
            );
        } else {
            console.log('cancelSelectedAll', selectedRows, changeRows);
            scriptUtil.excuteScriptService(
                {
                    objName: 'tb_alarm_dingtalk_user_map',
                    serviceName: 'batchDelDingtalkUserMap',
                    params: {
                        alarmId,
                        userIds: String(selectedChangeRowKeys),
                    },
                },
                res => {
                    console.log('res', res);
                    if (
                        res &&
                        get(res, ['code']) &&
                        parseInt(get(res, ['code']), 10) === 200 &&
                        get(res, ['result'])
                    ) {
                        // 成功
                        message.success('关联删除成功');
                    } else {
                        message.error('关联删除失败');
                    }
                }
            );
        }
    }

    // 选择框内容改变事件
    searchKeyword(value) {
        console.log(value)
        this.setState(
            {
                selectedRowKeys: [],
                condition: value,
            },
            () => {
                this.getTableData(value);
            }
        );
    }

    render() {
        const {
            tableData, // 钉钉人员表格数据
            tableLoading, // 钉钉人员表格加载状态
            currentTotal, // 钉钉人员表格总数
            selectedRowKeys, // 钉钉人员表格选中行
            condition, // 搜索框内容
        } = this.state;

        const columns = [
            {
                title: '人员名称',
                dataIndex: 'userName',
                key: 'userName',
            },
            {
                title: '人员id',
                dataIndex: 'dingtalkUserId',
                key: 'dingtalkUserId',
            },
        ];

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleSelectedRowKeyChange,
            onSelect: this.handleRowSelected,
            onSelectAll: this.handleAllRowSelected,
        };

        return (
            <div className="modalListContent">
                <div className="modalListCondition">
                    <Input
                        placeholder="请输入查询内容"
                        className="listSearchInput"
                        suffix={
                            condition ? (
                                <Icon
                                    type="close-circle"
                                    onClick={() => this.searchKeyword('')}
                                    className="modalSearchIcon"
                                />
                            ) : (
                                    <Icon type="search" className="modalSearchIcon" />
                                )
                        }
                        onChange={e => this.searchKeyword(e.target.value)}
                        value={condition}
                    />
                </div>
                <Table
                    className="modalTableStyle"
                    columns={columns}
                    dataSource={tableData}
                    loading={tableLoading}
                    rowKey={record => record.id}
                    rowSelection={rowSelection}
                    pagination={{
                        simple: true,
                        total: currentTotal,
                        // showTotal: (total, range) =>
                        //   `显示${range[0]}-${range[1]},共${total}条`,
                        // size: 'small',
                    }}
                    onChange={this.handleTableChange}
                />
                <div className="modalBodyButton">
                    <Button onClick={this.handleClose} className="modalCancelBtn">
                        关闭
                    </Button>
                </div>
            </div>
        );
    }
}
