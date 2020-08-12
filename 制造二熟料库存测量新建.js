import React, { Component } from 'react';
import { Input, message, Button, Select } from 'antd';


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
        dataSections: [],
        staffName: '',
        staffCode: '',
        time: '',
        isSubmit: false,
        team: '白班'
    }
    componentDidMount() {

        // scriptUtil.request('/api/app/manager',{
        //   method:'GET'
        // }).then( (data) => {alert(data.list[0].description)} );

        window.addEventListener("resize", function () {
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
        _.map(['touchstart'], (event) => {
            this.selector.addEventListener(event, (e) => {
                e.stopPropagation();
            });
        });
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
            serviceName: "getWareHouseKiln",
            params: { category: '熟料库', factory: '制造二' },
            cb: (res) => {
                this.setState({
                    dataSections: res.result.list[0].item,
                    category: res.result.list[0].name
                });
            }
        });

    }
    componentWillMount() {
        this.initList();
        this.timeInterval = null;
        scriptUtil.excuteScriptService({
            objName: "KCCL",
            serviceName: "getTime",
            cb: res => {
                let timeStamp = new Date().getTime();
                if (res.code === '200') {
                    timeStamp = res.result.list
                }
                let time = scriptUtil.timestampFormat(timeStamp, 'YYYY-MM-DD HH:mm:ss');
                this.setState({ time });
                this.timeInterval = setInterval(() => {
                    time = scriptUtil.timestampFormat(timeStamp = +timeStamp + 1000, 'YYYY-MM-DD HH:mm:ss');
                    this.setState({ time });
                }, 1000);

            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.timeInterval);
    }

    initList = () => {
        scriptUtil.getUserInfo(user => {
            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getUsersSessionInfo",
                params: { "username": user.userInfo.username },
                cb: (res) => {
                    this.setState({
                        staffName: res.result.userInfo.staffName,
                        staffCode: res.result.userInfo.staffCode
                    });
                }
            });
        });
    }
    onTeamChange = (team) => {
        this.setState({
            team
        })
    }
    render() {
        const { dataSections } = this.state;
        return (
            <div style={containerStyle}
                ref={ref => this.scrollDiv = ref}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onScroll={this.handleScroll}
            >
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>填报人</div>
                    <div style={topTitleStyle}>填报时间</div>
                    <div style={topTitleStyle}>班组</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>
                        {this.state.staffName}
                    </div>
                    <div style={topDescStyle}>
                        {this.state.time}
                    </div>
                    <div style={topDescStyle} ref={el => this.selector = el}>
                        <Select
                            value={this.state.team}
                            onChange={this.onTeamChange}
                        >
                            {['白班', '中班', '夜班'].map(val => <Select.Option value={val}>{val}</Select.Option>)}
                        </Select>
                    </div>
                </div>
                <div style={titleHead}>
                    量库实测记录
                </div>
                {
                    dataSections.map(node =>
                        <div style={detailItemStyle}>
                            <div style={detailItemTitleStyle}>
                                {node.name}
                            </div>
                            <Input
                                style={detailItemInputStyle}
                                type="number"
                                placeholder=""
                                name="deepMeter"
                                value={node.deepMeter}
                                onChange={(e) => this.handleInput(node, e)}
                            />
                            米
                    </div>)
                }

                <div style={btnContainerStyle}>
                    <Button
                        style={saveBtnStyle}
                        disabled={this.state.isSubmit}
                        // onTouchStart={_.throttle(this.handleSaveClick, 1000)}
                        onClick={() => this.handleSaveClick()}
                    > 提 交 </Button>
                </div>
            </div>
        );
    }

    // 点击展开/隐藏 输入框等详情, 应该不用动
    handleClick = (section, name, field = 'isShowDetail') => {
        const item = this.state.dataSections.find(x => x.name === name);
        item[field] = !item[field];
        this.setState({ dataSections: this.state.dataSections.concat([]) });
    }

    handleSaveClick = () => {
        const list = [];
        const recordingTime = scriptUtil.timestampFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        this.state.dataSections.forEach((x) => {
            delete x.dataCategory;
            delete x.expression;
            list.push(Object.assign(x, {
                deepMeter: x.deepMeter || '0',
                staffCode: this.state.staffCode,
                staffName: this.state.staffName,
                recordingTime,
                team: this.state.team,
                category: this.state.category,
                factory: '制造二',
            }))
        });
        this.setState({ isSubmit: true });
        scriptUtil.excuteScriptService({
            objName: "KCCL",
            serviceName: "getKilnList",
            params: { category: '熟料库', factory: '制造二' },
            cb: (res) => {
                if (!res.result.some(item => item.recordingTime.split(' ')[0] === this.state.time.split(' ')[0] && item.category === this.state.category && item.team === this.state.team)) {
                    scriptUtil.excuteScriptService({
                        objName: "MeasureStock",
                        serviceName: "AddDataTableEntries",
                        params: {
                            list
                        },
                        cb: (res) => {
                            this.setState({ isSubmit: false })
                            if (res.code === '200') {
                                message.success('提交成功');
                                scriptUtil.openPage('/#/runtime-fullscreen/runtime-fullscreen/Page_00def94350324b2c87a03dbcabc96a3a', '_self')
                            } else {
                                message.error('提交失败');
                            }
                        }
                    });
                } else {
                    this.setState({ isSubmit: false });
                    message.warn('单据已存在');
                }
            }
        });

    }


    // input框的输入
    handleInput = (item, e) => {
        if (e.target.value && !/^[1-9][0-9]*(\.[0-9]{1,2})?$/.test(e.target.value)) {
            return false;
        };
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
const backgroundColor = '#f5f6fa';
const titleHead = {
    height: '50px',
    lineHeight: '50px',
    fontSize: '16px',
    border: '1px solid rgb(230, 233, 240)',
    background: '#F7F9FC',
    fontWeight: 'bold',
    padding: '0 10px',
    marginTop: '15px'
}
const containerStyle = {
    height: '100vh',
    width: '100%',
    overflowY: 'hidden',
    paddingBottom: 60,
};
const borderColor = '#e6e9f0';
const fontColor = {
    primary: '#1f2e4d',
    secondary: '#49565e',
    red: '#f05656'
};
const topTitleStyle = {
    height: 60,
    lineHeight: '60px',
    fontSize: 14,
    color: fontColor.primary,
    textAlign: 'center',
    flex: 1,
    width: '33.33%',
    fontWeight: 'bold',
    backgroundColor,
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}
const topDescStyle = {
    position: 'relative',
    height: 50,
    lineHeight: '50px',
    fontSize: 12,
    color: fontColor.secondary,
    textAlign: 'center',
    flex: 1,
    width: '33.33%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}
const topDivContainerStyle = {
    display: 'flex',
}

const detailItemStyle = {
    display: 'flex',
    padding: '3px 15px',
    alignItems: 'center',
    margin: ' 20px 10px',
}

const detailItemInputStyle = {
    width: 150,
    color: fontColor.secondary,
    textAlign: 'center',
    border: `solid 1px ${borderColor}`,
    borderRadius: '4px',
    marginRight: 5
}

const detailItemTitleStyle = {
    fontSize: 12,
    color: fontColor.secondary,
    width: '60%',
    marginRight: 'auto'
}


// 保存按钮
const btnContainerStyle = {
    height: '50px',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    borderTop: `solid 1px ${borderColor}`
}
const saveBtnStyle = {
    width: '100%',
    fontSize: '18px',
    textAlign: 'center',
    color: '#fff',
    fontSize: '20px',
    backgroundColor: '#2d7df6',
    height: '50px',
    lineHeight: '50px'
}