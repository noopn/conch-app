import React, { Component } from 'react';
import { Input } from 'antd';
import moment from 'moment';


class CustomComp extends Component {
    scrollDiv;
    state = {
        isSaveOkModalVisible: false,
        code: "",
        fxRecords: [
        ],
        SdjRecords: [
        ],
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

        const code = this.props.location.search.substr(6);
        if (code) {
            this.state.code = decodeURIComponent(code);
            const inputs = { "code": decodeURIComponent(code) };
            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getKgjAnalyseResult_JCYM",
                params: inputs,
                cb: (res) => {
                    this.setState({ fxRecords: res.result });
                }
            });

            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getSdjAnalyseResult_JCYM",
                params: inputs,
                cb: (res) => {
                    this.setState({ SdjRecords: res.result });
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
                    <div style={topTitleStyle}>&nbsp;&nbsp;空干基分析结果</div>
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
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>&nbsp;&nbsp;收到基分析结果</div>
                </div>
                {this.state.SdjRecords.map(section => (
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
            url: `http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_0b994cea2ae142078cc4dd0d24f458bd?code=${this.state.code} `
        })
    }

    handleTouchStart = (e) => {
        this.startPosition = e.changedTouches[0].clientY;
    }

    handleTouchMove = (e) => {
        // console.dir(this.scrollDiv);
        // // 如果弹窗打开的话 外面的不要滚动
        // if (this.state.isAnalysisResultModalVisible) return;
        // const currentPosition = e.changedTouches[0].clientY;
        // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
        // this.startPosition = currentPosition;

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