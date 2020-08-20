import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Row, Col, Form, message } from 'antd';
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
        diggs: []
    }
    keyMap = {
        "Diggings": "矿区",
        "Platform": "平台",
        "BPL": "日常爆破量",
        "ZCL": "转场量",
        "XLL": "下料量",
    }
    filterMap = {
        // "Platform": "平台",
        "BPL": "日常爆破量",
        "ZCL": "转场量",
        "XLL": "下料量",
    }
    columns = [
        {
            key: 'Diggings',
        },
        {
            key: 'Platform',
        },
        {
            key: 'BPL',
        },
        {
            key: 'ZCL',
        },
        {
            key: 'XLL',
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

        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetPlatformByDate",
            params: {
                day: proDate, digg
            },
            cb: (res) => {
                this.staticProDate = res.result.length ? res.result[0].ProDate : '';
                this.setState({
                    data: res.result,
                })
            }
        });
    }

    handleEditSubmit = () => {
        const { data, userInfo, digg } = this.state;
        if (!data.length) return false;
        if (digg !== '官山') {
            scriptUtil.excuteScriptService({
                objName: "PlatformExploitationReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        'update': {
                            XLL: Math.round((data.reduce((val, item) => { val += Number(item.XLL); return val }, 0) * 0.06)) + '',
                            CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                            Creator: userInfo.staffName,
                        },
                        'where': {
                            Diggings: digg,
                            ProDate: this.staticProDate,
                            Platform: '夹石',
                        }
                    })
                },
                cb() { }
            });
            scriptUtil.excuteScriptService({
                objName: "PlatformExploitationReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        'update': {
                            XLL: Math.round((data.reduce((val, item) => { val += Number(item.XLL); return val }, 0) * 0.07)) + '',
                            CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                            Creator: userInfo.staffName,
                        },
                        'where': {
                            Diggings: digg,
                            ProDate: this.staticProDate,
                            Platform: '剥离物',
                        }
                    })
                },
                cb() { }
            });
        }
        const promiseData = data.map(item => new Promise((resolve) => {
            const jsonData = {
                'update': {
                    Platform: item.Platform,
                    BPL: item.BPL,
                    ZCL: item.ZCL,
                    XLL: item.XLL,
                    CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    Creator: userInfo.staffName,
                },
                'where': {
                    id: item.id,
                }
            };
            scriptUtil.excuteScriptService({
                objName: "PlatformExploitationReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: (res) => {
                    resolve(res.result)
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('保存成功');
        })
    }
    render() {
        const { proDate, digg, data, diggs } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        this.columns = this.handleColumns(this.columns);
        return (
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
                <div
                    style={submitButton}
                    onClick={this.handleEditSubmit}
                >保存</div>
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

