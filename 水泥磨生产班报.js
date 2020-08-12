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

    toggleEdit = (record) => {
        if (record.block) return false;
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit(record);
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: `${title} 未填写`,
                    //     },
                    // ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} style={{ textAlign: "center" }} />)}
            </Form.Item>
        ) : (
                <div
                    onClick={() => this.toggleEdit(record)}
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
        isShowButtonCreate: null
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
    }
    columns = [{
        title: '原料消耗',
        children: [
            {
                key: 'mill',
            },
            {
                key: 'type',
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
        ]
    }];
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
                    editable: !!this.filterMap[item.key] && item.block !== true,
                    // title: () => (<p style={{ textAlign: 'center', fontSize: '14px', width: '100%' }}>{this.keyMap[item.key]}</p>),
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
            AMOUNT: this.calcMount({
                ...item,
                ...row,
            })
        });
        newData = this.rowMount(newData.slice(0, millCount * typeCount));
        this.setState({ data: newData });
    };
    componentDidMount() { }

    datePickChange = (date, dateString) => {
        console.log(dateString);
        this.setState({ proDate: dateString });
    }
    teamChange = (team) => {
        this.setState({ team });
    }
    calcMount = (row) => {
        return Object.keys(row).reduce((m, cur) => {
            if (this.filterMap[cur]) {
                return _.add(Number(m) * 1000, Number(row[cur]) * 1000) / 1000
            }
            return m
        }, 0)
    }
    rowMount = (data) => {
        return data.concat(_.uniq(data.map(item => item.type)).map((item, index) => {
            return Object.keys({ ...this.filterMap, AMOUNT: '合计' }).reduce((obj, key) => {
                obj[key] = data.reduce((m, cur) => {
                    if (item === cur.type) {
                        return _.add(Number(m) * 1000, Number(cur[key]) * 1000) / 1000
                    }
                    return m
                }, 0)
                return obj;
            }, { mill: '合计', type: item, block: true, id: data.length + index })
        }))
    }
    fetchData = () => {
        let { proDate, team } = this.state;
        if (!proDate) {
            message.warn('请选择查询日期');
            return false;
        } else {
            proDate = proDate.split('-').map(item => Number(item)).join('-');
        }
        const handleData = (data) => {
            if (Array.isArray(data)) {
                let newData = data.map(item => {
                    return {
                        ...item,
                        AMOUNT: this.calcMount(item)
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
            serviceName: "getCementProduceResult",
            params: {
                proDate, team
            },
            cb: (res) => {
                if (res.code === '200' && !res.result.length) {
                    this.setState({
                        isShowButtonCreate: true
                    })
                    scriptUtil.excuteScriptService({
                        objName: "SCGL",
                        serviceName: "getCementProduce",
                        params: {
                            proDate, team
                        },
                        cb: (res) => {
                            this.setState({
                                data: handleData(res.result)
                            })
                        }
                    });
                } else {
                    this.setState({
                        data: handleData(res.result),
                        isShowButtonCreate: false
                    })
                }
                // this.setState({
                //     data: _.get(res, 'result.list', []).splice(60)
                // })
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
                params: JSON.stringify({ list: data.slice(0, data.length - 3) })
            },
            cb: (res) => {
                message.success('操作成功');
                this.setState({
                    isShowButtonCreate: false
                })
                return res.result;
            }
        });

    }
    handleEditSubmit = () => {
        const { data } = this.state;
        const promiseData = data.slice(0, data.length - 3).map(item => new Promise((resolve) => {
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
            AMOUNT: item.AMOUNT
        }))
        const fileName = '水泥磨生产班报';
        const dataTitle = ['磨机', '品种', '熟料', '石膏', '脱硫石膏', '脱硫石膏自产', '粉末（水泥用）', '粉末80', '粉煤灰', '煤矸石', '沸石', '煤渣', '矿渣微粉', '合计'];

        scriptUtil.JSONToExcelConvertor({ data, fileName, dataTitle })
    }
    render() {
        const { proDate, team, isShowButtonCreate, data } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        this.columns = this.dealColumns(this.columns);
        return (
            <div style={containerWrapper}>
                <h1 style={tableTitle}>水泥磨生产班报</h1>
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
                            <label>班组：</label>
                            <Select
                                style={selectStyle}
                                value={team}
                                onChange={this.teamChange}
                            >
                                <Select.Option value='早班'>早班</Select.Option>
                                <Select.Option value='中班'>中班</Select.Option>
                                <Select.Option value='晚班'>晚班</Select.Option>
                            </Select>
                        </div>
                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.fetchData}>获取</Button>
                        </div>
                    </div>
                    <div style={serchHeaderRight}>
                        {
                            isShowButtonCreate === null ? null : (
                                <div style={serchHeaderItem}>
                                    <Button
                                        type="primary"
                                        onClick={isShowButtonCreate ? this.handleCreateSubmit : this.handleEditSubmit}
                                    >
                                        {isShowButtonCreate ? '生成' : '修订'}
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