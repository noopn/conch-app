
import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Spin, Form, message, Row, Col } from 'antd';
import moment from 'moment';
var css = document.createElement('style');
css.type = 'text/css';
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
const EditableContext = React.createContext();

const Factory = '制造二';
const Type = '煤磨';

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
    toggleEdit = (record, id, dataIndex, e) => {
        e && e.stopPropagation();
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
                if (dataIndex === 'OutPut') {
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
                {form.getFieldDecorator(`${dataIndex}-${record.id}`, {
                    rules: [
                        {
                            pattern: /^(-|[1-9])\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/,
                            message: '数字不合法',
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input
                    type='input'
                    ref={node => (this.input = node)}
                    onPressEnter={() => this.save(`${dataIndex}-${record.id}`)}
                    onBlur={() => this.save(`${dataIndex}-${record.id}`)}
                    style={{ textAlign: "center" }} />
                )}
            </Form.Item>
        ) : (
                <div
                    onClick={(e) => this.toggleEdit(record, `${dataIndex}-${record.id}`, dataIndex, e)}
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
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            proDate: moment().format(dateFormat),
            team: "", // 班组
            buttonType: null,
            typeData: [],
            crusher: [],
            currentCrusher: '',
            submiting: false,
            submitType: 'insert',
            message: '',
            runTime: '',
            remark: ''
        };
        this.element = React.createRef()
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
            title: '设备',
            key: 'DeviceName',
            align: 'center',
            dataIndex: 'DeviceName',
            render: (text, row,) => {
                const obj = {
                    children: text,
                    props: {},
                }
                const { data } = this.state;
                const lime = data.filter(item => item.DeviceName === row.DeviceName);

                if (row.id === lime[0].id) {
                    obj.props.rowSpan = lime.length
                } else {
                    obj.props.rowSpan = 0
                }
                return obj
            },
        },
        {
            title: '原材料',
            key: 'Raw',
            align: 'center',
            dataIndex: 'Raw',
        },
        {
            title: '消耗量（吨）',
            key: 'OutPut',
            align: 'center',
            dataIndex: 'OutPut',
            render: text => <p style={{ textAlign: 'center', fontSize: '14px', height: '32px', lineHeight: '32px', padding: 0, margin: 0 }}>{text}</p>,
            onCell: record => ({
                record,
                editable: true,
                dataIndex: 'OutPut',
                title: '产量',
                handleSave: this.handleSave,
            })
        }
    ];
    handleSave = row => {
        let newData = [...this.state.data];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: this.rowMount(newData.slice(0, -1)) });
    };
    componentWillMount() {
        this.setState({
            team: this.teamOption[0].key
        })
    }
    componentDidMount() {
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
        new Promise((resolve) => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "GetDevice",
                params: { Factory, Type },
                cb: (res) => {
                    this.setState({
                        crusher: res.result.list,
                        currentCrusher: res.result.list[0].optionValue
                    })
                    resolve()
                }
            });
        }).then(() => {
            this.fetchData();
        })
        if (this.element && this.element.current) {
            ["touchstart", "touchmove", "touchend"].forEach((event) => {
                this.element.current.addEventListener(event, (e) => {
                    e.stopPropagation();
                });
            })
        }

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
            this.fetchData();
        })
    }


    rowMount = (data) => {
        if (!data.length) return [];
        const mount = data.reduce((mount, item) => {
            if(item.Raw==='甲仓'||item.Raw==='乙仓'){mount+= Number(item.OutPut)}
            return mount
        }, 0)
        return data.concat({ Raw: '产量', block: true, OutPut: (mount*0.9).toFixed(2) })
    }

    getRunTime = () => {
        let { proDate, team, currentCrusher } = this.state;

        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetDeviceRunningTime",
            params: {
                prodate: proDate,
                DeviceId: currentCrusher,
                team
            },
            cb: (res) => {
                this.setState({
                    runTime: res.result
                })
            }
        })
    }

    fetchData = () => {
        let { proDate, team, currentCrusher } = this.state;
        // proDate = proDate.split('-').map(item => Number(item)).join('-');
        if (team === 'null' || proDate === '') {
            message.warn('请检查查询参数,或切换查询日期');
            return false;
        }
        this.setState({
            visable: true,
            message: '加载中。。。',
        })
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetDeviceReport",
            params: {
                ProDate: proDate,
                Device: currentCrusher,
                // Team: team,
            },
            cb: (res) => {
                if (res.result.list.length === 0) {
                    this.getRunTime();
                    scriptUtil.excuteScriptService({
                        objName: "SCGL",
                        serviceName: "GetProduceOutPut",
                        params: {
                            day: proDate,
                            Deviceid: currentCrusher,
                            // Team: team,
                        },
                        cb: (res) => {
                            this.setState({
                                submitType: 'insert',
                                data: this.rowMount(res.result.list),
                                remark: ''
                            })
                        }
                    });
                } else {
                    if (!res || !res.result || !res.result.list[0]) return false;
                    const item = res.result.list[0];
                    this.setState({
                        submitType :'update',
                        data: this.rowMount(res.result.list),
                        remark: res.result.list[0].Remark,
                        runTime: res.result.list[0].RunningTime,
                        visable: false,
                        message: ''
                    })
                }
                this.setState({
                    visable: false,
                    message: '',
                })
            }
        });
    }
    handleSaveSubmit = () => {
        let { data,currentCrusher,proDate } = this.state;
        return new Promise((resolve,reject)=>{
            scriptUtil.excuteScriptService({
                objName: 'DeviceReport',
                serviceName: 'AddDataTableEntries',
                params: {
                    params: JSON.stringify({
                        list: data.slice(0, -1).map(item => ({
                            DeviceId: this.state.currentCrusher,
                            team: this.state.team,
                            ProDate: this.state.proDate,
                            RunningTime: Number(this.state.runTime),
                            Remark: this.state.remark,
                            Creator: this.state.staffName,
                            CreatTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            Raw: item.Raw,
                            Expent: Number(item.OutPut)
                        }))
                    })
                },
                cb: (res) => {
                    if (!res.result || res.result !== (data.length - 1)) {
                        message.error('保存失败');
                        this.setState({
                            submitType: 'insert',
                            visable: false,
                            message: ''
                        })
                    } else {
                        message.success('保存成功');
                        // 保存成功重新拉取新表中的数据,因为id发生变化，再次操作在新表中操作
                        scriptUtil.excuteScriptService({
                            objName: "SCGL",
                            serviceName: "GetDeviceReport",
                            params: {
                                ProDate: proDate,
                                Device: currentCrusher,
                                // Team: team,
                            },
                            cb: (res) => {
                                if (!res || !res.result || !res.result.list[0]) return false;
                                const item = res.result.list[0];
                                this.setState({
                                    data: this.rowMount(res.result.list),
                                    remark: item.Remark,
                                    runTime: item.RunningTime,
                                    submitType: 'update',
                                    visable: false,
                                    message: ''
                                })
                            }
                        });
                    }
                    resolve(res.result)
                }
            });
        })

    }
    handleEditSubmit = () => {
        const { data } = this.state;
        this.setState({
            submiting: true
        })
        const promiseData = data.slice(0, -1).map(item => new Promise((resolve) => {
            const jsonData = {
                update: {
                    Expent: Number(item.OutPut),
                },
                where: {
                    id: item.id
                }
            };
            scriptUtil.excuteScriptService({
                objName: "DeviceReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: (res) => {
                    if (res && res.result == 1) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }
            });
        })).concat(new Promise(resolve => {
            scriptUtil.excuteScriptService({
                objName: "DeviceReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        update: {
                            Remark: this.state.remark,
                            RunningTime: Number(this.state.runTime),
                        },
                        where: {
                            DeviceId: this.state.currentCrusher,
                            ProDate: this.state.proDate,
                            team: this.state.team,
                        }
                    })
                },
                cb: (res) => {
                    if (res && (res.result == (data.length - 1))) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('修改成功')
        }).catch(() => {
            message.error('修改失败')
        }).then(() => {
            this.setState({
                visable: false,
                message: '',
            })
        })
    }
    remarkChange = (e) => {
        this.setState({
            remark: e.target.value
        })
    }
    disabledDate = (current) => current && current > moment().endOf('day');
    submit = () => {
        const { proDate, team, currentCrusher } = this.state;
        new Promise((resolve, reject) => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "GetDeviceReport",
                params: {
                    ProDate: proDate,
                    Device: currentCrusher,
                    // Team: team,
                },
                cb: (res) => {
                    if (!res.result) {
                        reject(false)
                    } else {
                        resolve(res.result);
                    }
                }
            });
        }).then(res => {
            if (res.list && res.list.length === 0) {
                this.setState({
                    message: '保存中。。。',
                })
                return this.handleSaveSubmit()
            } else {
                this.setState({
                    message: '修改中。。。',
                })
                return this.handleEditSubmit()
            }
        }).then(() => {
            // 更新保存状态
            const jsonData = {
                'update': {
                    Confirm_flag: 1
                },
                'where': {
                    prodate: this.state.proDate,
                    // team: '',
                    Content: this.state.currentCrusher,
                    type: '煤磨'
                }
            };
            scriptUtil.excuteScriptService({
                objName: "ConfirmationInfo",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: () => { }
            });
        })
    }
    render() {
        const { proDate, team, data, currentCrusher, runTime, remark,message, visable, submitType } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
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
                                    disabledDate={this.disabledDate}
                                    style={datePickerStyle}
                                    onChange={(D, dateString) => this.onSerchKeyChange('proDate', dateString)}
                                    defaultValue={moment(proDate)}
                                    suffixIcon={() => null}
                                >
                                </DatePicker>
                            </Col>
                            <Col span={5} style={borderTopRight}>
                                {/* <label style={headerLabel}>班组：</label> */}
                            </Col>
                            <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
                                {/* <Select
                                    style={selectStyle}
                                    value={team}
                                    onChange={(value) => this.onSerchKeyChange('team', value)}
                                >
                                    {this.teamOption.map(item => <Select.Option value={item.key}>{item.value}</Select.Option>)}
                                </Select> */}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} style={borderTopRight}>
                                <label style={headerLabel}>设备：</label>
                            </Col>
                            <Col span={7} style={borderTopRight}>
                                <Select
                                    style={selectStyle}
                                    value={currentCrusher}
                                    onChange={(value) => this.onSerchKeyChange('currentCrusher', value)}
                                >
                                    {this.state.crusher.map(item => <Select.Option value={item.optionValue}>{item.optionText}</Select.Option>)}
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
                    <Button
                        style={submitButton}
                        onClick={this.submit}
                    >{submitType === 'insert' ? '保存' : '修改'}</Button>
                </div >
            </Spin>
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
    marginTop: '10px'
}

const serchHeaderItem = {
    margin: '0 10px'
}
// 日历控件样式
const datePickerStyle = {
    width: '100%'
}
// 下拉框样式
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