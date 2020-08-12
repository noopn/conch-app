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
                            pattern: /^(-|[1-9])\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/,
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
        team: '白班', //班组
        buttonType: null
    }
    keyMap = {
        "mill": "煤磨",
        "Anthracite": "无烟煤",
        "SoftCoal": "烟煤",
        "StockA": "窑头仓",
        "StockA_1.1": "窑头仓*1.1",
        "StockB": "分解炉仓",
        "StockB_1.1": "分解炉仓*1.1",
        "AMOUNT": "合计",
    }
    filterMap = {
        Anthracite: "无烟煤",
        SoftCoal: "烟煤",
        StockA: "窑头仓",
        StockB: "分解炉仓",
    }

    filterMapCopy = {
        mill: 'mill',
        belt: 'belt',
        proDate: 'day',
        team: 'shift',
        createDate: 'createDate',
    }
    amountMap = {
        "Anthracite": "无烟煤",
        "SoftCoal": "烟煤",
        "StockA": "窑头仓",
        "StockA_1.1": "窑头仓*1.1",
        "StockB": "分解炉仓",
        "StockB_1.1": "分解炉仓*1.1",
        "AMOUNT": "合计",
    }
    rowAmountMap = {
        "Anthracite": "无烟煤",
        "SoftCoal": "烟煤",
        "StockA_1.1": "窑头仓*1.1",
        "StockB_1.1": "分解炉仓*1.1",
    }
    filterCalcMap = {
        "StockA": "StockA_1.1",
        "StockB": "StockB_1.1",
    }
    columns = [
        {
            key: 'mill',
        },
        {
            key: 'Anthracite',
        },
        {
            key: 'SoftCoal',
        },
        {
            key: 'StockA',
        },
        {
            key: 'StockA_1.1',
        },
        {
            key: 'StockB',
        },
        {
            key: 'StockB_1.1',
        },
        {
            key: 'AMOUNT',
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
                    width: 140,
                    title: this.keyMap[item.key],
                    dataIndex: item.key,
                    editable: (!!this.filterMap[item.key]) && item.block !== true,
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
            'StockA_1.1': row.StockA * 1.1,
            'StockB_1.1': row.StockB * 1.1,
            AMOUNT: this.columnsMount({
                ...item,
                ...row,
                'StockA_1.1': row.StockA * 1.1,
                'StockB_1.1': row.StockB * 1.1,
            }, this.rowAmountMap),
        });
        newData = this.rowMount(newData.slice(0, 4));
        this.setState({ data: newData });
    };
    componentDidMount() {
        this.fetchData();
    }

    onSerchKeyChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    columnsMount = (row, mapKey) => Object.keys(mapKey).reduce((m, cur) => Number(m) + Number(row[cur]), 0);

    rowMount = (data) => data.concat(_.uniq(data.map(item => item.type)).map((item, index) =>
        Object.keys(this.amountMap).reduce((obj, key) => {
            obj[key] = data.reduce((m, cur) => Number(m) + Number(cur[key]), 0)
            return obj;
        }, { mill: '合计', type: item, block: true, id: data.length + index })
    ))
    obj2ArrByMill = (data) => Object.keys(data)
        .reduce(
            (obj, key) => {
                obj.factory = '制造二';
                Object.keys(this.filterMapCopy).forEach(k1 => {
                    obj[this.filterMapCopy[k1]] = data[key][k1];
                });
                Object.keys(data[key]).forEach((k2) => {
                    if (!obj[k2] && this.filterMap[k2]) obj[k2] = 0;
                    if (this.filterMap[k2] && !isNaN(data[key][k2])) obj[k2] += Number(data[key][k2]);
                });
                return obj;
            },
            {})


    handleDataMount = (data) => {
        const arr = data
            .map((item, index) => {
                return ({
                    ...item,
                    id: index,
                    'StockA_1.1': item.StockA * 1.1,
                    'StockB_1.1': item.StockB * 1.1,
                    AMOUNT: this.columnsMount({
                        ...item,
                        'StockA_1.1': item.StockA * 1.1,
                        'StockB_1.1': item.StockB * 1.1,
                    }, this.rowAmountMap),
                })
            });
        return this.rowMount(arr)
    }

    dataFormat2fixed = (data) => data.map(item => Object.keys(item).reduce((obj, key) => {
        if (this.amountMap[key]) {
            obj[key] = Number(item[key]).toFixed(2);
        } else {
            obj[key] = item[key];
        }
        return obj;
    }, {}))

    fetchData = () => {
        let { proDate, team } = this.state;
        proDate = proDate.split('-').map(item => Number(item)).join('-');
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "getCoalMillResult",
            params: {
                day: proDate, shift: team, factory: '制造二'
            },
            cb: (res) => {
                if (res.code === '200' && !res.result.length) {
                    this.setState({
                        buttonType: true
                    })
                    const promiseArr = [5, 6, 7, 8].map(mill => new Promise((resolve, reject) =>
                        scriptUtil.excuteScriptService({
                            objName: "SCGL",
                            serviceName: "getCoalMillOutput",
                            params: {
                                day: proDate, shift: team, mill: mill + '',
                            },
                            cb: (res) => {
                                resolve(res.result)
                            }
                        })
                    ));
                    Promise.all(promiseArr).then(data => {
                        this.setState({
                            data: this.handleDataMount(data.map(item => this.obj2ArrByMill(item)))
                        })
                    })
                } else {
                    this.setState({
                        data: this.handleDataMount(res.result),
                        buttonType: false
                    })
                }
            }
        });
    }
    handleCreateSubmit = () => {
        let { data } = this.state;
        data = data.slice(0, 4).map(item => ({
            day: item.day,
            createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            shift: item.shift,
            mill: item.mill,
            SoftCoal: item.SoftCoal,
            Anthracite: item.Anthracite,
            StockA: item.StockA,
            StockB: item.StockB,
            factory: item.factory,
            id: item.id,
        }));
        scriptUtil.excuteScriptService({
            objName: "CoalMillResult",
            serviceName: "AddDataTableEntries",
            params: {
                params: JSON.stringify({ list: data })
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
        const promiseData = data.slice(0, 4).map(item => new Promise((resolve) => {
            const jsonData = {
                update: Object.keys(this.filterMap).reduce((obj, key) => { obj[key] = item[key]; return obj }, {}),
                where: {
                    'day': item.day,
                    'mill': item.mill,
                    'shift': item.shift,
                }
            };
            scriptUtil.excuteScriptService({
                objName: "CoalMillResult",
                serviceName: "UpdateDataTableEntry",
                params: { updateData: JSON.stringify(jsonData) },
                cb: (res) => {
                    resolve(res.result)
                    return res.result;
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('操作成功');
            this.setState({
                buttonType: false
            })
        })
    }
    outputExcel = () => {
        let { data } = this.state;
        data = data.map(item => ({
            mill: item.mill,
            Anthracite: item.Anthracite,
            SoftCoal: item.SoftCoal,
            StockA: item.StockA,
            "StockA_1.1": item['StockA_1.1'],
            "StockB_1.1": item['StockB_1.1'],
            StockB: item.StockB,
            AMOUNT: item.AMOUNT,
        }))
        const fileName = '制造二煤磨班报';
        const dataTitle = ['煤磨', "无烟煤", "烟煤", "窑头仓", "窑头仓*1.1", "分解炉仓", "分解炉仓*1.1", "合计"];

        scriptUtil.JSONToExcelConvertor({ data, fileName, dataTitle })
    }
    render() {
        const { proDate, team, buttonType, data } = this.state;
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
                            <label>班组：</label>
                            <Select
                                style={selectStyle}
                                value={team}
                                onChange={(value) => this.onSerchKeyChange('team', value)}
                            >
                                <Select.Option value='白班'>白班</Select.Option>
                                <Select.Option value='中班'>中班</Select.Option>
                                <Select.Option value='夜班'>夜班</Select.Option>
                            </Select>
                        </div>
                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.fetchData}
                                style={{ background: '#f05c42', border: 'none' }}
                            >获取</Button>
                        </div>
                        <div style={serchHeaderItem}>
                            {
                                buttonType === null ? null : (
                                    <div style={serchHeaderItem}>
                                        <Button
                                            type="primary"
                                            onClick={buttonType ? this.handleCreateSubmit : this.handleEditSubmit}
                                            style={{ background: '#15a1a3', border: 'none' }}
                                        >
                                            {buttonType ? '生成' : '修订'}
                                        </Button>
                                    </div>
                                )
                            }
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
                        dataSource={this.dataFormat2fixed(data)}
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