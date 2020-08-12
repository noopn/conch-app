import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Select, DatePicker, message, Carousel, Modal } from 'antd';
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
}
.ant-carousel .slick-slide {
    text-align: center;
    height: 750px;
    background: #364d79;
    overflow: hidden;
}`;
document.getElementsByTagName('head')[0].appendChild(css);
const EditableContext = React.createContext();

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'date') {
            return <DatePicker />;
        } else if (this.props.inputType === 'time') {
            return <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />;
        }
        return <Input />;
    };
    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            // rules: [
                            //     {
                            //         required: true,
                            //         message: `Please Input ${title}!`,
                            //     },
                            // ],
                            initialValue: (() => {
                                if (inputType === 'date') {
                                    if (record[dataIndex]) {
                                        return moment(record[dataIndex], 'YYYY-MM-DD');
                                    }
                                    return moment();
                                } else if (inputType === 'time') {
                                    if (record[dataIndex]) {
                                        return moment(record[dataIndex], 'YYYY-MM-DD HH:mm');
                                    }
                                    return moment();
                                }
                                return record[dataIndex]
                            })()
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], editingKey: '', shipList: [], shipNo: '', visible: false, carouselData: [] };
        this.editInputTypeFilterDateKeyArray = [];
        this.editInputTypeFilterTimeKeyArray = ['sqcDate', 'eqcDate', 'qxDate', 'tzqcDate','lgDate']
        this.columns = [
            {
                title: '船名',
                dataIndex: 'shipNo',
                key: 'shipNo',
                align: 'center',
                editable: false,
            },
            {
                title: '报港日期',
                dataIndex: 'bgDate',
                key: 'bgDate',
                align: 'center',
                editable: false,
            },
            {
                title: '报港吨位',
                dataIndex: 'ydqty',
                key: 'ydqty',
                align: 'center',
                editable: false,
            },
            {
                title: '水尺吨位',
                dataIndex: 'scWeight',
                key: 'scWeight',
                align: 'center',
                editable: false,
            },
            {
                title: '皮带秤吨位',
                dataIndex: 'beltWeight',
                key: 'beltWeight',
                align: 'center',
                editable: true,
            },
            {
                title: '启卸日期',
                dataIndex: 'qxDate',
                key: 'qxDate',
                align: 'center',
                editable: true,
            }, {
                title: '通知清仓日期',
                dataIndex: 'tzqcDate',
                key: 'tzqcDate',
                editable: true,
            }, {
                title: '开始清仓时间',
                dataIndex: 'sqcDate',
                key: 'sqcDate',
                align: 'center',
                editable: true,
            },
            {
                title: '结束清仓时间',
                dataIndex: 'eqcDate',
                key: 'eqcDate',
                align: 'center',
                editable: true,
            },
            {
                title: '清仓人数',
                dataIndex: 'qcMember',
                key: 'qcMember',
                align: 'center',
                editable: true,
            },
            {
                title: '离港日期',
                dataIndex: 'lgDate',
                key: 'lgDate',
                align: 'center',
                editable: true,
            },
            {
                title: '图片附件',
                dataIndex: 'bgpic',
                key: 'bgpic',
                align: 'center',
                render: (text, record) => {
                    return <span
                        style={{ color: 'blue', display: 'block', textAlign: 'center' }}
                        onClick={() => this.showModal(record.bgpic)}
                    >预览</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'active',
                key: 'active',
                align: 'center',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a
                                        onClick={() => this.save(form, record.key)}
                                        style={{ marginRight: 8 }}
                                    >
                                        保存
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <a onClick={() => this.cancel(record.key)}>取消</a>
                            {/* <Popconfirm title="是否取消?" onConfirm={() => this.cancel(record.key)}>
                                <a>取消</a>
                            </Popconfirm> */}
                        </span>
                    ) : (
                            <Button
                                disabled={editingKey !== ''}
                                onClick={() => this.edit(record.key)}
                                type="primary"
                            >
                                修改
                            </Button>
                        );
                },
            },
        ];
    }
    componentDidMount() {
        scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getShipList",
            params: {},
            cb: (res) => {
                this.filteredOptions = _.get(res, 'result.list', []);
                this.setState({
                    shipList: _.get(res, 'result.list', [])
                }, () => {
                    this.onSerch()
                })
            }
        });
    }
    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };
    showModal = (carouselData) => {
        this.setState({
            visible: true,
            carouselData
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];

            const newRow = Object.keys(row).reduce((obj, key) => {
                if (this.editInputTypeFilterDateKeyArray.includes(key)) {
                    obj[key] = row[key].format("YYYY-MM-DD")
                } else if (this.editInputTypeFilterTimeKeyArray.includes(key)) {
                    obj[key] = row[key].format("YYYY-MM-DD HH:mm")
                } else {
                    obj[key] = row[key]
                }
                return obj;
            }, {})
            // console.log(newRow)
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...newRow,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(newRow);
                this.setState({ data: newData, editingKey: '' });
            }
            // 调用更新接口保存这一行数据
            const jsonData = {
                'update': {
                    'beltWeight': newData[0].beltWeight,
                    'qxDate': newData[0].qxDate,
                    'tzqcDate': newData[0].tzqcDate,
                    'sqcDate': newData[0].sqcDate,
                    'eqcDate': newData[0].eqcDate,
                    'qcMember': newData[0].qcMember,
                    'lgDate': newData[0].lgDate
                },
                'where': {
                    'Code': newData[0].code
                }
            }
            scriptUtil.excuteScriptService({
                objName: "BgMainDt",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData),
                },
                cb: (res) => {
                    message.success('修改成功')
                }
            });
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }
    handleChange = (val) => {
        this.setState({
            shipNo: val
        })
    }

    handleSearch = value => {
        const shipList = this.filteredOptions.filter(x => {
            return x.shipNo.indexOf(value) > -1
        });
        this.setState({
            shipList
        })
    };
    onSerch = () => {
        scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getLgList",
            // params: { code: '' },
            cb: (res) => {
                if (res.code === '200') {
                    this.setState({
                        data: res.result.list.map(item => ({ ...item, key: item.code }))
                    })
                }
            }
        });

    }
    outputExcel = () => {
        let { data } = this.state;
        data = data.map(item => ({
            shipNo: item.shipNo,
            bgDate: item.bgDate || '',
            ydqty: item.ydqty || '',
            scWeight: item.scWeight || '',
            beltWeight: item.beltWeight || '',
            qxDate: item.qxDate || '',
            tzqcDate: item.tzqcDate || '',
            sqcDate: item.sqcDate || '',
            eqcDate: item.eqcDate || '',
            qcMember: item.qcMember || '',
            lgDate: item.lgDate || '',
        }))
        const fileName = '煤船离港确认单';
        const dataTitle = ["船名", "报港日期", "报港吨位", "水尺吨位", "皮带秤吨位", "启卸日期", "通知清仓日期", "开始清仓时间", "结束清仓时间", "清仓人数", "离港日期"]
        scriptUtil.JSONToExcelConvertor({ data, fileName, dataTitle })
    }
    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: (() => {
                        if (this.editInputTypeFilterDateKeyArray.includes(col.key)) {
                            return 'date'
                        } else if (this.editInputTypeFilterTimeKeyArray.includes(col.key)) {
                            return 'time'
                        } else {
                            return 'text'
                        }
                    })(),
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <div>
                <div style={serchHeader}>
                    <div style={serchHeaderLeft}>
                        <label style={serchLabel}>搜索船号：</label>
                        <div style={serchHeaderItem}>
                            <Select
                                showSearch
                                value={this.state.shipNo}
                                style={serchInput}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onChange={this.handleChange}
                                onSearch={this.handleSearch}
                                notFoundContent={null}
                            >
                                {this.state.shipList.map(d => <Select.Option value={d.shipNo}>{d.shipNo}</Select.Option>)}
                            </Select>
                        </div>
                        <div style={serchHeaderItem}>
                            <Button onClick={this.onSerch} style={serchButton} type="primary">搜索</Button>
                        </div>
                    </div>
                    <div style={serchHeaderRight}>
                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.outputExcel}>导出</Button>
                        </div>
                    </div>
                </div>
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        components={components}
                        bordered
                        dataSource={this.state.data}
                        columns={columns}
                        pagination={true}
                        rowClassName="editable-row"
                    />
                </EditableContext.Provider>
                <Modal
                    title="离港图片预览"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={1200}
                    height={900}
                    mask
                    footer={null}
                >
                    <Carousel
                        autoplay
                    >
                        {this.state.carouselData && this.state.carouselData.map((item, index) => (
                            <div key={index}>
                                <div style={{ width: '1200px', height: '900px', background: '#f3f3f3' }} >
                                    <img src={item.url} style={picStyle} />
                                </div>
                            </div>))}
                    </Carousel>
                </Modal>
            </div>

        );
    }
}

const CustomComp = Form.create()(EditableTable);


export default CustomComp;

const serchHeader = {
    margin: '20px',
    padding: '0 40px',
    overflow: 'hidden',

}
const serchInput = {
    width: '400px'
}
const serchLabel = {
    padding: '0 20px',
    fontWeight: 'bold',
    fontSize: '16px'
}
const serchButton = {
    margin: '0 20px'
}
const serchHeaderItem = {
    display: 'inline-block',
    margin: '0 12px'
}
const serchHeaderLeft = {
    float: 'left'
}
const serchHeaderRight = {
    float: 'right'
}
const picStyle = {
    width: '100%',
    height: '100%',
    // objectFit: 'contain'
}