import React, { Component } from 'react';

const typeName = 'RYMF';

class CustomComp extends Component {
    state = {
        isSaveOkModalVisible: false,
        records: [
            {
                scDate: "",
                code: "",
            }
        ]
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

        const inputs = { typeName: typeName };
        scriptUtil.excuteScriptService({
            objName: "ZLFXObj1",
            serviceName: "queryZLFXObj1SQLExec",
            params: inputs,
            cb: (res) => {
                const records = res.result.data.dataSource.map(item => {
                    return {
                        scDate: item.scDate,
                        code: item.code, // 分析人
                    }
                })
                this.setState({ records: records });
            }
        });

    }

    render() {
        return (
            <div style={containerStyle}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onScroll={this.handleScroll}
                ref={ref => this.scrollDiv = ref}
            >
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>试样编号</div>
                    <div style={topTitleStyle}>生产日期</div>
                </div>
                {this.state.records.map(section => (
                    <div style={topDivContainerStyle} >
                        <div style={topDescStyle} onTouchStart={() => { scriptUtil.openPage('#/runtime-fullscreen/runtime-fullscreen/Page_dda448b8b48946dd996afe9e70f41f14?code=' + section.code, '_self'); }}>
                            {section.code}
                        </div>
                        <div style={topDescStyle}>
                            {section.scDate}
                        </div>
                    </div>
                ))}

                <div style={btnContainerStyle}>
                    <div style={saveBtnStyle} onTouchStart={() => this.handleNewClick()}>新建样单</div>
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


    handleNewClick = () => {

        // 下一个的最上面的标题
        title: '',
            // 下一个页面的URL
            scriptUtil.openPage('#/runtime-fullscreen/runtime-fullscreen/Page_82768d3c7bae469abb640bcd5a9ef002', '_self')


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
    textAlign: 'center',
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