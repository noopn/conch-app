import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Radio, Input, Popconfirm, Form, message, Row, Col } from 'antd';
import moment from 'moment';
const bg1 = '/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF1@2x.png'
const bg2 = '/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF2.png'
class CustomComp extends Component {
    componentDidMount() {
        scriptUtil.excuteScriptService({
            objName: "parkFactoryInfo",
            serviceName: "getRuntimeAlarm",
            params: {},
            cb: (res) => {
                this.setState({
                    data: res.result.list,
                    filterData: res.result.list
                })
            }
        })
        scriptUtil.excuteScriptService({
            objName: "parkFactoryInfo",
            serviceName: "getFactoryType",
            params: {},
            cb: (res) => {
                this.setState({
                    factoryTypes: [{ optionValue: '', optionText: '全部' }].concat(res.result.list),
                })
            }
        })
        scriptUtil.excuteScriptService({
            objName: "parkFactoryInfo",
            serviceName: "getAreaList",
            params: {},
            cb: (res) => {
                this.setState({
                    areas: [{ optionValue: '', optionText: '全部' }].concat(res.result.list),
                })
            }
        })
    }
    state = {
        industrialArea: '南京化学工业园区',
        enterpriseType: '火电厂',
        alarmType: '超标',
        data: [],
        areas: [],
        area: '',
        filterData: [],
        factoryTypes: [],
        factoryType: '',
        type: '实时报警',
        factoryName: ''
    }
    columns = [
        {
            title: '地区',
            dataIndex: 'areaName',
            key: 'areaName',
        },
        {
            title: '行业',
            dataIndex: 'factoryType',
            key: 'factoryType',
        },
        {
            title: '企业名称',
            dataIndex: 'factoryName',
            key: 'factoryName',
        },
        {
            title: '报警内容',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '报警时间',
            dataIndex: 'alarmTime',
            key: 'alarmTime',
            render: (text) => moment(text).format('YYYY-MM-DD hh:mm:ss')
        },
        {
            title: '报警等级',
            dataIndex: 'priority',
            key: 'priority',
            render: () => 1
        },
    ];

    serch = () => {
        const { factoryType, area, type } = this.state;
        scriptUtil.excuteScriptService({
            objName: "parkFactoryInfo",
            serviceName: type === '实时报警' ? "getRuntimeAlarm" : "getHistoryAlarm",
            params: {
                areaName: area,
                factoryName: factoryType
            },
            cb: (res) => {
                console.log(res);
                this.setState({
                    data: res.result.list,
                    filterData: res.result.list
                })
            }
        })
    }
    render() {
        const { type, filterData, area, areas, factoryTypes, factoryType, factoryName } = this.state;
        return (
            <div className='supos-comp-wrapper'>
                <header className='header'>
                    <img
                        src='/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF@2x.png'
                        style={{
                            width: '1118px',
                            height: '90px',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            margin: 'auto',
                            top: '20px'
                        }}
                    />
                    <div style={{
                        width: '625px',
                        height: '82px',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '20px',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: '40px',
                        margin: 'auto',
                        display: 'flex',
                    }}>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 44px` }}
                          onClick={() => { location.hash = `#/runtime-fullscreen/runtime-fullscreen/Page_bf92ec85c1ad4588ade5d15edda0ca08` }}
                        >
                          总览
                        </div>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg2}) no-repeat center / 99px 38px` }}
                          onClick={() => { location.hash = '#/runtime-fullscreen/runtime-fullscreen/Page_a77b775b3468448f915b073492e06dce' }}
                        >
                          报警管理
                        </div>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }} 
                          onClick={() => {location.hash = `#/runtime-fullscreen/runtime-fullscreen/Page_4356cc4fa6a04729bff8bfdb8da0be60` }}
                        >
                          统计分析
                        </div>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }} 
                          onClick={() => {location.hash = `#/design/hellow` }}
                        >
                          系统管理
                        </div>
                    </div>
                    <img
                        src='/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E7%83%9F%E5%8F%B0logo@2x.png'
                        style={{
                            width: '458px',
                            height: '60px',
                            position: 'absolute',
                            left: 0,
                            top: '20px'
                        }} />
                </header>
                <div className='container'>
                    <div className='serch-wrapper'>
                        <div className='serch-bar-left'>
                            <Radio.Group value={type} buttonStyle="solid" onChange={(e) => this.setState({ type: e.target.value })} >
                                <Radio.Button value="实时报警">实时报警</Radio.Button>
                                <Radio.Button value="历史报警">历史报警</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className='serch-bar'>
                            <div className='serch-bar-item'>
                                <Select
                                    style={{ width: '100px' }}
                                    value={area}
                                    onChange={(val) => { this.setState({ area: val }) }}
                                >
                                    {areas.map(item => <Select.Option value={item.optionValue} key={item.optionValue}>{item.optionText}</Select.Option>)}
                                </Select>
                            </div>
                            <div className='serch-bar-item'>
                                <Select
                                    style={{ width: '100px' }}
                                    value={factoryType}
                                    onChange={(val) => { this.setState({ factoryType: val }) }}
                                >
                                    {factoryTypes.map(item => <Select.Option value={item.optionValue} key={item.optionValue}>{item.optionText}</Select.Option>)}
                                </Select>
                            </div>
                            <div className='serch-bar-item'>
                                <Input value={factoryName} onChange={(e) => this.setState({ factoryName: e.target.value })} className='input-ctrl' placeholder='请输入公司名称' />
                            </div>
                            <div className='serch-bar-item'>
                                <Button onClick={this.serch} type="primary">搜索</Button>
                            </div>
                        </div>
                    </div>
                    
                    <Table
                        bordered
                        dataSource={filterData}
                        columns={this.columns}
                        pagination={false}
                        className='table-pos'
                    />
                </div>
            </div>
        );
    }
}

export default CustomComp;


var css = document.createElement('style');
css.innerHTML = `
    .supos-comp-wrapper {
        width:100%;
        height:100%;
        position:relative;
    }
    .supos-comp-wrapper .header {
        height: 106px;
    }
    .supos-comp-wrapper .container {
        width: 100%;
        overflow: hidden;
    }
    .supos-comp-wrapper .serch-bar {
        margin-bottom: 8px;
        overflow: hidden;
        float: right;
        margin-top: 20px;
        margin-right: 24px;
    }
    .supos-comp-wrapper .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
        background: #3FCAF1;
        border-color: #3FCAF1;
        color: #fff;
    }

    .supos-comp-wrapper .ant-radio-button-wrapper {
        color: #fff;
        background: #1F6A93;
        border-color: #1F6A93;
        position: relative;
    }
    .supos-comp-wrapper .serch-wrapper {
        overflow:hidden
    }
    .supos-comp-wrapper .serch-bar-left {
        margin-bottom: 8px;
        overflow: hidden;
        float: left;
        margin-top: 20px;
        margin-left: 24px;
    }
    .supos-comp-wrapper .serch-bar-item {
        margin-right:6px;
        float:left
    }
    .table-pos {
        height: 100%;
        margin: 20px 30px 0;
    }
    .supos-comp-wrapper .input-ctrl {
        background: #151D27 !important;
        border: 1px solid #3A4A64 !important;
        color: #8F9BB3 !important;
    }
    .supos-comp-wrapper .ant-select-selection {
        background:#151D27 !important;
        border:1px solid #3A4A64 !important;
        color:#8F9BB3 !important;
    }
    .supos-comp-wrapper .ant-calendar-picker-input {
        background:#151D27 !important;
        border:1px solid #3A4A64 !important;
        color:#8F9BB3 !important;
    }
    .supos-comp-wrapper .ant-calendar-picker-clear {
        // background: transparent !important;
    }
    .supos-comp-wrapper .ant-table thead.ant-table-thead > tr > th {
        background:#2F3F59 !important;
        font-size:14px;
    }
    .supos-comp-wrapper .ant-table-bordered .ant-table-thead > tr > th {
        border-right:none !important;
    }
    .supos-comp-wrapper .ant-table-bordered .ant-table-tbody > tr > td  {
        border-right:1px solid #2F3F59 !important;
    }
    .supos-comp-wrapper .ant-table-bordered .ant-table-tbody > tr > td:last-child  {
        border-right:none !important;
    }
    .supos-comp-wrapper .ant-table-bordered .ant-table-body > table {
        border:none !important;
        color: #fff;
    }
    .supos-comp-wrapper .ant-table-thead > tr, .ant-table-tbody > tr:nth-child(even) {
        background:#213451 !important;
    }
    .supos-comp-wrapper .ant-table-thead > tr, .ant-table-tbody > tr:nth-child(odd) {
        background:#1C2B43 !important;
    } 
    .supos-comp-wrapper .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link {
        background: #304362 !important;
        border: none !important;
    }
    .supos-comp-wrapper .ant-pagination-item {
        background:#304362 !important;
        border: none !important;
    }
    .supos-comp-wrapper .ant-pagination-item a {
        color:#fff !important;
    }
    .supos-comp-wrapper .ant-pagination-item-active {
        background: #3377FF !important;
    }
    .supos-comp-wrapper .ant-pagination-item-active:hover {
        border:#3377FF !important;
    }
    `;
document.getElementsByTagName('head')[0].appendChild(css);