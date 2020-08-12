import React, { Component } from 'react';
import { Input } from 'antd';
import moment from 'moment';
function getQueryStringArgs() {
    //取得查询字符串，并去掉开头'?'
    var qs = location.href.split('?')[1] || '';
    //保存数据的对象
    var args = {},
        //以分割符'&'分割字符串，并以数组形式返回
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    //逐个将每一项添加到args对象中
    for (; i < len; i++) {
        item = items[i].split('=');
        //解码操作，因为查询字符串经过编码的
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        value = item[1];
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}
class CustomComp extends Component {
    scrollDiv;
    state = {
        isSaveOkModalVisible: false,
        code: "",
        fxRecords: [
        ],
    }

    componentDidMount() {
        const {orderCode} = getQueryStringArgs();
        //隐藏滚轮
        const css = `::-webkit-scrollbar { display: none; }`;
        this.head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');

        this.head.appendChild(this.style);

        this.style.type = 'text/css';
        if (this.style.styleSheet) {
            this.style.styleSheet.cssText = css;
        } else {
            this.style.appendChild(document.createTextNode(css));
        }
        console.log(orderCode)
        if (orderCode) {
            const inputs = { "orderCode": orderCode };
            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getAnalyseResult_CCSL",
                params: inputs,
                cb: (res) => {

                    this.setState({ fxRecords: res.result });
                }
            });



        }
    }

    render() {
        return (
            <div style={containerStyle}
                ref={ref => this.scrollDiv = ref}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onScroll={this.handleScroll}
            >
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>&nbsp;&nbsp;分析结果</div>
                </div>
                {this.state.fxRecords.map(section => (
                    <div style={topDivContainerStyle}>
                        <div style={topDescStyle}>
                            {section.name}
                        </div>
                        <div style={topDescStyle}>
                            {section.value}
                        </div>
                    </div>
                ))}

                {/*
                    <div style={btnContainerStyle}>
                        <div style={saveBtnStyle} onTouchStart = {()=>this.handleClick()}> 返 回 </div>
                    </div>
                    */}
            </div>
        );
    }


    handleClick = () => {
        window.top.zhizhiDispatchAppEvent('reqOpenPublicAccount', {
            // 下一个的最上面的标题
            title: '',
            // 下一个页面的URL
            url: `http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_1f3e3bcb743d4105916761718d24db3a?code=${this.state.code} `
        })
    }

    handleTouchStart = (e) => {
        this.startPosition = e.changedTouches[0].clientY;
    }

    handleTouchMove = (e) => {
        console.dir(this.scrollDiv);
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
}



export default CustomComp;

const fontColor = {
    primary: '#1f2e4d',
    secondary: '#49565e',
    red: '#f05656'
};

const backgroundColor = '#f5f6fa';
const borderColor = '#e6e9f0';

const containerStyle = {
    height: '100vh',
    width: '100%',
    overflowY: 'scroll',
    paddingBottom: 45,
};

const paddingDivStyle = {
    height: 16,
    backgroundColor,
};

const topDivContainerStyle = {
    display: 'flex',
}


const topTitleStyle = {
    height: 60,
    lineHeight: '60px',
    fontSize: 14,
    color: fontColor.primary,
    textAlign: 'left',
    flex: 1,
    width: '50%',
    fontWeight: 'bold',
    backgroundColor,
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}

const topDescStyle = {
    height: 60,
    lineHeight: '50px',
    fontSize: 13,
    color: fontColor.secondary,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    width: '50%',
    border: '0px',
    backgroundColor: 'white',
    border: `solid 1px ${borderColor}`,
    borderLeftWidth: '0px',
    borderRightWidth: '0px',
    margin: '-1px 0 0 -1px'
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
    padding: '8px',
    textAlign: 'center'
}

const saveBtnStyle = {
    ...commonBtn,
    color: '#fff',
    backgroundColor: '#2d7df6'
}