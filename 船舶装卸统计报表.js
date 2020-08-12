import React from 'react';
import { Table, Input, Form, Button, Select, DatePicker, message, Modal } from 'antd';
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
}
#serchTitle .ant-select-selection{
    border-radius: 4px 0 0 4px;
    border-right: none;
    outline:none;
}
#serchInput .ant-select-selection, #serchInput .ant-input{
    outline:none;
    border-radius: 0 4px 4px 0;
}
`;
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
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const CreateDataModel = Form.create()(
    class extends React.Component {
        state = {
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        componentDidMount() {
            setInterval(() => {
                this.setState({
                    createTime: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                this.props.form.setFieldsValue({
                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                });
            }, 1000);
        }
        render() {
            const { onCancel, onCreate, form, submiting, visible } = this.props;
            const { getFieldDecorator } = form;
            console.log(visible, submiting)
            return (
                <Modal
                    title="新建"
                    visible={visible}
                    okText="新建"
                    width={800}
                    height={600}
                    footer={[
                        <Button key="back" onClick={onCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={submiting} onClick={onCreate}>
                            确认
                        </Button>,
                    ]}
                    mask
                >
                    <div style={wrappedModel}>
                        <Form.Item {...formItemLayout} label="订单时间">
                            {getFieldDecorator('createTime')(<div>{this.state.createTime}</div>)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="船名">
                            {getFieldDecorator('shipNo', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入船名',
                                    },
                                ],
                            })(<Input placeholder="请输入" />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="装船机">
                            {getFieldDecorator('pile', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择装船机',
                                    },
                                ],
                            })(<Select style={{ width: '200px' }} placeholder='请选择'>
                                {[1, 2, 3, 4].map(item => <Select.Option value={item}>{item}</Select.Option>)}
                            </Select>)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="物料名称">
                            {getFieldDecorator('material', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择物料名称',
                                    },
                                ],
                            })(<Select style={{ width: '200px' }} placeholder='请选择'>
                                {["M32.5", "P·O42.5", "P·II52.5", "熟料"].map(item => <Select.Option value={item}>{item}</Select.Option>)}
                            </Select>)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="订单量">
                            {getFieldDecorator('qty', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入订单量',
                                    },
                                ],
                            })(<Input placeholder="请输入" />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="实际装载量">
                            {getFieldDecorator('quantity', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入实际装载量',
                                    },
                                ],
                            })(<Input placeholder="请输入" />)}
                        </Form.Item>
                    </div>
                </Modal>
            )

        }
    }
)

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], editingKey: '',
            shipList: [], shipNo: '',
            visible: false,
            carouselData: [],
            serchType: 'shipNo',
            submiting: false
        };
        this.columns = [
            {
                title: '订单号',
                dataIndex: 'orderCode',
                key: 'orderCode',
                width: "12%",
                align: 'center',
                editable: false,
            },
            {
                title: '完成时间',
                dataIndex: 'time',
                key: 'time',
                align: 'center',
                width: "12%",
                editable: false,
            },
            {
                title: '船名',
                dataIndex: 'shipNo',
                key: 'shipNo',
                align: 'center',
                width: "12%",
                editable: false,
            },
            {
                title: '装船机',
                dataIndex: 'pile',
                key: 'pile',
                align: 'center',
                width: "12%",
                editable: false,
            },
            {
                title: '物料名称',
                dataIndex: 'material',
                key: 'material',
                align: 'center',
                width: "12%",
                editable: true,
            },
            {
                title: '订单量',
                dataIndex: 'qty',
                width: "12%",
                align: 'center',
                key: 'qty',
                editable: true,
            },
            {
                title: '实际装载量',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
                width: "12%",
                editable: true,
            },
            {
                title: '操作',
                align: 'center',
                dataIndex: 'active',
                key: 'active',
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
                            <div
                                style={{ textAlign: 'center' }}
                            >
                                <Button
                                    disabled={editingKey !== ''}
                                    onClick={() => this.edit(record.key)}
                                    style={actionButton}
                                    key='edit'
                                    type="primary"
                                >
                                    修改
                            </Button>
                                <Button
                                    disabled={editingKey !== ''}
                                    onClick={() => this.delete(record.key)}
                                    style={actionButton}
                                    key='delete'
                                >
                                    删除
                                </Button>
                            </div>

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

    handleOk = key => {
        this.setState({
            [key]: false,
        });
    };

    handleCancel = key => {
        this.setState({
            visible: false,
        });
    };
    save(form, id) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => id === item.id);
            const dataItem = {
                ...newData[index],
                ...row,
                quantity: Number(row.quantity),
                qty: Number(row.qty)
            }


            // 调用更新接口保存这一行数据
            const updateData = {
                'update': {
                    'createTime': dataItem.time,
                    'quantity': dataItem.quantity,
                    'qty': dataItem.qty,
                    'material': dataItem.material,
                    'pile': dataItem.pile,
                    'shipNo': dataItem.shipNo
                },
                'where': {
                    'id': dataItem.id
                }
            }
            scriptUtil.excuteScriptService({
                objName: "cementBunkerStoreDT",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(updateData),
                },
                cb: (res) => {
                    newData.splice(index, 1, dataItem);
                    this.setState({ data: newData, editingKey: '' });
                    message.success('修改成功')
                }
            });
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }
    delete(id) {

        scriptUtil.excuteScriptService({
            objName: "cementBunkerStoreDT",
            serviceName: "DeleteDataTableEntries",
            params: { id },
            cb: (res) => {
                const newData = [...this.state.data];
                const index = newData.findIndex(item => id === item.id);
                newData.splice(index, 1);
                this.setState({ data: newData, editingKey: '' });
                message.success('删除成功')
            }
        });
    }
    handleChange = (val, key) => {
        this.setState({
            [key]: val,
            [key === 'shipNo' ? 'orderCode' : 'shipNo']: ''
        })
    }

    handleSearch = value => {
        this.setState({
            shipNo: value
        })
    };
    handleFocus = () => {
        this.setState({
            shipNo: ''
        })
    }
    onSerch = () => {
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "getCementBunkerStoreResult",
            params: {
                shipNo: this.state.shipNo,
                time: this.state.time
            },
            cb: (res) => {
                if (res.code === '200') {
                    this.setState({
                        data: res.result.map(item => ({ ...item, key: item.id }))
                    })
                }
            }
        });

    }
    outputExcel = () => {
        let { data } = this.state;
        data = data.map(item => ({
            'orderCode': item.orderCode || '',
            'createTime': item.time || '',
            'quantity': item.quantity || '',
            'qty': item.qty || '',
            'material': item.material || '',
            'pile': item.pile || '',
            'shipNo': item.shipNo || ''
        }))
        const fileName = '船舶装卸统计报表';
        const dataTitle = ["订单号", "创建时间", "实际装载量", "订单量", "物料名称", "装船机", "船名"];
        scriptUtil.JSONToExcelConvertor({ data, fileName, dataTitle })
    }
    handleVisable = () => {
        this.setState({
            visible: true
        })
    }
    saveFormRef = formRef => {
        this.formRef = formRef;
    };
    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (!err) {
                console.log(!err)
                const id = new Date().getTime().toString();
                values.id = id
                values.orderCode = 'CO' + id
                this.setState({
                    submiting: true
                })
                scriptUtil.excuteScriptService({
                    objName: "cementBunkerStoreDT",
                    serviceName: "AddDataTableEntry",
                    params: { params: JSON.stringify(values) },
                    cb: (res) => {
                        if (res.result) {
                            message.success('添加成功')
                        }
                        const { data } = this.state;
                        data.unshift({ ...values, key: values.id })
                        this.setState({
                            visible: false,
                            submiting: false,
                            data
                        })
                    }
                });
            }
        });
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
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        return (
            <div>
                <h1 style={tableTitle}>船舶装卸统计</h1>
                <div style={serchHeader}>
                    <div style={serchHeaderLeft}>
                        {/* <label style={serchLabel}>搜索：</label> */}
                        <div style={serchHeaderItem}>
                            <span id='serchTitle'>
                                <Select
                                    value={this.state.serchType}
                                    style={serchTitle}
                                    onChange={(e) => this.handleChange(e, 'serchType')}
                                    notFoundContent={null}
                                >
                                    <Select.Option value='shipNo'>船号</Select.Option>
                                    <Select.Option value='orderCode'>订单</Select.Option>
                                </Select>
                            </span>
                            {
                                this.state.serchType === 'shipNo' && <span id='serchInput'>
                                    <Select
                                        showSearch
                                        value={this.state.shipNo}
                                        style={serchInput}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onChange={(e) => this.handleChange(e, 'shipNo')}
                                        onSearch={this.handleSearch}
                                        onFocus={this.handleFocus}
                                        notFoundContent='无搜索结果'
                                        filterOption={(input, option) => {
                                            return option.props.children.indexOf(input) >= 0

                                        }}
                                    >
                                        {this.state.shipList.map(d => <Select.Option value={d.shipNo}>{d.shipNo}</Select.Option>)}
                                    </Select>
                                </span>
                            }
                            {
                                this.state.serchType === 'orderCode' && <span id='serchInput'>
                                    <Input
                                        value={this.state.orderCode}
                                        style={serchInput}
                                        onChange={(e) => this.handleChange(e.target.value, 'orderCode')}

                                    />
                                </span>
                            }

                        </div>
                        <div style={serchHeaderItem}>
                            <span id='serchTitle'> 日期：</span>
                            <DatePicker
                                onChange={(d, str) => this.handleChange(str, 'time')}
                            />
                        </div>
                        <div style={serchHeaderItem}>
                            <Button onClick={this.onSerch} style={serchButton} type="primary">搜索</Button>
                        </div>
                    </div>
                    <div style={serchHeaderRight}>
                        <div style={serchHeaderItem}>
                            <Button type="primary" onClick={this.handleVisable}>新建</Button>
                        </div>
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
                        rowClassName="editable-row"
                        pagination={{
                            pageSize: 10
                        }}
                    // scroll={{ x: 'max-content', y: 'calc(100vh - 213px)' }}
                    />
                </EditableContext.Provider>
                {
                    this.state.visible &&
                    <CreateDataModel
                        wrappedComponentRef={this.saveFormRef}
                        onCancel={this.handleCancel}
                        submiting={this.state.submiting}
                        visible={this.state.visible}
                        onCreate={this.handleCreate} />
                }
            </div>

        );
    }
}

const CustomComp = Form.create()(EditableTable);


export default CustomComp;

const serchHeader = {
    margin: '20px',
    padding: '0 30px',
    overflow: 'hidden',

}
const serchInput = {
    width: '300px'
}
const serchTitle = {
    width: '80px'
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
    objectFit: 'contain'
}
const tableTitle = {
    textAlign: 'center',
}
const actionButton = {
    margin: '0 5px'
}
const wrappedModel = {
    margin: '0 200px'
}