
import React, { Component } from 'react';
class CustomComp extends Component {
    state = {
        isSaveOkModalVisible: false,
        records: [
            {
                cement_mill: "",
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

        // const inputs = { typeName: typeName };
        scriptUtil.excuteScriptService({
            objName: "cementSampleAutoCode",
            serviceName: "querycementSampleAutoCodeSQLExec3",
            // params: inputs,
            cb: (res) => {
                const records = res.result.data.dataSource.map(item => {
                    return {
                        cement_mill: item.cement_mill,
                        code: item.code, // 分析人
                    }
                })
                this.setState({ records: records });
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
                    <div style={topTitleStyle}>试样编号</div>
                    <div style={topTitleStyle}>水泥磨号</div>
                </div>
                {this.state.records.map(section => (
                    <div style={topDivContainerStyle} >
                        <div style={topDescStyle} onTouchStart={() => { scriptUtil.openPage('http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_3180a0db41594cb48af034e24902e917?code=' + section.code + '&cement_mill=' + section.cement_mill, '_self'); }}>
                            {section.code}
                        </div>
                        <div style={topDescStyle}>
                            {section.cement_mill}
                        </div>
                    </div>
                ))}
            
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
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderTop: `solid 1px ${borderColor}`
}

const commonBtn = {
    width: '100%',
    fontSize: '18px',
    padding: '8px',
    textAlign: 'center'
}

const saveBtnStyle = {
    width: '100%',
    fontSize: '18px',
    padding: '8px',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#2d7df6'
}