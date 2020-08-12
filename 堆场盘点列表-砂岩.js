import React, { Component } from 'react';
import { DatePicker, Button } from 'antd';
import moment from 'moment';

class CustomComp extends Component {
    state = {
        serchDate: moment().format('YYYY-MM-DD'),
        data: []
    }

    componentDidMount() {
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

        scriptUtil.excuteScriptService({
            objName: "KCCL",
            serviceName: "GetMineStockListByCategory",
            params: { category: '砂岩' },
            cb: (res) => {
                console.log(res);
                this.setState({ data: res.result.data.dataSource });
            }
        });
    }
    render() {
        return (
            <div
                style={containerStyle}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onScroll={this.handleScroll}
                ref={ref => this.scrollDiv = ref}
            >
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>堆场</div>
                    <div style={topTitleStyle}>日期</div>
                </div>
                {this.state.data.map(section => (
                    <div style={topDivContainerStyle}>
                        <div style={topDescStyle}
                            onTouchStart={() => scriptUtil.openPage(`#/runtime-fullscreen/runtime-fullscreen/Page_fb6918ff820c4393a5cd76df7f2daca5?date=${section.recordtime}&code=${section.whcode}`, '_self')}
                        >
                            {section.whname}
                        </div>
                        <div style={topDescStyle}>
                            {section.recordtime.split(' ')[0]}
                        </div>
                    </div>
                ))}
                <div style={topDivContainerStyle}></div>
                <div style={btnContainerStyle}>
                    <Button style={saveBtnStyle} onTouchStart={()=>scriptUtil.openPage(`#/runtime-fullscreen/runtime-fullscreen/Page_f25d17beb6974d99a2ae23ec1776add6`, '_self')}> 新增 </Button>
                </div>
            </div>
        );
    }

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
    height: '100%',
    width: '100%',
    paddingBottom: 45,
    overflowY: 'scroll',
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
    textAlign: 'center',
    width: '100%',
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
    width: '100%',
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
    lineHeight: '50px',
    height: '50px',
    textAlign: 'center'
}

const saveBtnStyle = {
    ...commonBtn,
    color: '#fff',
    backgroundColor: '#2d7df6'
}

// 搜索头
const serchHeader = {
    margin: '20px 10px',
    overflow: 'hidden'
}

const serchHeaderCenter = {
    width: '60%',
    margin: 'auto'
}

const serchHeaderRight = {
    float: 'right',
    width: '20% '
}

const serchDatePicker = {
    width: '100%'
}

const serchButton = {
    width: '100%'
}