import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Row, Col, Form, message } from 'antd';
const { MonthPicker } = DatePicker;
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
        console.log(id);
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
const dateFormat = 'YYYY-MM';
class CustomComp extends Component {
    element = React.createRef()
    state = {
        data: [],
        month: moment().format(dateFormat),
        type: '',
        userInfo: {},
        types: []
    }
    keyMap = {
        "type": "类别",
        "item": "项目",
        "Monthplan": "月计划",
        //"month": "月份",
        "Monthstore": "月初库存",
    }
    filterMap = {
        "Monthplan": "月计划",
        "Monthstore": "月初库存",
        "month": "月份",
    }
    columns = [
        {
            key: 'type',
        },
        {
            key: 'item',
        },
        {
            key: 'Monthplan',
        },
        // {
        //     key: 'month',
        // },
        {
            key: 'Monthstore',
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
                        console.log(text, row, index)
                        const obj = {
                            children: <p style={{ textAlign: 'center', fontSize: '18px', height: '46px', lineHeight: '46px', padding: 0, margin: 0 }}>{text}</p>,
                            props: {},
                        }
                        if (item.key === 'type') {
                            const { data } = this.state;
                            const indexBytype = data.filter(item => item.type === text);
                            if (row.id === indexBytype[0].id) {
                                obj.props.rowSpan = indexBytype.length
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
        this.fetchtype()
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
        const loginMsg = JSON.parse(localStorage.getItem('loginMsg'));
        scriptUtil.excuteScriptService({
            objName: "ZLGL",
            serviceName: "getUsersSessionInfo",
            params: {
                username: loginMsg.username
            },
            cb: (res) => {
                // console.log(res);
                this.setState({
                    userInfo: res.result.userInfo
                })
            }
        })
    }

    onSerchKeyChange = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this.fetchData();
        })
    }
    fetchtype = () => {
        return new Promise(resolve => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "Gettypelist",
                params: {},
                cb: (res) => {
                    this.setState({
                        types: res.result.list,
                        type: res.result.list[0].optionText
                    }, () => {
                        resolve(res);
                    })
                }
            });
        })
    }
    fetchData = () => {
        let { month, type } = this.state;

        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetTypeYardByDate",
            params: {
                month: month, type
            },
            cb: (res) => {
                this.staticmonth = res.result.length ? res.result[0].month : '';
                this.setState({
                    data: res.result,
                })
            }
        });
    }

    handleEditSubmit = () => {
        const { data, userInfo, type } = this.state;
        if (!data.length) return false;
        const promiseData = data.map(item => new Promise((resolve) => {
            const jsonData = {
                'update': {
                    Monthplan: item.Monthplan,
                    Monthstore: item.Monthstore,
                },
                'where': {
                    id: item.id,
                }
            };
            scriptUtil.excuteScriptService({
                objName: "YardMonthReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: (res) => {
                    if (res && (res.result == data.length)) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('保存成功');
        })
    }
    outputExcel = () => {
        let { data } = this.state;
        data = data.map(item => ({
            type: item.type,
            Monthplan: item.Monthplan,
            Monthstore: item.Monthstore,
        }))
        const fileName = '生产报告';
        const dataTitle = ['类型', '项目', '月计划', '月初库存'];

        scriptUtil.JSONToExcelConvertor({ data, fileName, dataTitle })
    }
    render() {
        const { month, type, data, types } = this.state;
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
                            <label style={headerLabel}>月份：</label>
                        </Col>
                        <Col span={7} style={borderTopRight}>
                            <MonthPicker
                                onChange={(D, dateString) => this.onSerchKeyChange('month', dateString)}
                                defaultValue={moment(month)}
                                suffixIcon={() => null}
                            >
                            </MonthPicker >

                        </Col>
                        <Col span={5} style={borderTopRight}>
                            <label style={headerLabel}>类型：</label>
                        </Col>
                        <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
                            <div ref={this.select}>
                                <Select
                                    style={selectStyle}
                                    value={type}
                                    onChange={(value, e) => this.onSerchKeyChange('type', value)}
                                >
                                    {
                                        types.map(item => (
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