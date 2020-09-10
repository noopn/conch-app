import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Row, Col, Form, message, Spin } from 'antd';
import moment from 'moment';
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
#appPreviewWrapper .ant-spin-container {
    overflow: visible !important;
}
`;
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
                            pattern: /^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/,
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
class CustomComp extends Component {
    element = React.createRef()
    state = {
        data: [],
        proDate: moment().format(dateFormat),
        digg: '',
        userInfo: {},
        submiting: false,
        diggs: [],
        visable: false,
        message: ''
    }
    keyMap = {
        "Diggings": "矿区",
        // "Platform": "平台",
        "Item": "项目",
        "Consumption": "原料消耗量",

    }
    filterMap = {
        // "Platform": "平台",
        // "Item": "项目",
        "Consumption": "原料消耗量",
    }
    columns = [
        {
            key: 'Diggings',
        },
        // {
        //     key: 'Platform',
        // },
        {
            key: 'Item',
        },
        {
            key: 'Consumption',
        }
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
                    width: `${100 / 15}%`,
                    title: this.keyMap[item.key],
                    dataIndex: item.key,
                    editable: !!this.filterMap[item.key] && item.block !== true,
                    render: (text, row, index) => {
                        const obj = {
                            children: <p style={{ textAlign: 'center', fontSize: '14px', height: '44px', lineHeight: '44px', padding: 0, margin: 0 }}>{text}</p>,
                            props: {},
                        }
                        if (item.key === 'Diggings') {
                            const { data } = this.state;
                            const indexByDiggings = data.filter(item => item.Diggings === text);
                            if (row.id === indexByDiggings[0].id) {
                                obj.props.rowSpan = indexByDiggings.length
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
    componentDidMount() {
        document.getElementById('runtimePage') && (document.getElementById('runtimePage').children[0].style.display = 'none')
        this.fetchDigg()
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
    fetchDigg = () => {
        return new Promise(resolve => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "Getdiggings",
                params: {},
                cb: (res) => {
                    this.setState({
                        diggs: res.result.list,
                        digg: res.result.list[0].optionText
                    }, () => {
                        resolve(res);
                    })
                }
            });
        })
    }
    fetchData = () => {
        let { proDate, digg } = this.state;
        this.setState({
            visable: true,
            message: '加载中。。。',
        })
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetPlatformByDate1",
            params: {
                day: proDate, digg
            },
            cb: (res) => {
                this.staticProDate = res.result.length ? res.result[0].ProDate : '';
                this.setState({
                    data: res.result.list,
                    visable: false,
                    message: ''
                })
            }
        });
    }

    handleEditSubmit = () => {
        const { data } = this.state;
        if (!data.length) return false;
        this.setState({
            visable: true,
            message: '保存中。。。',
        })
        const promiseData = data.map(item => new Promise((resolve, reject) => {
            var val = item.Consumption;
            if (item.Item === '领取柴油(吨)') {
                val = (val * 1000 / 0.84).toFixed(2);
            }
            const jsonData = {
                'update': {
                    Consumption: val,
                    Createtime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    Creator: this.state.staffName,
                },
                'where': {
                    id: item.id,
                }
            };
            scriptUtil.excuteScriptService({
                objName: "PlatformConsumptionReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: (res) => {
                    if (res.result == 1) {
                        resolve(true)
                    } else {
                        reject(false);
                    }
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            this.setState({
                visable: false,
                message: '',
            })
            const jsonData = {
                'update': {
                    Confirm_flag:1
                },
                'where': {
                    prodate: this.state.proDate,
                    team:'天',
                    Content:this.state.digg,
                    type:'原料消耗'
                }
            };
            message.success('保存成功');
            // 更新保存状态
            scriptUtil.excuteScriptService({
                objName: "ConfirmationInfo",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: ()=>{}
            });
        }).catch(err => {
            this.setState({
                visable: false,
                message: '',
            })
            message.error('保存失败');
        })
    }
    render() {
        const { proDate, digg, data, diggs, visable, message } = this.state;
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
                                    onChange={(D, dateString) => this.onSerchKeyChange('proDate', dateString)}
                                    defaultValue={moment(proDate)}
                                    suffixIcon={() => null}
                                >
                                </DatePicker>
                            </Col>
                            <Col span={5} style={borderTopRight}>
                                <label style={headerLabel}>矿区：</label>
                            </Col>
                            <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
                                <div ref={this.select}>
                                    <Select
                                        style={selectStyle}
                                        value={digg}
                                        onChange={(value, e) => this.onSerchKeyChange('digg', value)}
                                    >
                                        {
                                            diggs.map(item => (
                                                <Select.Option value={item.optionText}>{item.optionText}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </div>
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
                    </div>
                    <Button
                        style={submitButton}
                        onClick={(e) => {
                            this.handleEditSubmit()
                        }}
                    >保存</Button>
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
// 搜索栏
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