import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Popconfirm, Form, message, Row, Col } from 'antd';
import moment from 'moment';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const industrialArea = [
    { key: '南京化学工业园区', value: '南京化学工业园区' },
    { key: '新沂化工产业集中区', value: '新沂化工产业集中区' },
    { key: '江阴高新技术产业开发区化工集中区', value: '江阴高新技术产业开发区化工集中区' },
    { key: '常州滨江经济开发区新港片区', value: '常州滨江经济开发区新港片区' },
    { key: '启东经济开发区精细化工园区', value: '启东经济开发区精细化工园区' },
    { key: '连云港徐圩新区化工产业集中区', value: '连云港徐圩新区化工产业集中区' },
    { key: '淮安盐化新材料产业园区', value: '淮安盐化新材料产业园区' },
    { key: '江苏滨海经济开发区沿海工业园', value: '江苏滨海经济开发区沿海工业园' },
    { key: '南通经济技术开发区化工片区', value: '南通经济技术开发区化工片区' },
    { key: '镇江新区新材料产业园', value: '镇江新区新材料产业园' },
]
const enterpriseType = [
    { key: '火电厂', value: '火电厂' },
    { key: '污水处理厂', value: '污水处理厂' },
    { key: '垃圾焚烧厂', value: '垃圾焚烧厂' },
]
const alarmType = [
    { key: '超标', value: '超标' },
    { key: '数据和理性', value: '数据和理性' },
    { key: '工况异动', value: '工况异动' },
]
let count = 278;
const lockCount = 278
const data = new Array(500).fill(0).map((i, index) => ({
    industrialArea: industrialArea[~~(Math.random() * industrialArea.length)].value,
    enterpriseType: enterpriseType[~~(Math.random() * enterpriseType.length)].value,
    alarmType: alarmType[~~(Math.random() * alarmType.length)].value,
    alarmCount: count > 0 ? Math.abs(count -= (count = ~~(Math.random() * 20))) : 0,
    rank: index + 1,
}))
const bg1 = '/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF1@2x.png'
const bg2 = '/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF2.png'
class CustomComp extends Component {
    componentDidMount() {
        // scriptUtil.excuteScriptService({
        //     objName: "mockData",
        //     serviceName: "shuzu",
        //     params: {},
        //     cb: (res) => {
        //         console.log(res.result)
        //         this.setState({
        //             runTime: res.result
        //         })
        //     }
        // })
    }
    state = {
        industrialArea: '南京化学工业园区',
        enterpriseType: '火电厂',
        alarmType: '超标',
        data,
        filterData: data
    }
    columns = [
        {
            title: '园区名称',
            dataIndex: 'industrialArea',
            key: 'industrialArea',
        },
        {
            title: '企业类型',
            dataIndex: 'enterpriseType',
            key: 'enterpriseType',
        },
        {
            title: '报警类型',
            dataIndex: 'alarmType',
            key: 'alarmType',
        },
        {
            title: '报警次数',
            width: '40%',
            dataIndex: 'alarmCount',
            key: 'alarmCount',
            render: (text, record) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <span style={{ margin: '0 10px', fontSize: '14px', fontWeight: 'blod' }}>{text}</span>
                    <span style={{ height: '10px', background: '#7D9E36', marginRight: '10px', width: text ? `${text / lockCount * 100}%` : '1px' }}></span>
                </div>
            )
        },
        {
            title: '排名',
            dataIndex: 'rank',
            key: 'rank',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => <Button style={{ padding: '0 20px' }} type="primary">详情</Button>
        },
    ];

    serch = () => {
        const { data, industrialArea, enterpriseType, alarmType } = this.state;
        this.setState({
            filterData: data.filter(item => item.industrialArea === industrialArea && item.enterpriseType === enterpriseType && item.alarmType === alarmType)
        })
    }
    render() {
        return (
            <div className='supos-comp-wrapper'>
                <header>
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
                        <div style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }} onClick={() => { scriptUtil.openPage(`/#/runtime-fullscreen/runtime-fullscreen/Page_bf92ec85c1ad4588ade5d15edda0ca08`) }}>总览</div>
                        <div style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }} onClick={() => { }}>园区地图</div>
                        <div style={{ width: '94px', height: '44px', fontSize: '20px', textAlign: 'center', lineHeight: '44px', color: '#fff', background: `url(${bg2}) no-repeat center / 99px 44px` }} onClick={() => {scriptUtil.openPage(`/#/runtime-fullscreen/runtime-fullscreen/Page_43d04ae5b0744c308d0ab339237e0981`) }}>工况监控</div>
                        <div style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }} onClick={() => { }}>报警查询</div>
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
                    <div className='serch-bar'>
                        <div className='serch-bar-item'>
                            <Select
                                style={{ width: '100px' }}
                                value={this.state.industrialArea}
                                onChange={(val) => { this.setState({ industrialArea: val }) }}

                            >
                                {industrialArea.map(item => <Select.Option value={item.value} key={item.key}>{item.value}</Select.Option>)}
                            </Select>
                        </div>
                        <div className='serch-bar-item'>
                            <Select
                                style={{ width: '100px' }}
                                value={this.state.enterpriseType}
                                onChange={(val) => { this.setState({ enterpriseType: val }) }}
                            >
                                {enterpriseType.map(item => <Select.Option value={item.value} key={item.key}>{item.value}</Select.Option>)}
                            </Select>
                        </div>
                        <div className='serch-bar-item'>
                            <Select
                                style={{ width: '100px' }}
                                value={this.state.alarmType}
                                onChange={(val) => { this.setState({ alarmType: val }) }}
                            >
                                {alarmType.map(item => <Select.Option value={item.value} key={item.key}>{item.value}</Select.Option>)}
                            </Select>
                        </div>
                        <div className='serch-bar-item'>
                            <RangePicker onChange={() => { }} />
                        </div>
                        <div className='serch-bar-item'>
                            <Button onClick={this.serch} type="primary">搜索</Button>
                        </div>
                    </div>
                    <Table
                        bordered
                        dataSource={this.state.filterData}
                        columns={this.columns}
                    />
                </div>
            </div>
        );
    }
}

export default CustomComp;


var css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `
    .supos-comp-wrapper {
        width:100%;
        height:100%;
        min-width:1366px;
        position:relative;
        background:#00152C;
    }
    .supos-comp-wrapper .container {
        position:absolute;
        left:64px;
        right:64px;
        bottom:64px;
        top:126px;
        margin:auto;
        background:#002C58;
        border:1px solid #002F59;
        padding:50px 100px 100px;
    }
    .supos-comp-wrapper .serch-bar {
        margin-bottom: 8px;
        overflow:hidden
    }
    .supos-comp-wrapper .serch-bar-item {
        margin-right:6px;
        float:left
    }
    .ant-select-selection {
        background:#151D27 !important;
        border:1px solid #3A4A64 !important;
        color:#8F9BB3 !important;
    }
   .ant-calendar-picker-input {
        background:#151D27 !important;
        border:1px solid #3A4A64 !important;
        color:#8F9BB3 !important;
    }
    .ant-calendar-picker-clear {
        // background: transparent !important;
    }
    .ant-table thead.ant-table-thead > tr > th {
        background:#2F3F59 !important;
        font-size:14px;
    }
    .ant-table-bordered .ant-table-thead > tr > th {
        border-right:none !important;
    }
    .ant-table-bordered .ant-table-tbody > tr > td  {
        border-right:1px solid #2F3F59 !important;
    }
    .ant-table-bordered .ant-table-tbody > tr > td:last-child  {
        border-right:none !important;
    }
    .ant-table-bordered .ant-table-body > table {
        border:none !important;
        color: #fff;
    }
    .ant-table-thead > tr, .ant-table-tbody > tr:nth-child(even) {
        background:#213451 !important;
    }
    .ant-table-thead > tr, .ant-table-tbody > tr:nth-child(odd) {
        background:#1C2B43 !important;
    } 
    .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link {
        background: #304362 !important;
        border: none !important;
    }
    .ant-pagination-item {
        background:#304362 !important;
        border: none !important;
    }
    .ant-pagination-item a {
        color:#fff !important;
    }
    .ant-pagination-item-active {
        background: #3377FF !important;
    }
    .ant-pagination-item-active:hover {
        border:#3377FF !important;
    }
    `;
document.getElementsByTagName('head')[0].appendChild(css);