// &&ROOT&&
import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Row, Col, Form, message,Spin } from 'antd';
import moment from 'moment';
// ============================================================================================================================================
// 配置参数

//  columns (必填) 表头字段    editable表示开启编辑功能
const columns = [{
    title: '设备', // 表头中文字段
    key: 'Device' // 对应接口中的字段
}, {
    title: '上一班组发电量', // 表头中文字段
    key: 'beElectric' // 对应接口中的字段
}, {
    title: '当下发电量', // 表头中文字段
    key: 'Electric', // 对应接口中的字段
    editable: true  //开启编辑功能
}, {
    title: '本班次发电量', // 表头中文字段
    key: 'NowElectric', // 对应接口中的字段
    // 如果有这个字段表示这是一个计算属性,计算一行中的某个值
    // 最终的值会变成calc 方法返回的值，而不是接口值
    // 本班次发电量 = 当下发电量-上一班组发电量
    calc(data) {
        // data 表示一行的数据,用于计算
        let val = 0;
        if (data.Device === '余热发电') {
            val = (data['Electric'] - data['beElectric']) * 30000
        }
        if (data.Device === '52H') {
            val = (data['Electric'] - data['beElectric']) * 1800
        }
        if (data.Device === '52B3') {
            val = (data['Electric'] - data['beElectric']) * 600
        }
        if (data.Device === '52B2') {
            val = (data['Electric'] - data['beElectric']) * 600
        }
        if (data.Device === "52B1") {
            val = (data['Electric'] - data['beElectric']) * 600
        }
        return ~~val === val ? String(val) : val.toFixed(3);
    }
}]

// 处理更新时保存的字段
// item 表示数据中的一组，用于声明更新字段
const getUpdateKeys = (item) => {
    return {
        NowElectric: item.NowElectric,
        Electric: item.Electric,
    };
}

// 放在底部的， 需要计算行的配置
const calcRow = [{
    // 表式放在Device 表头下面，显示的字段为（自用合计）
    title: '自用合计',
    key: 'Device',
    // 表示这三个字段的值式需要计算的
    calcKey: ['beElectric', 'Electric', 'NowElectric'],
    // 计算方法 data 表示当前一列所有字段的值用于计算
    calc(data) {
        //自用合计=52H+52B1+52B2+52B3
        var val = Number(data['52H']) + Number(data['52B1']) + Number(data['52B2']) + Number(data['52B3'])
        return ~~val === val ? String(val) : val.toFixed(3);
    } 
}
    //  {
    //     // 表式放在Device 表头下面，显示的字段为 （并网发电）
    //     title: '并网发电',
    //     key: 'Device',
    //     calcKey: ['beElectric', 'NowElectric', 'Electric'],
    //     // 计算方法 data 表示当前一列所有字段的值用于计算
    //     // 并网发电=余热发电-自用合计
    //     calc(data) {
    //         // 依赖上面配置项计算值的结果， 要把依赖的配置项写上面
    //         return Number(data['余热发电']) - Number(data['自用合计']);
    //     }
    // }
]
// ============================================================================================================================================

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

    toggleEdit = (record, id) => {
        if (record.block) return false;
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                // ht的mousedown事件会触发react的onblur事件 需要阻止事件冒泡
                if (id) {
                    document.querySelector(`#${id}`).addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                    }, false)
                }
                this.input.focus();
            }
        });
    };

    save = (id) => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit(record);
            handleSave({ ...record, [id.split('-')[0]]: values[id] });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(`${dataIndex}-${record.id}`, {
                    rules: [
                        {
                            pattern: /^[1-9]\d*(\.\d{1,3})?$|^0+(\.\d{1,3})?$/,
                            message: '数字不合法',
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={() => this.save(`${dataIndex}-${record.id}`)} onBlur={() => this.save(`${dataIndex}-${record.id}`)} style={{ textAlign: "center" }} />)}
            </Form.Item>
        ) : (
                <div
                    onClick={() => this.toggleEdit(record, `${dataIndex}-${record.id}`)}
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
const teamOption = [
    { key: '夜班', value: '夜班' },
    { key: '白班', value: '白班' },
    { key: '中班', value: '中班' }
]
class CustomComp extends Component {
    element = React.createRef()
    state = {
        data: [],
        date: moment().format(dateFormat),
        team: teamOption[0].key,
        unit: '',
        unitList: [],
        runTime: '',
        remark: '',
        currentCrusher: '',
        submitType: 'insert',
        message: '',
        visable:false,
    }
    columns = columns
    handleColumns = (columns) => {
        return columns.map(el => {
            let item = el;
            if (item.children) {
                item.children = this.handleColumns(item.children);
            }
            if (!item.children) {
                item = {
                    ...item,
                    width: `${100 / this.columns.length}%`,
                    dataIndex: item.key,
                    render: (text) => <p style={{ textAlign: 'center', fontSize: '14px', height: '44px', lineHeight: '44px', padding: 0, margin: 0 }}>{text}</p>,
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
        this.setState({ data: this.mergeCalcRow(this.mergeCalcColumn(newData.slice(0, -calcRow.length))) });
    };
    componentDidMount() {
        document.getElementById('runtimePage') && (document.getElementById('runtimePage').children[0].style.display = 'none')
        this.getRunTime();
        this.fetchUnitList()
            .then(() => {
                this.fetchData();
            });
        this.getUsersSessionInfo();
        if (this.element && this.element.current) {
            ["touchstart", "touchmove", "touchend"].forEach((event) => {
                this.element.current.addEventListener(event, (e) => {
                    e.stopPropagation();
                });
            })
        }
    }

    getUsersSessionInfo = () => {
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
    }

    onSerchKeyChange = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this.fetchData();
        })
    }
    remarkChange = (e) => {
        this.setState({
            remark: e.target.value
        })
    }
    fetchUnitList = () => {
        return new Promise(resolve => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "getUnitList",
                params: {},
                cb: (res) => {
                    this.setState({
                        unitList: res.result.list,
                        unit: res.result.list[0].optionValue,
                    }, () => {
                        resolve(res);
                    })
                }
            });
        })
    }
    fetchData = () => {
        let { date, unit, team } = this.state;
        this.setState({
            visable: true,
            message: '加载中。。。',
        })
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetDeviceElectricInfo",
            params: {
                ProDate: date,
                Unit: unit,
                team
            },
            cb: (res) => {
                this.setState({
                    runTime: res.result.list[0].RunningTime,
                    remark: res.result.list[0].Remark,
                    data: this.mergeCalcRow(this.mergeCalcColumn(res.result.list)),
                    visable: false,
                    message: '',
                })
            }
        });
    }
    getRunTime = () => {
        let { date, team, unit } = this.state;

        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetDeviceRunningTime",
            params: {
                date,
                DeviceId: unit,
                team
            },
            cb: (res) => {
                this.setState({
                    runTime: res.result
                })
            }
        })
    }
    mergeCalcColumn = (data) => {
        // 暂时只处理了column配置中计算
        let newData = data;
        this.columns.forEach(item => {
            if (item.calc) {
                newData = newData.map(dataItem => ({ ...dataItem, [item.key]: item.calc(dataItem) }))
            }
        })
        return newData

    }
    mergeCalcRow = (data) => {
        let newData = data;
        calcRow.map(item => {
            const calcKey = item.calcKey;
            const obj = calcKey.reduce((obj, key) => {
                const keyData = newData.reduce((obj, dItem) => {
                    obj[dItem[item.key]] = dItem[key]
                    return obj;
                }, {})
                obj[key] = item.calc(keyData);
                return obj;
            }, {})
            newData = newData.concat({
                [item.key]: item.title,
                block: true,
                ...obj,
            })
        })
        return newData;
    }

    handleEditSubmit = () => {
        const { data } = this.state;
        if (!data.length) return false;
        this.setState({
            visable:true,
            message:'保存中'
        })
        const promiseData = data.slice(0, -calcRow.length).map(item => new Promise((resolve,reject) => {
            scriptUtil.excuteScriptService({
                objName: "DeviceElectricReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        'update': {
                            ...getUpdateKeys(item),
                            Createtime: moment().format("YYYY-MM-DD HH:mm:ss"),
                            Creator: this.state.staffName,
                        },
                        'where': {
                            id: item.id,
                        }
                    })
                },
                cb: (res) => {
                    if(res&&res.result==1){
                        resolve(true);
                    }else{
                        reject(false);
                    }
                }
            });
        })).concat(new Promise(resolve => {
            scriptUtil.excuteScriptService({
                objName: "DeviceElectricReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        update: {
                            Remark: this.state.remark,
                            RunningTime: Number(this.state.runTime),
                        },
                        where: {
                            Unit: this.state.unit,
                            ProDate: this.state.date,
                            team: this.state.team,
                        }
                    })
                },
                cb: (res) => {
                    resolve(res.result)
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('保存成功')
        }).catch(() => {
            message.error('保存失败')
        }).then(() => {
            this.setState({
                visable: false,
                message: '',
            })
        })
    }
    render() {
        const { date, team, data, unit, unitList, runTime, remark,message, visable, submitType  } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        this.columns = this.handleColumns(this.columns);
        return (
            <Spin tip={message} spinning={visable}>
                <div style={containerWrapper} ref={this.element}>
                    <div style={serchHeader}>
                        <Row>
                            <Col span={5} style={borderTopRight}>
                                <label style={headerLabel}>日期：</label>
                            </Col>
                            <Col span={7} style={borderTopRight}>
                                <DatePicker
                                    onChange={(D, dateString) => this.onSerchKeyChange('date', dateString)}
                                    defaultValue={moment(date)}
                                    suffixIcon={() => null}
                                >
                                </DatePicker>
                            </Col>
                            <Col span={5} style={borderTopRight}>
                                <label style={headerLabel}>班组：</label>
                            </Col>
                            <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
                                <div ref={this.select}>
                                    <Select
                                        style={selectStyle}
                                        value={team}
                                        onChange={(value, e) => this.onSerchKeyChange('team', value)}
                                    >
                                        {
                                            teamOption.map(item => (
                                                <Select.Option value={item.value}>{item.value}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} style={borderTopRight}>
                                <label style={headerLabel}>机组：</label>
                            </Col>
                            <Col span={7} style={borderTopRight}>
                                <Select
                                    style={selectStyle}
                                    value={unit}
                                    onChange={(value) => this.onSerchKeyChange('unit', value)}
                                >
                                    {unitList.map(item => <Select.Option value={item.optionValue}>{item.optionText}</Select.Option>)}
                                </Select>
                            </Col>
                            <Col span={5} style={borderTopRight}>
                                <label style={headerLabel}>运行时长：</label>
                            </Col>
                            <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
                                <Input value={runTime} onChange={(e) => this.setState({ runTime: e.target.value })} />
                            </Col>
                        </Row>
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        <Table
                            style={{ wordBreak: 'break-all' }}
                            components={components}
                            columns={this.columns}
                            dataSource={data}
                            pagination={false}
                            bordered
                        />
                        <div style={remarkWrapper}>
                            <label>备注</label>
                            <input style={remarkInput} value={remark} onInput={this.remarkChange} />
                        </div>
                    </div>
                    <Button
                        style={submitButton}
                        onClick={this.handleEditSubmit}
                    >保存</Button>
                </div >
            </Spin>
        );
    }
}
export default CustomComp;

// 组件用到的样式
const containerWrapper = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto'
}

const headerLabel = {
    whiteSpace: 'nowrap'
}
const borderTopRight = {
    borderTop: '1px solid #e8e8e8',
    borderRight: '1px solid #e8e8e8',
    textAlign: 'center',
    lineHeight: '40px'
}
const rightBorderNone = {
    borderRight: 'none'
}
const serchHeader = {
    overflow: 'hidden',
}

const selectStyle = {
    width: '100%'
}
const submitButton = {
    position: 'fixed',
    width: '100%',
    height: '40px',
    left: 0,
    bottom: 0,
    background: '#4579bb',
    color: '#fff',
    lineHeight: '40px',
    textAlign: 'center'
}

const remarkWrapper = {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '44px',
    paddingLeft: '20px',
    borderBottom: '1px solid #e8e8e8'
}

const remarkInput = {
    flex: 1,
    border: 'none',
    marginLeft: '20px',
    /* display: table-cell; */
    width: '200px',
    height: '36px',
    paddingLeft: '20px',
    border: '1px solid #e8e8e8'
}


// 默认css样式
var css = document.createElement('style');
css.type = 'text/css';
css.id = 'CustomCompStyle';
css.innerHTML = `
.ant-table .ant-table-tbody > tr > td { 
    white-space: nowrap;
    border-bottom: 1px solid #e8e8e8;
    padding: 4px;
}
.ant-table-body {
  overflow: hidden;
}

.ant-table-bordered .ant-table-body > table {
  border-left: none;
  border-right: none;
}
.ant-table-thead {
  border-bottom: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
}
.ant-table thead.ant-table-thead > tr > th {
  background: transparent !important;
  color: #444 !important;
  font-weight: bold !important;
}
.ant-table thead.ant-table-thead > tr > th:last-child {
  border: none
}
.ant-table-thead > tr > th {
    text-align: center;
}
.ant-calendar-picker input {
  border:none;
  text-align:center
}
.ant-select-selection {
  border:none
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
#appPreviewWrapper .ant-spin-container {
    overflow: visible !important;
}
`;
document.getElementsByTagName('head')[0].appendChild(css);
