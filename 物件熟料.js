import React, { Component } from 'react';
// import { Row, Col } from 'antd';

const typeName = 'WJSL';
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
            objName: "cementSampleAutoCode",
            serviceName: "querycementSampleAutoCodeSQLExec2",
            params: inputs,
            cb: (res) => {
                const records = res.result.data.dataSource.map(item => {
                    return {
                        createTime: item.createTime,
                        code: item.code, // 分析人
                        orderCode: item.orderCode
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
                onTouchMove={this.handleTouchMove}
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

    handleTouchMove = (e) => {
        console.dir(this.scrollDiv);
        // 如果弹窗打开的话 外面的不要滚动
        const currentPosition = e.changedTouches[0].clientY;
        // 部分手机没有scrollBy
        // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
        const scrollTop = this.scrollDiv.scrollTop;
        this.scrollDiv.scrollTop = scrollTop + this.startPosition - currentPosition;
        this.startPosition = currentPosition;
        this.hasMove = true;
    }



    handleListItemClick = (section) => {
        console.log(section)
        scriptUtil.excuteScriptService({
            objName: "ZLFXObj6",
            serviceName: "queryZLFXObj6SQLExec1",
            params: { typeName },
            cb: (res) => {
                console.log(!!res.result.data.dataSource.find(item => item.orderCode === section.orderCode))
                !!res.result.data.dataSource.find(item => item.orderCode === section.orderCode) ?
                    scriptUtil.openPage(`http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_349da7b4cf2b4cf2864d4a3660466b62?code=${section.code}&orderCode=${section.orderCode}&createTime=${section.createTime}`, '_self') ://修改页面
                    scriptUtil.openPage(`http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_889cc76a3f614e02aa65e435fd53adc3?code=${section.code}&orderCode=${section.orderCode}&createTime=${section.createTime}`, '_self')//新建页面
            }
        });
        //scriptUtil.openPage('url','_self')
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