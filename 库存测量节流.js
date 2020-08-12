import React, { Component } from 'react';
import { Input, message, Button } from 'antd';

const billType = 'CYSL';

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
        isSubmit: false
    }
    componentDidMount() {
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
    }
    componentWillMount() {
        this.initList();
        this.timeInterval = setInterval(this.getTime, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timeInterval);
    }

    initList = () => {
        scriptUtil.excuteScriptService({
            objName: "KCCL",
            serviceName: "getWareHouse",
            params: {},
            cb: (res) => {
                const dataSections = _.get(res, 'result.list', []);
                this.setState({
                    dataSections
                });
            }
        });
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
    getTime = () => {
        const time = scriptUtil.timestampFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        this.setState({
            time
        });
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
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>
                        {this.state.staffName}
                    </div>
                    <div style={topDescStyle}>
                        {this.state.time}
                    </div>
                </div>
                <div style={titleHead}>
                    量库实测记录
                </div>
                {dataSections.map(section => (
                    <div style={listContainerStyle}>
                        <div style={listItemWrapperStyle} key={section.id}>
                            <div
                                style={listItemStyle}
                                onTouchStart={() => this.handleClick(section, section.name, 'isShowDetail')}
                                onClick={() => this.handleClick(section, section.name, 'isShowDetail')}
                            >
                                <div>{section.name}</div>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        height: 0,
                                        width: 20,
                                        borderLeft: 'solid 6px #3d4966',
                                        borderTop: 'solid 6px transparent',
                                        borderBottom: 'solid 6px transparent',
                                        transitionDuration: '0.3s',
                                        transform: `rotate(${section.isShowDetail ? 90 : 0}deg)`
                                    }}></div>
                            </div>
                            {section.isShowDetail && (
                                <div>
                                    {section.item.map(node => (
                                        <div style={detailItemStyle}>
                                            <div style={detailItemTitleStyle}>
                                                {node.name}
                                            </div>
                                            <Input
                                                key={node.id}
                                                style={detailItemInputStyle}
                                                type="number"
                                                placeholder=""
                                                name="deepMeter"
                                                value={node.deepMeter}
                                                onChange={(e) => this.handleInput(node, e)}
                                            />米
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

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
        this.setState({ dataSections: [...this.state.dataSections] });
    }

    handleSaveClick = () => {
        const list = [];
        const recordingTime = scriptUtil.timestampFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        this.state.dataSections.forEach((x) => {
            x.item.filter(y => y.deepMeter).forEach((y) => {
                list.push(Object.assign(y, {
                    staffCode: this.state.staffCode,
                    staffName: this.state.staffName,
                    recordingTime
                }))
            })
        });
        if (list.length === 0) {
            message.info('未填写记录');
            return;
        }
        this.setState({ isSubmit: true });
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
                    scriptUtil.openPage('/#/runtime-fullscreen/runtime-fullscreen/Page_92337018eaad4ed3bfb1687be5ea78cd', '_self')
                } else {
                    message.error('提交失败');
                }
            }
        });
    }


    // input框的输入
    handleInput = (item, e) => {
        item[e.target.name] = e.target.value;
        this.setState({ dataSections: [...this.state.dataSections] });
    }

    // ----------处理滚动开始, 应该不用动----------
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
const listContainerStyle = {
    display: 'flex',
    minHeight: 62,
    flex: 1
}

const listItemWrapperStyle = {
    borderBottom: `solid 1px ${borderColor}`,
    flex: 1
}

const listItemStyle = {
    cursor: 'pointer',
    padding: '20px 15px',
    color: fontColor.primary,
    fontSize: 16,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
}

const listItemExpandStyle = {
    marginLeft: 'auto',
    height: 0,
    width: 20,
    borderLeft: 'solid 6px #3d4966',
    borderTop: 'solid 6px transparent',
    borderBottom: 'solid 6px transparent',
    transitionDuration: '0.3s'
}

const detailItemStyle = {
    display: 'flex',
    padding: '3px 15px',
    alignItems: 'center',
    borderTop: 'solid 1px #eee',
}

const detailItemInputStyle = {
    width: 100,
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

const volumnTitleWidth = 40;

// 保存按钮
const btnContainerStyle = {
    display: 'flex',
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
    padding: '16px 0',
    backgroundColor: '#2d7df6'
}