import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Popconfirm, Form, message } from 'antd';
import moment from 'moment';
var css = document.createElement('style');
css.type = 'text/css';
css.id = 'CustomCompStyle';
css.innerHTML = `
.ant-table .ant-table-tbody > tr > td { 
    white-space: nowrap;
    border-bottom: 1px solid #e8e8e8;
    padding: 0px;
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
const dateFormat = 'YYYY-MM-DD';
class CustomComp extends Component {
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
                        console.log(text, row, index)
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
        this.fetchDigg();
        this.fetchData();
        this.getUsersSessionInfo();
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
        })
    }
    fetchDigg = () => {
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "Getdiggings",
            params: {},
            cb: (res) => {
                this.setState({
                    diggs: res.result.list,
                    digg: res.result.list[0].optionText
                })
            }
        });
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
    outputExcel = () => {
        let { data } = this.state;
        data = data.map(item => ({
            Diggings: item.Diggings,
            Platform: item.Platform,
            BPL: item.BPL,
            ZCL: item.ZCL,
            XLL: item.XLL
        }))
        const fileName = '生产报告';
        const dataTitle = ['矿区', '平台', '日常爆破量', '转场量', '下料量'];

        scriptUtil.JSONToExcelConvertor({ data, fileName, dataTitle })
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
            <div style={containerWrapper}>
                <h1 style={tableTitle}></h1>
                <div style={serchHeader}>
                    <div style={serchHeaderLeft}>
                        <div style={serchHeaderItem}>
                            <label>日期：</label>
                            <DatePicker
                                style={datePickerStyle}
                                onChange={(D, dateString) => this.onSerchKeyChange('proDate', dateString)}
                                defaultValue={moment(proDate)}
                                suffixIcon={() => null}
                            >
                            </DatePicker>
                        </div>
                        <div style={serchHeaderItem}>
                            <label>矿区：</label>
                            <Select
                                style={selectStyle}
                                value={digg}
                                onChange={(value) => this.onSerchKeyChange('digg', value)}
                            >
                                {
                                    diggs.map(item => (
                                        <Select.Option value={item.optionText}>{item.optionText}</Select.Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.fetchData}
                                style={{ background: '#f05c42', border: 'none' }}
                            >获取</Button>
                        </div>
                        <div style={serchHeaderItem}>
                            <Button
                                type="primary"
                                onClick={this.handleEditSubmit}
                                style={{ background: '#15a1a3', border: 'none' }}
                            >
                                保存
                            </Button>
                        </div>
                        <div style={serchHeaderItem}>
                            <Button
                                type="primary" onClick={this.outputExcel}
                                style={{ background: '#15a1a3', border: 'none' }}
                            >导出</Button>
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
                        scroll={{ x: 'max-content', y: '100vh' }}
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