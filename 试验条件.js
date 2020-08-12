import React, { Component } from 'react';
import { DatePicker, Button } from 'antd';
import moment from 'moment';

class CustomComp extends Component {
    state = {
        serchDate: moment().format('YYYY-MM-DD'),
        records: [
            {
                defaultDate: "",
                defaultTime: "",
            }
        ]
    }
    // getDefaultList = () => {
    //     return 
    // }
    timeStamp = ['2:00', '6:00', '10:00', '14:00', '18:00', '22:00'];
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
            objName: "ZLGL",
            serviceName: "getWJSYTJList",
            params: { date: this.state.serchDate },
            cb: (res) => {
                const records = this.timeStamp.map(stampTime => {
                    return {
                        ...res.result.find(item => item.map.time === stampTime),
                        defaultDate: this.state.serchDate,
                        defaultTime: stampTime, // 分析人
                    }
                })
                this.setState({ records: records });
            }
        });
    }
    handleDateChange = (date, dateString) => {
        this.setState({
            serchDate: dateString
        })
        scriptUtil.excuteScriptService({
            objName: "ZLGL",
            serviceName: "getWJSYTJList",
            params: { date: dateString },
            cb: (res) => {
                const records = this.timeStamp.map(stampTime => {
                    return {
                        ...res.result.find(item => item.map.time === stampTime),
                        defaultDate: this.state.serchDate,
                        defaultTime: stampTime, // 分析人
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
                <div style={serchHeader}>
                    <div style={serchHeaderCenter}>
                        <DatePicker
                            style={serchDatePicker}
                            defaultValue={moment(this.state.serchDate)}
                            onChange={this.handleDateChange}
                        />
                    </div>
                </div>

                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>日期</div>
                    <div style={topTitleStyle}>时间</div>
                </div>
                {this.state.records.map(section => (
                    <div style={topDivContainerStyle}>
                        <div style={topDescStyle}
                            onTouchStart={() => {
                                _.get(section, 'map.time') ?
                                    scriptUtil.openPage(`http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_f783086dd9f54a139e740a4a0f0c5230?date=${section.map.date}&time=${section.map.time}`, '_self') :
                                    scriptUtil.openPage(`http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_5438bab9f6eb45448bdc47c0b290d411?date=${section.defaultDate}&time=${section.defaultTime}`, '_self');

                            }}>
                            {section.defaultDate}
                        </div>
                        <div style={topDescStyle}>
                            {section.defaultTime}
                        </div>
                    </div>
                ))
                }
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