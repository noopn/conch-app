import React, { Component } from 'react';
import { DatePicker, Input, Select, message } from 'antd';

const chemicalName = '物检指标';

class CustomComp extends Component {
    // 这个自定义组件的滚动有问题, 所以这个东西是用来处理滚动事件的, 一般不用动
    scrollDiv;
    // 计算滚动的距离, 一般不用动
    startPosition;
    // 弹窗里面的滚动
    modalScrollDiv;
    // 计算滚动的距离, 一般不用动
    modalStartPosition;
    // ---  应该不用去动  结束---
    state = {
        isSaveOkModalVisible: false,
        cementType: ''
    }
    selectData = [
        { name: "P.O42.5" },
        { name: "M32.5" },
        { name: "P.II52.5" },
        { name: "熟料" },
    ]
    componentDidMount() {
        //隐藏滚轮
        const css = `::-webkit-scrollbar { display: none; } .ant-select {padding: 0 10px 0 0 !important;}`;
        this.head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');

        this.head.appendChild(this.style);

        this.style.type = 'text/css';
        if (this.style.styleSheet) {
            this.style.styleSheet.cssText = css;
        } else {
            this.style.appendChild(document.createTextNode(css));
        }
        _.map(['touchstart'], (event) => {
            this.selector.addEventListener(event, (e) => {
                e.stopPropagation();
            });
        });
        window.addEventListener("resize", function () {
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })

    }
    onInputChange = (e, key) => {
        this.setState({
            [key]: e.target.value
        })
    }
    onSelectChange = (val, key) => {
        this.setState({
            [key]: val
        })
    }
    handleDateChange = (m, key) => {
        this.setState({
            [key]: m.format("YYYY-MM-DD HH:mm")
        });
    };
    render() {
        return (
            <div style={containerStyle}
                ref={ref => this.scrollDiv = ref}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onScroll={this.handleScroll}
            >
                {this.state.isSaveOkModalVisible && (
                    <div style={saveOkModalOutMostContainer}>
                        <div style={saveOkModalContainer}>
                            <img style={saveOkImgStyle} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAABU5JREFUaAXVms1vFVUYxlvFxG9DRROigsZIYw1RmhA3IigVE/foQhN2ysqdiX+AC13UhQu3XbBEiJJoRAuUhRs1EU00Clo/AtEgjaExUSzk+vvNPQfmTi7tzJmZW+6TPD1nZs553ve9c76noyMNotPpjCO3Az4GN8EH4B3wVij+hufhz/AkPAHnRkdHfyC9NkAQk3AanoapsK4ak3WjGk0VwPhW6r4Fn8ppLJGfCzxD+nuOZEfW53gPeetuhzfAiKNkXuetfRFvtJoSyDh8D0acJ7MP7oa3VzVuHfg8VEOtiP1kbLbtAPE10GaxBMW/0Os7m7KoVtBUW2hLG2uaspHpIDgGj0BxCc7A+xo1khNDe0OwoS0xC8dyRdKzCE3AH6E4C7elq1Wrqa1gkyTzYaKaQqE0Is/ARdXACbixUKT1S23Cr6Gwj00lGaWibyYGc4D8LUlCDVTSNtQHYVDV3hQV7DOxmSmUPLw3EE8moQ/wIBT6Vq5PUdDRLA4ANrNVezPFH0NfYGx+DhQrj34UcpgUDgAD7zPFIIrX+hR8I+lMF5/3XFPASdOx3+FyYKNZjxMlLvQt+KivV598eRhXADMldFe1CL7OQLG/ryM82Jo97q4AWps0+xpPuImvTr5xReG6shc8jAPB8u2yt9qqXuFz7O9HehzhwSQUjvGNrc16jLRwoa/BZ5LOFk1cF+y8GNJDLNsXQv6aT4Kvh4KjL112mOji5mz35ZsDzuCDfaJy36WOWw9xOnOZjEO1+A9W3s80ETd2d8J/YNepCqL6DPVdjNvkdoT67u0XK2g1UhQnnkDoA3gj/LiqaPD5eKi33YA80BBz2d8B/iEYh9sPocur9+FemIJjodIWA4ozrWcAAwPBPIqxw9Bm7pt5gV/7ImkKou8PjSA8D8WuFKWUOth6GLpWFEfhTSk6sQ71dykE5g1oIct2OptjgTZTbD0IzwSbn5HGM7tks2hsDnoLBnQhXKyrqkg9h9o34L1l6obyv5KKL6GHkLWBzjoFwYW6Ab3W1el8S7qsczxfD0+F8t+QltuglQgXrZ6AkpscQnfB2AcPk++74QrlviMV38O7S/hZugh6scmdqz0oIObZg2tA8W7RC+6the58xU/QE9NGgWbPoBBX2XtSrSD4LLwIxatRh7yz+OfeBL/B++OzJlN090Ax6zzkVwCR/MsxfzifxEDeRvg5eDP3nDSdPP+AOyn3C2kbiIPSSZvcK1B8UtcSGu9kSt3jL4dk8Sd8pK72cvXR/1RD4GUDamxxitb18CMY8ReZbJ+ynEN1nqGfX5x2Vz3cbGz7gNZt0H5zDj5ex9kydbHRu32wEjenodhXRmSlMuh4KOjquXXoMxRXjg64GOYt+GIWTrFpczMO31cibf33rWfAtxKC6T0kUZYH+WOsDfVMtV8bf11HXv0YKwTlZ0Ax/AeNISCH8GE4Cn4SPy8FX+MGtX+zoFBsl2fJb+xfavXu6hPUN7Fyf6dQ/nOKny6G+3NKaHpjBOJHJXEADu8Hr9iYCGICxm2BQa3am9I2PAiFPlX7JJkLaioIKGTzG3if0mawTZIFMxX9S0oR8U3F5mdn3JYklFBJWzAOAPqQ9maKthGyT81C4XA5A1ubfNUONrQltN3YGUQWH4KOfg7pzlPCWdrrxj6/qBU04wpAW9roe1ZR/OGTrhF38o0rCrJZu3bF6zK+8mG/dUJdNeJCk2xmY/lJs08EycMxBt1avwmfzukukffg/Bgcjn8vyzmfZQlsEtos4iaRbGVYV43au9vkN1QMzGscKvsvmvMUPwW/gsc5PGnsXzT/B1OxBjEc1WO5AAAAAElFTkSuQmCC" />
                            <div style={saveOkTextStyle}>{this.state.message}</div>
                        </div>
                    </div>
                )}
                <div style={listWrapper}>
                    <div style={listItemStyle}>
                        <label style={listItemLabel}>自动编码</label>
                        {/* <div style={listItemInput}>{this.state.code}</div> */}
                        <Input style={listItemInput} value={this.state.code} placeHolder='请输入自动编码' onChange={(e) => this.onInputChange(e, 'code')} />
                    </div>
                    <div style={listItemStyle}>
                        <label style={listItemLabel}>船名</label>
                        {/* <div style={listItemInput}>{this.state.shipName}</div> */}
                        <Input style={listItemInput} value={this.state.shipName} placeHolder='请输入船名' onChange={(e) => this.onInputChange(e, 'shipName')} />
                    </div>
                    <div style={listItemStyle}>
                        <label style={listItemLabel}>创建时间</label>
                        <div style={listItemInput}>
                            <DatePicker
                                placeholder="请选择创建时间"
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime={{ format: "HH:mm:ss" }}
                                onChange={d => this.handleDateChange(d, "createTime")}
                            />
                        </div>
                    </div>
                    <div style={listItemStyle}>
                        <label style={listItemLabel}>水泥类型</label>
                        <div ref={(el) => { this.selector = el; }} style={listItemInput}>
                            <Select
                                style={listItemInput}
                                value={this.state.cementType}
                                placeholder='请选择水泥类型'
                                onChange={(val) => this.onSelectChange(val, 'cementType')}
                            >
                                {
                                    this.selectData.map(item => <Select.Option value={item.name}>{item.name}</Select.Option>)
                                }

                            </Select>
                        </div>

                        {/* <Input style={listItemInput} value={this.state.cementType} placeHolder='请输入自动编码' onChange={(e) => this.onInputChange(e, 'cementType')} /> */}
                    </div>
                    <div style={listItemStyle}>
                        <label style={listItemLabel}>流水号</label>
                        <Input style={listItemInput} value={this.state.serialNum} placeHolder='请输入流水号' onChange={(e) => this.onInputChange(e, 'serialNum')} />
                    </div>
                    <div style={listItemStyle}>
                        <label style={listItemLabel}>订单编码</label>
                        {/* <div style={listItemInput}>{this.state.orderCode}</div> */}
                        <Input style={listItemInput} value={this.state.orderCode} placeHolder='请输订单编码' onChange={(e) => this.onInputChange(e, 'orderCode')} />

                    </div>
                </div>
                <div style={btnContainerStyle}>
                    <div style={saveBtnStyle} onTouchEnd={this.handleSaveClick}>确认</div>
                </div>
            </div>
        );
    }

    // 获取化学成分列表, 应该不用动
    get chemicalList() {
        return this.state.dataSections.find(section => section.name === chemicalName) || [];
    }
    // 设置化学成分列表, 应该不用动
    set chemicalList(arr) {
        this.state.dataSections.find(section => section.name === chemicalName).data = arr;
    }

    // 点击展开/隐藏 输入框等详情, 应该不用动
    handleClick = (section, name, field = 'isShowDetail') => {


        const item = this[section.listName].data.find(item => item.name === name);
        item[field] = !item[field];
        this.setState({ dataSections: this.state.dataSections.concat([]) });
    }
    dateOnChange = (item, date) => {
        item.value = date;
        this.setState({ dataSections: this.state.dataSections.concat([]) });
    }
    dateOnOk = (item, date) => {
        item.value = date;
        this.setState({ dataSections: this.state.dataSections.concat([]) });
    }
    handleSaveClick = () => {
        const { code, shipName, createTime, cementType, serialNum, orderCode } = this.state;
        if (!code || !shipName || !createTime || !cementType || !serialNum || !orderCode) {
            message.warn('请检查信息是否填写完整');
            return false;
        }

        scriptUtil.excuteScriptService({
            objName: "cementSampleAutoCode",
            serviceName: "AddDataTableEntry",
            params: {
                code, shipName, createTime, cementType, serialNum, orderCode, status: 1
            },
            cb: (res) => {
                this.showDialogue("新增成功");
                window.setTimeout(() => {
                    scriptUtil.openPage('#/runtime-fullscreen/runtime-fullscreen/Page_b31b8f18486f40bda216fbd72c6a2aa3', '_self');
                }, 800)
                // window.top.zhizhiDispatchAppEvent('reqOpenPublicAccount', {
                //     // 下一个的最上面的标题
                //     title: '',
                //     // 下一个页面的URL
                //     url: `http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_b31b8f18486f40bda216fbd72c6a2aa3`
                // })
                return res.result;
            }
        });

    }
    showDialogue = (message) => {
        this.state.message = message;
        // 这里只是保存成功后, 显示保存成功的弹窗
        this.setState({ isSaveOkModalVisible: true }, () => {
            // 2秒后隐藏弹窗, 时间可以自己改
            setTimeout(() => {
                this.setState({ isSaveOkModalVisible: false })
            }, 2000)
        })
    }

    // input框的输入
    handleInput = (item, e) => {
        item[e.target.name] = e.target.value;
        item[e.target.name] = e.target.value;
        this.setState({ dataSections: this.state.dataSections.concat([]) });
    }

    // ----------处理滚动开始, 应该不用动----------
    handleTouchStart = (e) => {
        this.startPosition = e.changedTouches[0].clientY;
    }

    handleTouchMove = (e) => {
        // 如果弹窗打开的话 外面的不要滚动
        // if (this.state.isAnalysisResultModalVisible) return;
        // const currentPosition = e.changedTouches[0].clientY;
        // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
        // this.startPosition = currentPosition;
        // 如果弹窗打开的话 外面的不要滚动
        if (this.state.isAnalysisResultModalVisible) return;
        const currentPosition = e.changedTouches[0].clientY;
        // 部分手机没有scrollBy
        // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
        const scrollTop = this.scrollDiv.scrollTop;
        this.scrollDiv.scrollTop = scrollTop + this.startPosition - currentPosition;
        this.startPosition = currentPosition;
    }

    handleScroll = (e) => {
        e.preventDefault();
    }
    // 弹窗里的
    handleTouchStartModal = (e) => {
        this.modalStartPosition = e.changedTouches[0].clientY;
    }

    handleTouchMoveModal = (e) => {
        const currentPosition = e.changedTouches[0].clientY;
        this.modalScrollDiv.scrollBy(0, this.modalStartPosition - currentPosition);
        this.modalStartPosition = currentPosition;
    }

    handleScrollModal = (e) => {
        e.preventDefault();
    }
    // ----------处理滚动结束, 应该不用动----------
}

export default CustomComp;

const containerStyle = {
    height: '100vh',
    width: '100%',
    overflowY: 'scroll',
    paddingBottom: 45,
    fontFamily: 'PingFangSC-Regular,PingFang SC'
};
const borderColor = '#e6e9f0';
const listWrapper = {

}

const listItemStyle = {
    lineHeight: '50px',
    borderBottom: '1px solid #E0E0E0',
    padding: '4px 12px'
}
const listItemLabel = {
    fontWeight: 'bold',
    width: '80px',
    fontSize: '16px',
    color: '#222222',
    display: 'inline-block'
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


const listItemInput = {
    border: 'none',
    outLine: 'none',
    width: 'calc(100% - 80px)',
    color: '#666666',
    fontSize: '16px',
    display: 'inline-block',
    padding: '0 10px'
}

// 保存按钮
const btnContainerStyle = {
    display: 'flex',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    borderTop: `solid 1px ${borderColor}`
}
const commonBtn = {
    width: '100%',
    fontSize: '18px',
    textAlign: 'center',
    lineHeight: '50px'
}

const saveBtnStyle = {
    width: '100%',
    fontSize: '18px',
    textAlign: 'center',
    lineHeight: '50px',
    color: '#fff',
    backgroundColor: '#2d7df6'
}
const analysisResultStyle = {
    width: '100%',
    fontSize: '18px',
    textAlign: 'center',
    lineHeight: '50px',
    color: '#2d7df6',
    backgroundColor: '#fff',
}