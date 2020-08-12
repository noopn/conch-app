import React, { Component } from 'react';
// import { Row, Col } from 'antd';

const typeName = 'CMSN';
class CustomComp extends Component {
    state = {
        isSaveOkModalVisible: false,
        records: [
            {
                createTime: "",
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
            objName: "	cementSampleAutoCode",
            serviceName: "querycementSampleAutoCodeSQLExec4",
            params: inputs,
            cb: (res) => {
                const records = res.result.data.dataSource.map(item => {
                    return {
                        createTime: item.createTime,
                        code: item.code,
                        cement_mill:item.cement_mill,
                        cementType:item.cementType 
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
                    <div style={topTitleStyle}>生产日期</div>
                </div>
                {this.state.records.map(section => (
                    <div style={topDivContainerStyle} >
                        <div style={topDescStyle}
                            onTouchEnd={() => this.handleListItemClick(section)}
                        >
                            {section.code}
                        </div>
                        <div style={topDescStyle}>
                            {section.createTime}
                        </div>
                    </div>
                ))}
                {/* <div style={btnContainerStyle}>
                    <div style={saveBtnStyle} onTouchStart={() => this.handleNewClick()}>新建样单</div>
                </div> */}
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


    handleListItemClick = (section) => {
        console.log(section)
        scriptUtil.excuteScriptService({
            objName: "ZLFXObj1",
            serviceName: "queryZLFXObj1SQLExec1",
            params: { typeName },
            cb: (res) => {
                console.log(res);
                res.result.data.dataSource.find(item => item.code === section.code) ?
                    scriptUtil.openPage(`#/runtime-fullscreen/runtime-fullscreen/Page_e68eca8464994ad3971bd39466cc91d5?code=${section.code}&cement_mill=${section.cement_mill}&cementType=${section.cementType}&createTime=${section.createTime}`, '_self') ://修改页面
                    scriptUtil.openPage(`#/runtime-fullscreen/runtime-fullscreen/Page_082edcf938de4cf4b1f767d00e929e94?code=${section.code}&cement_mill=${section.cement_mill}&cementType=${section.cementType}&createTime=${section.createTime}`, '_self')//新建页面
            }
        });
        //scriptUtil.openPage('url','_self')a
        // scriptUtil.openPage('http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_f563688528c24a6da8e6e42d17f3e799', '_self')


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
    // display: 'flex',
    // width: '100%',
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