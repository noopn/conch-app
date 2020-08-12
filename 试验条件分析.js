import React, { Component } from 'react';
import { DatePicker } from 'antd';
import { Select } from 'antd';
import { Input } from 'antd';
import moment from 'moment';

const typeName = '物检试验条件';
const billType = 'WJSYTJ';
// 日期控件格式
const chemicalName = '物检试验条件';
function getQueryStringArgs() {
    //取得查询字符串，并去掉开头'?'
    var qs = location.href.split('?')[1] || '';
    //保存数据的对象
    var args = {},
        //以分割符'&'分割字符串，并以数组形式返回
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    //逐个将每一项添加到args对象中
    for (; i < len; i++) {
        item = items[i].split('=');
        //解码操作，因为查询字符串经过编码的
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        value = item[1];
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

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
        isSaveOkModalVisible: false,
        //主表数据
        mainInfo: {

        },
        billCode: {
            selctDate: '',
            selectMF: '',
        },
        dataSections: [
            {
                name: chemicalName,
                listName: 'chemicalList',
                data: [],
            }
        ],
    }

    componentDidMount() {
        const { mainInfo } = this.state;
        const serchQuery = getQueryStringArgs();
        this.setState({
            mainInfo: { ...mainInfo, ...serchQuery }
        })

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

        window.addEventListener("resize", function () {
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
        // 获取子表数据
        scriptUtil.excuteScriptService({
            objName: "ZLGL",
            serviceName: "getFinalResult_WJSYTJ",
            params: { date: serchQuery.date, time: serchQuery.time },
            cb: (res) => {
                if (res.code != 200) {
                    this.showDialogue("数据获取异常");
                    return false;
                }
                const chemicalList = res.result.map(item => {
                    return {
                        ...item,
                        isShowDetail: true, // 是否展开
                    }
                })
                // 赋值
                this.chemicalList = chemicalList;
                // 渲染页面
                this.setState({ dataSections: [...this.state.dataSections] });
            }
        });
    }


    render() {
        const { mainInfo, dataSections } = this.state;
        return (
            <div style={containerStyle}
                ref={ref => this.scrollDiv = ref}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onScroll={this.handleScroll}
            >
                {dataSections.map(section => (
                    <div style={listContainerStyle} key={section.name}>
                        <div style={listTitleStyle}>
                            <div style={listTitleTextStyle}>
                                {section.name}
                            </div>
                        </div>
                        <div style={listItemContainerStyle}>
                            {section.data.map(item => (
                                <div style={listItemWrapperStyle} key={item.id}>
                                    <div style={listItemStyle} onTouchEnd={() => this.handleClick(section, item.name, 'isShowDetail')}>
                                        <div>{item.showName} </div>
                                        <div
                                            style={{
                                                ...listItemExpandStyle,
                                                transform: `rotate(${item.isShowDetail ? 90 : 0}deg)`
                                            }}></div>
                                    </div>
                                    {item.isShowDetail && (
                                        <div>
                                            {item.list.map((node, index) => (
                                                <div style={detailItemStyle}>
                                                    <div style={detailItemTitleStyle}>
                                                        {node.showName}
                                                    </div>
                                                    <div>
                                                        {node.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // 获取化学成分列表, 应该不用动
    get chemicalList() {
        return this.state.dataSections.find(section => section.name === chemicalName) || [];
    }
    // 设置化学成分列表, 应该不用动
    set chemicalList(arr) {
        this.state.dataSections.find(section => section.name === chemicalName).data = arr;
    }

    // 点击展开/隐藏 输入框等详情, 应该不用动
    handleClick = (section, name, field = 'isShowDetail') => {
        const item = this[section.listName].data.find(item => item.name === name);
        item[field] = !item[field];
        this.setState({ dataSections: [...this.state.dataSections] });
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

const containerStyle = {
    height: '100vh',
    width: '100%',
    overflowY: 'scroll',
    paddingBottom: 45,
};
const backgroundColor = '#f5f6fa';
const borderColor = '#e6e9f0';
const fontColor = {
    primary: '#1f2e4d',
    secondary: '#49565e',
    red: '#f05656'
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
    width: '33.33%',
    fontWeight: 'bold',
    backgroundColor,
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}

const topDescStyle = {
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
    margin: '-1px 0 0 -1px',
    padding: '0 7px'
}


const commonStyle = {
    width: '90%'
}

const listContainerStyle = {
    display: 'flex',
    minHeight: 130
}

const listTitleStyle = {
    width: 40,
    backgroundColor,
    color: fontColor.primary,
    position: 'relative',
    borderRight: `solid 1px ${borderColor}`,
    borderBottom: `solid 1px ${borderColor}`,
}

const listTitleTextStyle = {
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}

const listItemContainerStyle = {
    flex: 1,
}

const listItemWrapperStyle = {
    borderBottom: `solid 1px ${borderColor}`,
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
    borderRadius: '4px'
}

const detailItemTitleStyle = {
    fontSize: 12,
    color: fontColor.secondary,
    width: '60%',
    marginRight: 'auto'
}

const volumnStyle = {
    display: 'flex',
}

const volumnTitleWidth = 40;
const volumnContainerStyle = {
    position: 'relative',
    width: volumnTitleWidth,
    borderTop: `solid 1px ${borderColor}`,
    borderRight: `solid 1px ${borderColor}`
}
const volumnTitleTextStyle = {
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}
const volumnDetailItemTitleStyle = {
    fontSize: 12,
    color: fontColor.secondary,
    width: `calc(60% - ${volumnTitleWidth}px)`,
    marginRight: 'auto'
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
const analysisResultStyle = {
    ...commonBtn,
    color: '#2d7df6',
    backgroundColor: '#fff',
}