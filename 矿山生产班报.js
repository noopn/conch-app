import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Popconfirm, Form, message } from 'antd';
import moment from 'moment';
var css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `
    .ant-table .ant-table-tbody > tr > td { 
        white-space: nowrap;
        border-bottom: 1px solid #e8e8e8;
        padding: 4px;
    } 
    .ant-table-thead > tr > th {
        text-align: center;
    }`;
document.getElementsByTagName('head')[0].appendChild(css);
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    state = {
        editing: false,
    };
    toggleEdit = (record, id, dataIndex) => {
        if (record.block) return false;
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                // ht的mousedown事件会触发react的onblur事件 需要阻止事件冒泡
                if (id) {
                    console.log(id);
                    document.querySelector(`#${id}`).addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                    }, false)
                }
                if (dataIndex === 'value') {
                    this.input.focus();
                }
                if (dataIndex === 'type') {
                    this.select.focus();
                }
            }
        });
    };

    save = (id) => {
        const { record, handleSave, dataIndex } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit(record, null, dataIndex);
            handleSave({ ...record, [id.split('-')[0]]: values[id] });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title, typeData } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {dataIndex === 'value' &&
                    form.getFieldDecorator(`${dataIndex}-${record.id}`, {
                        rules: [
                            {
                                pattern: /^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/,
                                message: '数字不合法',
                            },
                        ],
                        initialValue: record[dataIndex],
                    })(<Input
                        ref={node => (this.input = node)}
                        onPressEnter={() => this.save(`${dataIndex}-${record.id}`)}
                        onBlur={() => this.save(`${dataIndex}-${record.id}`)}
                        style={{ textAlign: "center" }} />
                    )}
                {dataIndex === 'type' && record.name === "堆A" &&
                    form.getFieldDecorator(`${dataIndex}-${record.id}`, {
                        rules: [
                            {
                                required: true,
                                message: '请选择类型',
                            },
                        ],
                        initialValue: record[dataIndex],
                    })(<Select
                        style={{ width: '100%' }}
                        ref={node => this.select = node}
                        onBlur={() => this.save(`${dataIndex}-${record.id}`)}
                    >
                        {
                            typeData.map(item => <Select.Option value={item.value}>{item.name}</Select.Option>)
                        }
                    </Select>
                    )}
            </Form.Item>
        ) : (
                <div
                    onClick={() => this.toggleEdit(record, `${dataIndex}-${record.id}`, dataIndex)}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}
const dateFormat = 'YYYY-MM-DD';
class CustomComp extends Component {
    state = {
        data: [],
        proDate: moment().format(dateFormat),
        team: '', //班组
        buttonType: null,
        typeData: [],
    }

    get teamOption() {
        const arr = [];
        if (moment(`${this.state.proDate} 08:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf() <= moment().valueOf()) {
            arr.push({ key: '夜班', value: '夜班' })
        }
        if (moment(`${this.state.proDate} 16:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf() <= moment().valueOf()) {
            arr.push({ key: '白班', value: '白班' })
        }
        if (moment(this.state.proDate, 'YYYY-MM-DD').endOf('day').valueOf() <= moment().valueOf()) {
            arr.push({ key: '中班', value: '中班' })
        }
        if (!arr.length) {
            arr.push({ key: 'null', value: '暂无班组查询' })
        }
        return arr;
    }
    columns = [
        {
            title: '名称',
            width: '20%',
            key: 'limeName',
            align: 'center',
            dataIndex: 'limeName',
            render: (text, row, ) => {
                const obj = {
                    children: text,
                    props: {},
                }
                const { data } = this.state;
                const lime = data.filter(item => item.groupType === row.groupType);
                if (row.id === lime[0].id) {
                    obj.props.rowSpan = lime.length
                } else {
                    obj.props.rowSpan = 0
                }
                return obj
            },
        },
        {
            title: '堆',
            width: '16%',
            key: 'name',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '类型',
            width: '16%',
            key: 'type',
            align: 'center',
            dataIndex: 'type',
            onCell: record => ({
                record,
                editable: record.name === '堆A',
                dataIndex: 'type',
                title: '类型',
                typeData: this.state.typeData,
                handleSave: this.handleSave,
            })
        },
        {
            title: '产量',
            width: '16%',
            key: 'value',
            align: 'center',
            dataIndex: 'value',
            onCell: record => ({
                record,
                editable: true,
                dataIndex: 'value',
                title: '产量',
                handleSave: this.handleSave,
            })
        },
        {
            title: '单位',
            width: '16%',
            key: 'unit',
            align: 'center',
            dataIndex: 'unit',
        },
        {
            title: '合计',
            width: '16%',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            render: (text, row, ) => {
                const obj = {
                    props: {},
                }
                const { data } = this.state;
                const lime = data.filter(item => item.groupType === row.groupType);
                obj.children = (Number(lime[0].value) + Number(lime[1].value)).toFixed(2);
                if (row.id === lime[0].id) {
                    obj.props.rowSpan = lime.length
                } else {
                    obj.props.rowSpan = 0
                }
                return obj
            },
        },
    ];
    handleColumns = (columns) => {
        return columns.map(el => {
            let item = el;
            if (item.children) {
                item.children = this.handleColumns(item.children);
            }
            if (!item.children) {
                item = {
                    ...item,
                    width: 120,
                    title: this.keyMap[item.key],
                    dataIndex: item.key,
                    editable: !!this.filterMap[item.key] && item.block !== true,
                    render: (text, row, index) => {
                        const obj = {
                            children: <p style={{ textAlign: 'center', fontSize: '14px', minHeight: '20px', padding: 0, margin: 0 }}>{text}</p>,
                            props: {},
                        }
                        if (item.key === 'mill') {
                            const { data } = this.state;
                            const indexBymill = data.filter(item => item.mill === text);
                            if (row.id === indexBymill[0].id) {
                                obj.props.rowSpan = indexBymill.length
                            } else {
                                obj.props.rowSpan = 0
                            }
                        }
                        return obj
                    },
                    onCell: record => ({
                        record,
                        editable: item.editable,
                        dataIndex: item.dataIndex,
                        title: item.title,
                        handleSave: this.handleSave,
                    })
                }
            }
            return item;
        })
    }
    handleSave = row => {
        let newData = [...this.state.data];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: newData });
    };
    componentWillMount() {
        this.setState({
            team: this.teamOption[0].key
        })
    }
    componentDidMount() {
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetMineStockType",
            cb: (res) => {
                this.setState({
                    typeData: Object.keys(res.result).map(key => res.result[key])
                })
            }
        });
        this.fetchData();
    }
    onSerchKeyChange = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            if (key === 'proDate') {
                this.setState({
                    team: this.teamOption[0].key
                })
            }
        })
    }

    obj2ArrByMill = (data) => {
        return data.reduce((arr, item, index) =>
            arr.concat(
                [{ ...item[0], groupType: index, type: '石灰石' },
                { ...item[1], groupType: index, type: '石灰石' }]),
            [])
            .map((item, index) => ({
                ...item,
                id: index + 1,
                unit: '吨'
            }));
    }

    fetchData = () => {
        let { proDate, team } = this.state;
        // proDate = proDate.split('-').map(item => Number(item)).join('-');
        scriptUtil.getUserInfo(user => {
            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getUsersSessionInfo",
                params: { "username": user.userInfo.username },
                cb: (res) => {
                    const temp = {
                        staffName: res.result.userInfo.staffName, // 分析人
                        staffCode: res.result.userInfo.staffCode, // 分析人id
                        scDate: moment().clone().add(-2, 'days').format('YYYY-MM-DD'), // 生产日期
                        fxDate: moment().format('YYYY-MM-DD'), // 分析date
                    }
                    this.setState({ ...temp });
                }
            });
        });
        if (team === 'null' || proDate === '') {
            message.warn('请检查查询参数,或切换查询日期');
            return false;
        }
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "getMineProduceResult",
            params: {
                proDate, team, type: 'Limestone'
            },
            cb: (res) => {
                if (res.code === '200' && !res.result.length) {
                    this.setState({
                        buttonType: true
                    })
                    const promiseArr = [1, 2, 3, 4].map(lime => new Promise((resolve, reject) =>
                        scriptUtil.excuteScriptService({
                            objName: "SCGL",
                            serviceName: "GetLimestoneOfShift",
                            params: {
                                day: proDate, shift: team, lime,
                            },
                            cb: (res) => {
                                resolve(res.result)
                            }
                        })
                    ));
                    Promise.all(promiseArr).then(data => {
                        this.setState({
                            data: this.obj2ArrByMill(data)
                        })
                    })
                } else {
                    this.setState({
                        data: res.result.map((item, index) => ({
                            limeName: item.name,
                            name: item.stack,
                            value: item.output,
                            unit: '吨',
                            objName: item.lime,
                            type: item.type,
                            groupType: item.lime.slice(-1),
                            id: index + 1,
                            proDate: item.proDate,
                            team: item.team,
                        })),
                        buttonType: false
                    })
                }
            }
        });
    }
    handleSaveSubmit = () => {
        let { data } = this.state;
        data = data.map(item => ({ ...item, createDate: moment().format('YYYY-MM-DD HH:mm:ss') }));
        if (data.some(item => !item.type)) {
            message.warn('请填入类型');
            return false;
        }
        scriptUtil.excuteScriptService({
            objName: "MineProduceResult",
            serviceName: "AddDataTableEntries",
            params: {
                params: JSON.stringify({
                    list: data.map(item => ({
                        name: item.limeName,
                        stack: item.name,
                        lime: item.objName,
                        type: item.type,
                        proDate: this.state.proDate,
                        team: this.state.team,
                        output: item.value,
                        user: this.state.staffCode,
                        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
                    }))
                })
            },
            cb: (res) => {
                message.success('操作成功');
                this.setState({
                    buttonType: false
                })
                return res.result;
            }
        });

    }
    handleEditSubmit = () => {
        const { data } = this.state;
        const promiseData = data.map(item => new Promise((resolve) => {
            const inputs = {
                proDate: item.proDate,
                team: item.team,
                lime: item.objName
            };
            scriptUtil.excuteScriptService({
                objName: "MineProduceResult",
                serviceName: "DeleteDataTableEntries",
                params: inputs,
                cb: (res) => {
                    resolve(res.result)
                    return res.result;
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            this.handleSaveSubmit();
        })
    }
    disabledDate = (current) => current && current > moment().endOf('day');
    render() {
        const { proDate, team, buttonType, data } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        return (
            <div style={containerWrapper}>
                <h1 style={tableTitle}></h1>
                <div style={serchHeader}>
                    <div style={serchHeaderLeft}>
                        <div style={serchHeaderItem}>
                            <label>日期：</label>
                            <DatePicker
                                disabledDate={this.disabledDate}
                                style={datePickerStyle}
                                onChange={(D, dateString) => this.onSerchKeyChange('proDate', dateString)}
                                defaultValue={moment(proDate)}
                                suffixIcon={() => null}
                            >
                            </DatePicker>
                        </div>
                        <div style={serchHeaderItem}>
                            <label>班组：</label>
                            <Select
                                style={selectStyle}
                                value={team}
                                onChange={(value) => this.onSerchKeyChange('team', value)}
                            >
                                {this.teamOption.map(item => <Select.Option value={item.key}>{item.value}</Select.Option>)}
                            </Select>
                        </div>
                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.fetchData} style={{ background: '#f05c42', border: 'none' }}>获取</Button>
                        </div>
                    </div>
                    <div style={serchHeaderLeft}>
                        <div style={serchHeaderItem}>
                            <Button
                                type="primary"
                                onClick={buttonType ? this.handleSaveSubmit : this.handleEditSubmit}
                                style={{ background: '#15a1a3', border: 'none' }}
                            >
                                保存
                            </Button>
                        </div>

                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Table
                        style={{ wordBreak: 'break-all' }}
                        components={components}
                        columns={this.columns}
                        dataSource={data}
                        pagination={false}
                        bordered
                        scroll={{ x: 'max-content', y: 'calc(100vh - 213px)' }}
                    />
                </div>
            </div >
        );
    }
}

export default CustomComp;

const containerWrapper = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto'
}
const serchHeaderLeft = {
    float: 'left'
}
const serchHeaderRight = {
    float: 'right'
}
// 表头
const tableTitle = {
    textAlign: 'center',
}
// 搜索栏
const serchHeader = {
    overflow: 'hidden',
}

const serchHeaderItem = {
    display: 'inline-block',
    margin: '0 12px'
}
// 日历控件样式
const datePickerStyle = {

}
// 下拉框样式
const selectStyle = {
    width: '168px'
}