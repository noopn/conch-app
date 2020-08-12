import React, { Component } from 'react';
import { DatePicker } from 'antd';
import { Select } from 'antd';
import { Input } from 'antd';
// import moment from 'moment';

class CustomComp extends Component {
    state = {
        isSaveOkModalVisible: false,
        customerField: '',
        customerName: '',
        customerById: [],
        customerCollection: {},
        customerListVisible:false,

        productsField:'',
        productsById: [],
        productsCollection: {},

        shipField:'',
        shipName:'',
        shipById:[],
        shipByFilterId:[],
        shipCollection:{},
        shipListVisible: false
    }
    componentDidMount(){
        // 产品列表
        scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getProductsList",
            cb: (res) => {
                this.setState({
                    productsById: res.result.list.map(item => item.proId),
                    productsCollection: res.result.list.reduce((obj,item) => {obj[item.proId] = item.proName;return obj},{})
                })
            }
        });

         // 船号 吨位
         scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getShipList",
            cb: (res) => {
                const resList = res.result.list.map(item => ({
                    ...item,
                    id: Math.random().toString(36).substr(2)
                }))
                console.log(res);
                this.setState({
                    shipById: resList.map(item => item.id),
                    shipByFilterId: resList.map(item => item.id),
                    shipCollection: resList.reduce((obj,item) => {obj[item.id] = item;return obj},{})
                })
            }
        });
    }
    // onCustomerFilter
    onCustomerFilter = (value) => {
        // 客户名称
        scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getCustomerList",
            params: {param: value},
            cb: (res) => {
                this.setState({
                    customerById: res.result.list.map(item => item.custCode),
                    customerCollection: res.result.list.reduce((obj,item) => {obj[item.custCode] = item.custName;return obj},{})
                })
            }
        });
        this.setState({
            customerName: value,
            customerListVisible: true
        })
    }
    onCustomerChange = (id) => {
        const {customerCollection} = this.state;
        this.setState({
            customerField: id,
            customerName: customerCollection[id],
            customerListVisible: false
        });
      
    }

    onProductsChange = (productId) => {
        this.setState({
            'productsField': productId
        });
    }

    onShipFilter = (value) => {
        const {shipById, shipCollection} = this.state;
        this.setState({
            shipName: value,
            shipListVisible: true,
            shipByFilterId:value? shipById.filter(id => (new RegExp(value,'g')).test(shipCollection[id].shipNo) || (new RegExp(value,'g')).test(shipCollection[id].load)):shipById
        })
    }

    onShipChange = (id) => {
        console.log(this.state);
    }

    handleTouchStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.startPosition = e.changedTouches[0].clientY;
    }

    handleTouchMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentPosition = e.changedTouches[0].clientY;
        // 部分手机没有scrollBy
        // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
        const scrollTop = this.scrollDiv.scrollTop;
        this.scrollDiv.scrollTop = scrollTop + this.startPosition - currentPosition;
        this.startPosition = currentPosition;
    }

    handleScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    render() {
        return (
            <div style={containerStyle}>
                {this.state.isSaveOkModalVisible && (
                    <div style={saveOkModalOutMostContainer}>
                        <div style={saveOkModalContainer}>
                            <img style={saveOkImgStyle} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAABU5JREFUaAXVms1vFVUYxlvFxG9DRROigsZIYw1RmhA3IigVE/foQhN2ysqdiX+AC13UhQu3XbBEiJJoRAuUhRs1EU00Clo/AtEgjaExUSzk+vvNPQfmTi7tzJmZW+6TPD1nZs553ve9c76noyMNotPpjCO3Az4GN8EH4B3wVij+hufhz/AkPAHnRkdHfyC9NkAQk3AanoapsK4ak3WjGk0VwPhW6r4Fn8ppLJGfCzxD+nuOZEfW53gPeetuhzfAiKNkXuetfRFvtJoSyDh8D0acJ7MP7oa3VzVuHfg8VEOtiP1kbLbtAPE10GaxBMW/0Os7m7KoVtBUW2hLG2uaspHpIDgGj0BxCc7A+xo1khNDe0OwoS0xC8dyRdKzCE3AH6E4C7elq1Wrqa1gkyTzYaKaQqE0Is/ARdXACbixUKT1S23Cr6Gwj00lGaWibyYGc4D8LUlCDVTSNtQHYVDV3hQV7DOxmSmUPLw3EE8moQ/wIBT6Vq5PUdDRLA4ANrNVezPFH0NfYGx+DhQrj34UcpgUDgAD7zPFIIrX+hR8I+lMF5/3XFPASdOx3+FyYKNZjxMlLvQt+KivV598eRhXADMldFe1CL7OQLG/ryM82Jo97q4AWps0+xpPuImvTr5xReG6shc8jAPB8u2yt9qqXuFz7O9HehzhwSQUjvGNrc16jLRwoa/BZ5LOFk1cF+y8GNJDLNsXQv6aT4Kvh4KjL112mOji5mz35ZsDzuCDfaJy36WOWw9xOnOZjEO1+A9W3s80ETd2d8J/YNepCqL6DPVdjNvkdoT67u0XK2g1UhQnnkDoA3gj/LiqaPD5eKi33YA80BBz2d8B/iEYh9sPocur9+FemIJjodIWA4ozrWcAAwPBPIqxw9Bm7pt5gV/7ImkKou8PjSA8D8WuFKWUOth6GLpWFEfhTSk6sQ71dykE5g1oIct2OptjgTZTbD0IzwSbn5HGM7tks2hsDnoLBnQhXKyrqkg9h9o34L1l6obyv5KKL6GHkLWBzjoFwYW6Ab3W1el8S7qsczxfD0+F8t+QltuglQgXrZ6AkpscQnfB2AcPk++74QrlviMV38O7S/hZugh6scmdqz0oIObZg2tA8W7RC+6the58xU/QE9NGgWbPoBBX2XtSrSD4LLwIxatRh7yz+OfeBL/B++OzJlN090Ax6zzkVwCR/MsxfzifxEDeRvg5eDP3nDSdPP+AOyn3C2kbiIPSSZvcK1B8UtcSGu9kSt3jL4dk8Sd8pK72cvXR/1RD4GUDamxxitb18CMY8ReZbJ+ynEN1nqGfX5x2Vz3cbGz7gNZt0H5zDj5ex9kydbHRu32wEjenodhXRmSlMuh4KOjquXXoMxRXjg64GOYt+GIWTrFpczMO31cibf33rWfAtxKC6T0kUZYH+WOsDfVMtV8bf11HXv0YKwTlZ0Ax/AeNISCH8GE4Cn4SPy8FX+MGtX+zoFBsl2fJb+xfavXu6hPUN7Fyf6dQ/nOKny6G+3NKaHpjBOJHJXEADu8Hr9iYCGICxm2BQa3am9I2PAiFPlX7JJkLaioIKGTzG3if0mawTZIFMxX9S0oR8U3F5mdn3JYklFBJWzAOAPqQ9maKthGyT81C4XA5A1ubfNUONrQltN3YGUQWH4KOfg7pzlPCWdrrxj6/qBU04wpAW9roe1ZR/OGTrhF38o0rCrJZu3bF6zK+8mG/dUJdNeJCk2xmY/lJs08EycMxBt1avwmfzukukffg/Bgcjn8vyzmfZQlsEtos4iaRbGVYV43au9vkN1QMzGscKvsvmvMUPwW/gsc5PGnsXzT/B1OxBjEc1WO5AAAAAElFTkSuQmCC" />
                            <div style={saveOkTextStyle}></div>{/*{mainInfo.message}*/}
                        </div>
                    </div>
                )}
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>船号</div>
                    <div style={topTitleStyle}>吨位</div>
                    <div style={topTitleStyle}>预计到港日期</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>
                        <Input
                            disabled={this.disabledEdit}
                            style={commonStyle}
                            value={this.state.shipName}
                            onChange={(e) => { this.onShipFilter(e.target.value) }}
                        />
                        {
                            (this.state.shipListVisible && this.state.shipByFilterId.length > 0) ? 
                            <ul
                                style={searchTip}
                                // ref={ref => this.scrollDiv = ref}
                                onTouchStart={this.handleTouchStart}
                                onTouchMove={this.handleTouchMove}
                                onScroll={this.handleScroll}
                            >
                                {
                                    this.state.shipByFilterId.map(id => 
                                        (<li
                                            style={singleItem}
                                            onClick={ (e) => {
                                                this.onShipChange(id);
                                            }}
                                            key={id}
                                        >
                                            {this.state.shipCollection[id]}
                                        </li>)
                                    )
                                }    
                            </ul> : null
                        }

                    </div>
                    <div style={topDescStyle}></div>
                    <div style={topDescStyle}> <DatePicker style={commonStyle}>
                    </DatePicker></div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={{...MergeTitleStyle, ...MergeTitleStyleCus}}>客户名称</div>
                    <div style={{...MergeTitleStyle, ...MergeTitleStylePro}}>产品</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div ref={(el) => { this.selector = el; }} style={topDescStyle}>
                        <Input
                            disabled={this.disabledEdit}
                            style={commonStyle}
                            value={this.state.customerName}
                            onChange={(e) => { this.onCustomerFilter(e.target.value) }}
                        />
                        {
                            (this.state.customerListVisible && this.state.customerById.length > 0) ? 
                            <ul
                                style={searchTip}
                                // ref={ref => this.scrollDiv = ref}
                                onTouchStart={this.handleTouchStart}
                                onTouchMove={this.handleTouchMove}
                                onScroll={this.handleScroll}
                            >
                                {
                                    this.state.customerById.map((id) => {   
                                        return (
                                            <li
                                                style={singleItem}
                                                onClick={ (e) => {
                                                    this.onCustomerChange(id);
                                                }}
                                                key={id}
                                            >{this.state.customerCollection[id]}</li>
                                        )
                                    })
                                }    
                            </ul> : null
                        }
                    </div>
                    <div style={MergeDescStyle}>
                        <Select
                            style={productsSelect}
                            onChange = {this.onProductsChange}
                        >
                            {this.state.productsById.map(id=> <Select.Option value={id}>{this.state.productsCollection[id]}</Select.Option>)}
                        </Select>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>序列</div>
                    <div style={topTitleStyle}>计划量</div>
                    <div style={topTitleStyle}>+</div>
                </div>

                <div style={btnContainerStyle}>
                    <div style={saveBtnStyle}> 保 存 </div>
                </div>
            </div>
        );
    }
}

export default CustomComp;

const containerStyle = {
    height: '100vh',
    width: '80%',
    left: '10%',
    paddingBottom: 45,
    margin: '0 auto'
    
};
const backgroundColor = '#f5f6fa';
const borderColor = '#e6e9f0';
const fontColor = {
    primary: '#1f2e4d',
    secondary: '#49565e',
    red: '#f05656'
};

const topDivContainerStyle = {
    display: 'flex',
    width: '100%'
}

const topTitleStyle = {
    height: 60,
    lineHeight: '60px',
    fontSize: 14,
    color: fontColor.primary,
    textAlign: 'center',
    flex: 1,
    width: '33.33%',
    fontWeight: 'bold',
    backgroundColor,
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}

const MergeTitleStyle = {
    height: 60,
    lineHeight: '60px',
    fontSize: 14,
    color: fontColor.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor,
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}
const MergeTitleStyleCus ={
    flex: 2,
}
const MergeTitleStylePro ={
    flex: 1,
}
const topDescStyle = {
    position: 'relative',
    height: 50,
    lineHeight: '50px',
    fontSize: 12,
    color: fontColor.secondary,
    textAlign: 'center',
    flex: 1,
    width: '33.33%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px',
    padding: '0 7px'
}

const MergeDescStyle = {
    ...topDescStyle,
    width: '66.66%',
}


const commonStyle = {
    width: '90%'
}


// 保存弹窗
const saveOkModalOutMostContainer = {
    height: '100vh',
    width: '100%',
    position: 'fixed',
    zIndex: 1000000,
    top: 0,
    left: 0
}

const saveOkModalContainer = {
    width: 227,
    height: 227,
    zIndex: 1000000,
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
}

const saveOkImgStyle = {
    marginTop: '55px'
}

const saveOkTextStyle = {
    fontSize: 16,
    color: '#fff',
    marginTop: 25,
    borderRight: 4,
}

// 保存按钮
const btnContainerStyle = {
    display: 'flex',
    width: '80%',
    position: 'fixed',
    bottom: 0,
    left: '10%',
    borderTop: `solid 1px ${borderColor}`
}
const commonBtn = {
    width: '100%',
    fontSize: '18px',
    padding: '8px',
    textAlign: 'center'
}

const saveBtnStyle = {
    ...commonBtn,
    color: '#fff',
    backgroundColor: '#2d7df6'
}

const searchTip = {
    position: 'absolute',
    width: '90%',
    textAlign: 'left',
    top: '40px',
    border: '1px solid rgb(230, 233, 240)',
    background: '#fff',
    maxHeight: '258px',
    overflow: 'auto',
    zIndex: 1
}
const singleItem = {
    cursor: 'pointer',
    padding: '0 10px'
}
const productsSelect={
    width: '100%'
}