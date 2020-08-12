import React from 'react';
import { Table, Form, Button, Select, message } from 'antd';
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
.ant-table-body{
    transform: translate3d(0,0,0) !important;
}
`;
document.getElementsByTagName('head')[0].appendChild(css);

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], editingKey: '', shipList: [], shipNo: '' };
        this.columns = [
            {
                title: '船名',
                dataIndex: 'shipNo',
                key: 'shipNo',
                width: '25%',
                editable: false,
            },
            {
                title: '报港日期',
                dataIndex: 'bgDate',
                key: 'bgDate',
                width: '25%',
                editable: false,
            },
            {
                title: '报港吨位',
                dataIndex: 'ydqty',
                key: 'ydqty',
                width: '25%',
                editable: false,
            },
            {
                title: '操作',
                dataIndex: 'active',
                key: 'active',
                width: '25%',
                render: (text, record) => (<div style={{ textAlign: 'center' }}><Button type="primary" onClick={() => this.onActive(record)}>离港</Button></div>)
                ,
            },
        ];
    }
    componentDidMount() {
        _.map(['touchstart'], (event) => {
            document.getElementsByClassName('ant-select-selection--single')[0].addEventListener(event, (e) => {
                e.stopPropagation();
            });
        });

        document.getElementsByClassName('ant-table-body')[0].addEventListener("touchmove", function (e) {
            e.stopPropagation()
        });
        document.getElementsByClassName('ant-table-body')[0].addEventListener("touchstart", function (e) {
            e.stopPropagation()
        });
        scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getShipList",
            params: {},
            cb: (res) => {
                this.filteredOptions = _.get(res, 'result.list', []);
                this.setState({
                    shipList: _.get(res, 'result.list', [])
                }, () => {
                    this.onSerch();
                })
            }
        });
    }
    onActive = (record) => {
        scriptUtil.openPage(`#/runtime-fullscreen/runtime-fullscreen/Page_ccf8c94782124f35814c2ca0ffe5487a?code=${record.code}`, '_self');
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
                        data: res.result.list.map(item => ({ ...item, key: item.Code }))
                    })
                }
            }
        });

    }
    render() {
        return (
            <div>
                <div style={serchHeader}>
                    <label style={serchLabel}>搜索船号：</label>
                    <Select
                        showSearch
                        value={this.state.shipNo}
                        style={serchInput}
                        onChange={this.handleChange}
                        onSearch={this.handleSearch}
                    >
                        {this.state.shipList.map(d => <Select.Option value={d.shipNo}>{d.shipNo}</Select.Option>)}
                    </Select>
                    <Button onClick={this.onSerch} style={serchButton} type="primary">搜索</Button>
                </div>
                <Table
                    bordered
                    dataSource={this.state.data}
                    columns={this.columns}
                    pagination={false}
                    rowClassName="editable-row"
                    pagination={true}
                    scroll={{ x: 'max-content', y: 'calc(100vh - 115px)' }}
                />
            </div>

        );
    }
}

const CustomComp = Form.create()(EditableTable);


export default CustomComp;

const serchHeader = {
    margin: '20px 12px',
    padding: '0 8px',
    display: 'flex'
}
const serchInput = {
    flex: 1,
    margin: '0 10px'
}
const serchLabel = {
    fontWeight: 'bold',
    fontSize: '16px',
    width: '80px',
    whiteSpace: 'nowrap'
}
const serchButton = {
    width: '80px',
    margin: '0 10px',
}
