
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
const millCount = 4;
const typeCount = 4;
class EditableCell extends React.Component {

    state = {
        editing: false,
    };

    toggleEdit = (record, id) => {
        if (record.block) return false;
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
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
                            message: '请输入合法数字，最多保留三位小数！',
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
        team: '早班', //班组
        stats: null
    }
    keyMap = {
        "material": "品种",
        "pile": " 装船机",
        "quantity": "每天装船量",
        "proDate": "统计日期",
        "createTime": "创建时间",
        "staffName": "提交人",
    }
    columns = [
        {
            key: 'pile',
        },
        {
            key: 'material',
        },
        {
            key: 'quantity',
        },
        {
            key: 'proDate',
        },
        // {
        //     key: 'createTime',
        // },
        // {
        //     key: 'staffName',
        // },
    ];
    dealColumns = (columns) => {
        return columns.map(el => {
            let item = el;
            if (item.children) {
                item.children = this.dealColumns(item.children);
            }
            if (!item.children) {
                item = {
                    ...item,
                    width: 120,
                    title: this.keyMap[item.key],
                    dataIndex: item.key,
                    editable: item.key === 'quantity',
                    // title: () => (<p style={{ textAlign: 'center', fontSize: '14px', width: '100%' }}>{this.keyMap[item.key]}</p>),
                    render: (text, row, index) => {
                        const obj = {
                            children: <p style={{ textAlign: 'center', fontSize: '14px', minHeight: '20px', padding: 0, margin: 0 }}>{text}</p>,
                            props: {},
                        }
                        if (item.key === 'pile') {
                            const { data } = this.state;
                            const indexBypile = data.filter(item => item.pile === text);
                            if (row.id === indexBypile[0].id) {
                                obj.props.rowSpan = indexBypile.length
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
        newData = this.rowMount(newData.slice(0, millCount * typeCount));
        this.setState({ data: newData });
    };
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
                    }
                    this.setState({ ...temp });
                }
            });
        });
        this.fetchData()
    }

    datePickChange = (date, dateString) => {
        console.log(dateString);
        this.setState({ proDate: dateString });
    }
    teamChange = (team) => {
        this.setState({ team });
    }

    rowMount = (data) => {
        return data.concat(_.uniq(data.map(item => item.material)).map((item, index) => {
            return Object.keys({ "quantity": "每天装船量", AMOUNT: '合计' }).reduce((obj, key) => {
                obj[key] = data.reduce((m, cur) => {
                    if (item === cur.material) {
                        return _.add(Number(m) * 1000, Number(cur[key]) * 1000) / 1000
                    }
                    return m
                }, 0)
                return obj;
            }, { pile: '合计', material: item, block: true, id: data.length + index })
        }))
    }
    fetchData = () => {
        let { proDate } = this.state;
        if (!proDate) {
            message.warn('请选择查询日期');
            return false;
        } else {
            proDate = proDate.split('-').map(item => Number(item)).join('-');
        }
        const handleData = (data) => {
            if (Array.isArray(data)) {
                let newData = data.map((item, index) => {
                    return {
                        ...item,
                        quantity: Number(item.quantity),
                        id: index,
                    }
                })
                // 处理末项合计数据
                newData = this.rowMount(newData);
                return newData;
            }
            return []
        }
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "getCementDailyShipment",
            params: {
                proDate
            },
            cb: (res) => {

                this.setState({
                    data: handleData(res.result.result),
                    stats: Boolean(res.result.stats)
                })
            }
        });
    }
    handleCreateSubmit = () => {
        let { data } = this.state;
        data = data.slice(0, 16).map(item => ({ ...item, createDate: moment().format('YYYY-MM-DD HH:mm:ss'), staffName: this.state.staffName }))
        scriptUtil.excuteScriptService({
            objName: "cementDailyShipment",
            serviceName: "AddDataTableEntries",
            params: {
                params: JSON.stringify({ list: data })
                // params: JSON.stringify({ list: data.slice(0, data.length - 3) })
            },
            cb: (res) => {
                message.success('操作成功');
                this.setState({
                    stats: true
                })
                return res.result;
            }
        });

    }
    handleEditSubmit = () => {
        const { data } = this.state;
        const promiseData = data.slice(0, 16).map(item => new Promise((resolve) => {
            const inputs = {
                update: {
                    quantity: item.quantity,
                    createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    staffName: this.state.staffName
                },
                where: {
                    material: item.material,
                    pile: item.pile,
                    proDate: item.proDate
                }
            };
            scriptUtil.excuteScriptService({
                objName: "cementDailyShipment",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(inputs),
                },
                cb: (res) => {
                    resolve(res.result)
                    return res.result;
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('操作成功');
            // this.handleCreateSubmit();
        })
    }
    outputExcel = () => {
        let { data } = this.state;
        data = data.map(item => ({
            "material": item.material,
            "pile": item.pile,
            "quantity": item.quantity,
            "proDate": item.proDate,
            // "createTime": item.createTime,
            // "staffName": item.staffName,
            // AMOUNT: item.AMOUNT
        }))
        const fileName = '装船机发运报表';
        const dataTitle = ["品种", " 装船机", "每天装船量", "统计日期",];

        scriptUtil.JSONToExcelConvertor({ data, fileName, dataTitle })
    }
    render() {
        const { proDate, team, stats, data } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        this.columns = this.dealColumns(this.columns);
        return (
            <div style={containerWrapper}>
                <h1 style={tableTitle}>装船机发运报表</h1>
                <div style={serchHeader}>
                    <div style={serchHeaderLeft}>
                        <div style={serchHeaderItem}>
                            <label>日期：</label>
                            <DatePicker
                                style={datePickerStyle}
                                onChange={this.datePickChange}
                                defaultValue={moment(proDate)}
                                suffixIcon={() => null}
                            >
                            </DatePicker>
                        </div>

                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.fetchData}>获取</Button>
                        </div>
                    </div>
                    <div style={serchHeaderRight}>
                        {
                            stats === null ? null : (
                                <div style={serchHeaderItem}>
                                    <Button
                                        type="primary"
                                        onClick={stats ? this.handleEditSubmit : this.handleCreateSubmit}
                                    >
                                        {stats ? '修订' : '生成'}
                                    </Button>
                                </div>
                            )
                        }

                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.outputExcel}>导出</Button>
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