import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';
import moment from 'moment';

class CustomComp extends Component {
    state = {
        isSaveOkModalVisible: false,
        cenmentMillData: [],
        cenmentMillByID: [],
        cenmentMill: '',
        startTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        records: [],
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
            objName: "SCGL",
            serviceName: "getCementMill",
            cb: (res) => {
                const cenmentMill = _.get(res, 'result[0].name');
                this.setState({
                    cenmentMillData: _.reduce(res.result, (obj, item) => { obj[item.name] = { ...item, id: item.name }; return obj }, {}),
                    cenmentMillByID: _.map(res.result, (item) => item.name),
                    cenmentMill,
                })
            }
        });


    }
    onChange = (key, val) => {
        this.setState({ [key]: val })
    }

    componentDidUpdate(perProps, perState) {
        const { cenmentMill, cenmentMillData, startTime, endTime } = this.state;
        if (
            cenmentMill &&
            cenmentMillData &&
            startTime &&
            endTime &&
            (perState.cenmentMill !== cenmentMill ||
                perState.cenmentMillData !== cenmentMillData ||
                perState.startTime !== startTime ||
                perState.endTime !== endTime
            )
        ) {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "getMaterialRecord",
                params: { name: cenmentMillData[cenmentMill].value, startTime, endTime },
                cb: (res) => {
                    this.setState({
                        records: res.result.list
                    })
                }
            });
        }
    }

    cenmentMillChange = (cenmentMill) => {
        this.setState({
            cenmentMill
        })
    }

    render() {
        const { cenmentMillByID, cenmentMillData, cenmentMill } = this.state;
        return (
            <div
                style={containerStyle}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onScroll={this.handleScroll}
                ref={ref => this.scrollDiv = ref}
            >
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>水泥磨</div>
                    <div style={topTitleStyle}>开始时间</div>
                    <div style={topTitleStyle}>结束时间</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>
                        <Select
                            style={pickerStyle}
                            value={cenmentMill}
                            onChange={this.cenmentMillChange}
                        >
                            {
                                cenmentMillByID
                                    .map(id => cenmentMillData[id])
                                    .map(item => <Select.Option value={item.id}>{item.value}</Select.Option>)
                            }
                        </Select>
                    </div>
                    <div style={topDescStyle}>
                        <DatePicker style={pickerStyle} defaultValue={moment()} format='YYYY-MM-DD' onChange={(d, dstr) => this.onChange('startTime', dstr)} />
                    </div>
                    <div style={topDescStyle}>
                        <DatePicker style={pickerStyle} defaultValue={moment()} format='YYYY-MM-DD' onChange={(d, dstr) => this.onChange('endTime', dstr)} />
                    </div>
                </div>

                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>水泥磨</div>
                    <div style={topTitleStyle}>皮带秤</div>
                    <div style={topTitleStyle}>物料</div>
                    <div style={topTitleStyle}>切换时间</div>
                </div>
                {this.state.records.map(section => (
                    <div style={topDivContainerStyle} >
                        <div style={topDescStyle}>
                            {section.NAME}
                        </div>
                        <div style={topDescStyle}>
                            {section.tagName}
                        </div>
                        <div style={topDescStyle}>
                            {section.inputMaterialName}
                        </div>
                        <div style={topDescStyleDate}>
                            {section.recordingTime.split(' ')[0] + '\t' + section.recordingTime.split(' ')[1]}
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
    lineHeight: '60px',
    fontSize: '12px',
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
const topDescStyleDate = {
    height: 60,
    padding: '10px 0',
    lineHeight: '24px',
    fontSize: '12px',
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
const pickerStyle = {
    width: '90%'
}