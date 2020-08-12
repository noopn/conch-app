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
const typeCount = 3;
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
        team: '早班', //班组
        buttonType: null
    }
    keyMap = {
        "mill": "磨机",
        "type": "品种",
        "SL": "熟料",
        "SL_Result": "熟料(修订)",
        "SG": "石膏",
        "SG_Result": "石膏(修订)",
        "TLSG": "脱硫石膏",
        "TLSG_Result": "脱硫石膏(修订)",
        "FM": "粉末(水泥用)",
        "FM_Result": "粉末(水泥用修订)",
        "FM80": "粉末80",
        "FM80_Result": "粉末80修订",
        "FMH": "粉煤灰",
        "FMH_Result": "粉煤灰(修订)",
        "MZ": "煤渣",
        "MZ_Result": "煤渣(修订)",
        "FS": "沸石",
        "FS_Result": "沸石(修订)",
        "KZWS": "矿渣微粉",
        "KZWS_Result": "矿渣微粉(修订)",
        "TLSG_ZC": "脱硫石膏自产",
        "TLSG_ZC_Result": "脱硫石膏自产(修订)",
        "MGS": "煤矸石",
        "MGS_Result": "煤矸石(修订)",
        "HSH": "火山灰",
        "AMOUNT": "合计",
        "RUN_TIME": "运转时常",
        "HALT_REASON": "停机原因"
    }
    filterMap = {
        "SL": "熟料",
        "SG": "石膏",
        "TLSG": "脱硫石膏",
        "FM": "粉末(水泥用)",
        "FM80": "粉末80",
        "FMH": "粉煤灰",
        "MZ": "煤渣",
        "FS": "沸石",
        "KZWS": "矿渣微粉",
        "TLSG_ZC": "脱硫石膏自产",
        "MGS": "煤矸石",
        "HSH": "火山灰"
    }
    columns = [
        {
            key: 'mill',
            fixed: 'left',
        },
        {
            key: 'type',
            fixed: 'left',
        },
        {
            key: 'SL',
        },
        {
            key: 'SG',
        },
        {
            key: 'TLSG',
        },
        {
            key: 'TLSG_ZC',
        },
        {
            key: 'FM',
        },
        {
            key: 'FM80',
        },
        {
            key: 'FMH',
        },
        {
            key: 'MGS',
        },
        {
            key: 'FS',
        },
        {
            key: 'MZ',
        },
        {
            key: 'KZWS',
        },
        {
            key: 'HSH',
        },
        {
            key: 'AMOUNT',
        },
        // {
        //     key: 'RUN_TIME',
        // },
        // {
        //     key: 'TAICHAN',
        // },
        // {
        //     key: 'HALT_REASON',
        // },
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
            AMOUNT: this.columnsMount({
                ...item,
                ...row,
            })
        });
        newData = this.rowMount(newData.slice(0, millCount * typeCount));
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
    columnsMount = (row) => {
        return Object.keys(row).reduce((m, cur) => {
            if (this.filterMap[cur]) {
                return (_.add(m * 100, row[cur] * 100) / 100).toFixed(2)
            }
            return m
        }, 0)
    }
    rowMount = (data) => {
        return data.concat(_.uniq(data.map(item => item.type)).map((item, index) => {
            return Object.keys({ ...this.filterMap, AMOUNT: '合计' }).reduce((obj, key) => {
                obj[key] = data.reduce((m, cur) => {
                    if (item === cur.type) {
                        return (_.add(m * 100, cur[key] * 100) / 100).toFixed(2)
                    }
                    return m
                }, 0)
                return obj;
            }, { mill: '合计', type: item, block: true, id: data.length + index })
        }))
    }
    obj2ArrByMill = (data) => {
        const newData = new Array(3).fill({});
        for (let key in data) {
            for (let key2 in data[key]) {
                // 计算各条皮带的和
                const temp = Object.assign({}, newData[key2]);
                for (let key3 in data[key][key2]) {
                    if (newData[key2][key3] === undefined) {
                        if (this.filterMap[key3]) {
                            temp[key3] = isNaN(data[key][key2][key3]) ? 0 : data[key][key2][key3]
                        } else {
                            temp[key3] = data[key][key2][key3]
                        }
                    } else {
                        if (this.filterMap[key3]) {
                            temp[key3] = (newData[key2][key3] * 100 + data[key][key2][key3] * 100) / 100
                        }
                    }
                    newData[key2] = temp;
                }
            }
        }
        return newData;
    }
    handleDataMount = (data) => {
        if (Array.isArray(data)) {
            let newData = data.map((item, index) => {
                const newItem = Object.keys(item)
                    .reduce((obj, key) => {
                        if (this.filterMap[key]) {
                            obj[key] = Number(item[key]).toFixed(2);
                        } else {
                            obj[key] = item[key];
                        }
                        return obj
                    }, {})
                return {
                    ...newItem,
                    id: index,
                    AMOUNT: this.columnsMount(newItem)
                }
            })
            // 处理末项合计数据
            newData = this.rowMount(newData);
            return newData;
        }
        return []
    }
    fetchData = () => {
        let { proDate, team } = this.state;
        proDate = proDate.split('-').map(item => Number(item)).join('-');
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "getCementProduceResult",
            params: {
                proDate, team
            },
            cb: (res) => {
                if (res.code === '200' && !res.result.length) {
                    this.setState({
                        buttonType: true
                    })
                    const promiseArr = [1, 2, 3, 4].map(mill => new Promise((resolve, reject) =>
                        scriptUtil.excuteScriptService({
                            objName: "SCGL",
                            serviceName: "GetNo1MillOutputOfShift",
                            params: {
                                day: proDate, shift: team, mill,
                            },
                            cb: (res) => {
                                resolve(res.result)
                            }
                        })
                    ));
                    Promise.all(promiseArr).then(data => {
                        this.setState({
                            data: this.handleDataMount(data.reduce((arr, item) => arr.concat(this.obj2ArrByMill(item)), []))
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
        data = data.map(item => ({ ...item, createDate: moment().format('YYYY-MM-DD HH:mm:ss') }))
        scriptUtil.excuteScriptService({
            objName: "cementProduceResult",
            serviceName: "AddDataTableEntries",
            params: {
                params: JSON.stringify({ list: data.slice(0, millCount * typeCount) })
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
        const promiseData = data.slice(0, millCount * typeCount).map(item => new Promise((resolve) => {
            const inputs = {
                'proDate': item.proDate,
                'mill': item.mill,
                'type': item.type,
                'team': item.team,
            };
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "deleteCementProduceResult",
                params: inputs,
                cb: (res) => {
                    resolve(res.result)
                    return res.result;
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            this.handleCreateSubmit();
        })
    }
    outputExcel = () => {
        let { data } = this.state;
        data = data.map(item => ({
            mill: item.mill,
            type: item.type,
            SL: item.SL,
            SG: item.SG,
            TLSG: item.TLSG,
            TLSG_ZC: item.TLSG_ZC,
            FM: item.FM,
            FM80: item.FM80,
            FMH: item.FMH,
            MGS: item.MGS,
            FS: item.FS,
            MZ: item.MZ,
            KZWS: item.KZWS,
            HSH: item.HSH,
            AMOUNT: item.AMOUNT
        }))
        const fileName = '水泥磨生产班报';
        const dataTitle = ['磨机', '品种', '熟料', '石膏', '脱硫石膏', '脱硫石膏自产', '粉末（水泥用）', '粉末80', '粉煤灰', '煤矸石', '沸石', '煤渣', '矿渣微粉', '火山灰', '合计'];

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
                                <Select.Option value='早班'>早班</Select.Option>
                                <Select.Option value='中班'>中班</Select.Option>
                                <Select.Option value='晚班'>晚班</Select.Option>
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