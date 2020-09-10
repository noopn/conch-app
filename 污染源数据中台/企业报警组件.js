import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Radio, Input, Popconfirm, Form, message, Row, Col } from 'antd';
class CustomComp extends Component {
    container = React.createRef();
    componentDidMount() {
        scriptUtil.excuteScriptService({
            objName: "parkFactoryInfo",
            serviceName: "getRuntimeAlarm",
            params: {},
            cb: (res) => {
                this.setState({
                    data: res.result.list,
                    filterData: new Array(120).fill(1).map(item => ({ areaName: 1, factoryType: 1 }))
                })
            }
        })
        if (this.container.current) {
            const tw = this.container.current.parentNode.offsetWidth;
            const th = this.container.current.parentNode.offsetHeight;
            console.log(tw, th)
            this.setState({
                scaleX: tw / 440,
                scaleY: th / 546
            })
        }
    }
    state = {
        data: [],
        scaleX: 1,
        scaleY: 1
    }
    columns = [
        {
            title: '企业名称',
            dataIndex: 'areaName',
            key: 'areaName',
            render: (text, r, index) => <p className='area-row'> <span className='area-rank'>{index + 1}</span> <span className='area-rank-text'>{text}</span></p>
        },
        {
            title: '报警数',
            dataIndex: 'factoryType',
            key: 'factoryType',
            align: 'center'
        },
    ];
    render() {
        const { filterData, scaleX, scaleY } = this.state;
        return (
            <div className='supos-comp-item' ref={this.container} style={{ transform: `translate3d(0,0,0) scale(${scaleX},${scaleY})` }}>
                <div className='container'>
                    <header className='header'>
                        <div className='header-icon'>
                            <span className='header-icon-item'></span>
                            <span className='header-icon-item'></span>
                            <span className='header-icon-item'></span>
                            <span className='header-icon-item'></span>
                        </div>
                        <h3 className='header-h3'>企业报警</h3>
                    </header>
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
    .supos-comp-item {
        width:440px;
        height:546px;
        position:relative;
        background:#011438;
    }
    .supos-comp-item .container{
        position: absolute;
        left: 8px;
        right: 8px;
        top: 8px;
        bottom: 8px;
        margin: auto;
        background: rgba(171,171,171,.2)
    }
    .supos-comp-item .container .header{
       margin-top:16px;
       width:403px;
       height:40px;
       margin-left:auto;
       margin-right:auto;
       line-height:40px;
       background:linear-gradient(90deg, rgba(2, 89, 130, 0.29), rgba(3, 96, 140, 0));
    }
    .supos-comp-item .container .header .header-icon {
        width: 15px;
        height: 15px;
        border: 1px solid rgba(63, 202, 241, 1);
        border-radius: 2px;
        position: relative;
        float:left;
        margin:12px;
    }
    .supos-comp-item .container .header-h3 {
        color:#fff;
        font-size:16px;
        margin-left:12px;
        float:left;
        margin: 0;
    }
    .supos-comp-item .container .header .header-icon-item {
        display: inline-block;
        width: 5px;
        height: 5px;
        background: rgba(63, 202, 241, 1);
        float: left;
        margin: top;
        margin-top: 1px;
        margin-left: 1px;
    }
    .table-pos {
        width:360px;
        height:450px;
        margin:auto;
        margin-top:15px;
    }
    .table-pos .ant-table-thead {
        height:36px;
    }
    .table-pos .area-row {
        line-height: 40px;
        margin: 0;
    }
    .table-pos .area-row .area-rank {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: linear-gradient(45deg, rgba(67, 129, 0, 1), rgba(162, 216, 24, 1));
        border-radius: 50%;
        text-align: center;
        line-height: 26px;
        font-size: 16px;
        color: #000;
        font-weight: bold;
    }
    .table-pos .area-row .area-rank-text {
        display: inline-block;
        margin-left: 10px;
        font-size: 14px;
        color: rgba(19, 200, 244, 1);
    }
    
    .table-pos .ant-table-tbody > tr:hover > td {
        background:transparent !important;
    }
 
    .table-pos thead.ant-table-thead > tr > th {
        background:#1a3059 !important;
        font-size:14px;
        height:36px;
        padding: 0 0 0 8px !important;
    }
    .ant-table-bordered .ant-table-thead > tr > th {
        border-right:none !important;
    }
    .table-pos .ant-table-tbody > tr > td {
        padding: 0 0 0 8px !important;
        height: 40px !important;
        line-height: 40px !important;
    }
    .ant-table-bordered .ant-table-tbody > tr > td  {
        border-right:none !important;
        border-bottom: 1px solid rgba(0, 58, 109, 1) !important;
    }
    .ant-table-bordered .ant-table-tbody > tr > td:last-child  {
        border-right:none !important;
    }
    .ant-table-bordered .ant-table-body > table {
        border:none !important;
        color: #fff;
    }
    .ant-table-thead > tr, .ant-table-tbody > tr:nth-child(even) {
        background:transparent !important;
    }
    .ant-table-thead > tr, .ant-table-tbody > tr:nth-child(odd) {
        background:transparent !important;
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