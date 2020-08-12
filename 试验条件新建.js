import React, { Component } from 'react';
import { Button } from 'antd';
import moment from 'moment';

const typeName = '物检试验条件';
const billType = 'WJSYTJ';

// 日期控件格式
const dateFormat = 'YYYY-MM-DD';

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
        submiting: false,
        //主表数据
        mainInfo: {
            typeName: '',//试样单类别            
            staffName: '', // 分析人
            staffCode: '',
            scDate: '', // 生产日期
            fxDate: '', // 分析日期
            cqhyNum: '',
            cqhyName: '',
            code: '',
            message: ''
        },

        billCode: {
            selctDate: '',
            selectMF: '',
        },
        //船前后样
        CQHYObjs: [
            {
                name: '',
                showName: '',
            }
        ],
        //化验项
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
        if (!serchQuery.date || !serchQuery.time) {
            this.showDialogue("该单据不存在");
            return false;
        }
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

        scriptUtil.getUserInfo(user => {
            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getUsersSessionInfo",
                params: { "username": user.userInfo.username },
                cb: (res) => {
                    const temp = {
                        typeName: typeName,
                        staffName: res.result.userInfo.staffName, // 分析人
                        staffCode: res.result.userInfo.staffCode, // 分析人id
                        scDate: moment().clone().add(-2, 'days').format('YYYY-MM-DD'), // 生产日期
                        fxDate: moment().format('YYYY-MM-DD'), // 分析date
                    }
                    const selectDate = moment().clone().add(-2, 'days').format('YYYY-MM-DD');
                    this.setState({ mainInfo: Object.assign(this.state.mainInfo, temp) });
                    this.setState({ billCode: selectDate });
                }
            });
        });

        scriptUtil.excuteScriptService({
            objName: "ZLGL",
            serviceName: "getMetaInfo_wjsytj",
            params: { "type": billType },
            cb: (res) => {
                const chemicalList = res.result.map(item => {
                    return {
                        ...item,
                        isShowDetail: false, // 是否展开
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
                {this.state.isSaveOkModalVisible && (
                    <div style={saveOkModalOutMostContainer}>
                        <div style={saveOkModalContainer}>
                            <img style={saveOkImgStyle} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAABU5JREFUaAXVms1vFVUYxlvFxG9DRROigsZIYw1RmhA3IigVE/foQhN2ysqdiX+AC13UhQu3XbBEiJJoRAuUhRs1EU00Clo/AtEgjaExUSzk+vvNPQfmTi7tzJmZW+6TPD1nZs553ve9c76noyMNotPpjCO3Az4GN8EH4B3wVij+hufhz/AkPAHnRkdHfyC9NkAQk3AanoapsK4ak3WjGk0VwPhW6r4Fn8ppLJGfCzxD+nuOZEfW53gPeetuhzfAiKNkXuetfRFvtJoSyDh8D0acJ7MP7oa3VzVuHfg8VEOtiP1kbLbtAPE10GaxBMW/0Os7m7KoVtBUW2hLG2uaspHpIDgGj0BxCc7A+xo1khNDe0OwoS0xC8dyRdKzCE3AH6E4C7elq1Wrqa1gkyTzYaKaQqE0Is/ARdXACbixUKT1S23Cr6Gwj00lGaWibyYGc4D8LUlCDVTSNtQHYVDV3hQV7DOxmSmUPLw3EE8moQ/wIBT6Vq5PUdDRLA4ANrNVezPFH0NfYGx+DhQrj34UcpgUDgAD7zPFIIrX+hR8I+lMF5/3XFPASdOx3+FyYKNZjxMlLvQt+KivV598eRhXADMldFe1CL7OQLG/ryM82Jo97q4AWps0+xpPuImvTr5xReG6shc8jAPB8u2yt9qqXuFz7O9HehzhwSQUjvGNrc16jLRwoa/BZ5LOFk1cF+y8GNJDLNsXQv6aT4Kvh4KjL112mOji5mz35ZsDzuCDfaJy36WOWw9xOnOZjEO1+A9W3s80ETd2d8J/YNepCqL6DPVdjNvkdoT67u0XK2g1UhQnnkDoA3gj/LiqaPD5eKi33YA80BBz2d8B/iEYh9sPocur9+FemIJjodIWA4ozrWcAAwPBPIqxw9Bm7pt5gV/7ImkKou8PjSA8D8WuFKWUOth6GLpWFEfhTSk6sQ71dykE5g1oIct2OptjgTZTbD0IzwSbn5HGM7tks2hsDnoLBnQhXKyrqkg9h9o34L1l6obyv5KKL6GHkLWBzjoFwYW6Ab3W1el8S7qsczxfD0+F8t+QltuglQgXrZ6AkpscQnfB2AcPk++74QrlviMV38O7S/hZugh6scmdqz0oIObZg2tA8W7RC+6the58xU/QE9NGgWbPoBBX2XtSrSD4LLwIxatRh7yz+OfeBL/B++OzJlN090Ax6zzkVwCR/MsxfzifxEDeRvg5eDP3nDSdPP+AOyn3C2kbiIPSSZvcK1B8UtcSGu9kSt3jL4dk8Sd8pK72cvXR/1RD4GUDamxxitb18CMY8ReZbJ+ynEN1nqGfX5x2Vz3cbGz7gNZt0H5zDj5ex9kydbHRu32wEjenodhXRmSlMuh4KOjquXXoMxRXjg64GOYt+GIWTrFpczMO31cibf33rWfAtxKC6T0kUZYH+WOsDfVMtV8bf11HXv0YKwTlZ0Ax/AeNISCH8GE4Cn4SPy8FX+MGtX+zoFBsl2fJb+xfavXu6hPUN7Fyf6dQ/nOKny6G+3NKaHpjBOJHJXEADu8Hr9iYCGICxm2BQa3am9I2PAiFPlX7JJkLaioIKGTzG3if0mawTZIFMxX9S0oR8U3F5mdn3JYklFBJWzAOAPqQ9maKthGyT81C4XA5A1ubfNUONrQltN3YGUQWH4KOfg7pzlPCWdrrxj6/qBU04wpAW9roe1ZR/OGTrhF38o0rCrJZu3bF6zK+8mG/dUJdNeJCk2xmY/lJs08EycMxBt1avwmfzukukffg/Bgcjn8vyzmfZQlsEtos4iaRbGVYV43au9vkN1QMzGscKvsvmvMUPwW/gsc5PGnsXzT/B1OxBjEc1WO5AAAAAElFTkSuQmCC" />
                            <div style={saveOkTextStyle}>{mainInfo.message}</div>
                        </div>
                    </div>
                )}
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>日期</div>
                    <div style={topTitleStyle}>时间</div>
                    <div style={topTitleStyle}>操作人</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>{mainInfo.date}</div>
                    <div style={topDescStyle}>{mainInfo.time}</div>
                    <div style={topDescStyle}>{mainInfo.staffName}</div>

                </div>
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
                                    <div style={listItemStyle} onTouchStart={() => this.handleClick(section, item.name, 'isShowDetail')}>
                                        <div>{item.showName} </div>
                                        <div
                                            style={{
                                                ...listItemExpandStyle,
                                                transform: `rotate(${item.isShowDetail ? 90 : 0}deg)`
                                            }}></div>
                                    </div>
                                    {item.isShowDetail && (
                                        <div>
                                            {item.list.map(node => (
                                                <div style={detailItemStyle}>
                                                    <div style={detailItemTitleStyle}>
                                                        {node.showName}
                                                    </div>
                                                    <input style={detailItemInputStyle} type={node.name.substr(5) == 'BZ' ? 'text' : 'number'}
                                                        name="value"
                                                        value={node.value}
                                                        onChange={(e) => this.handleInput(node, e)}
                                                    />
                                                    <span style={showUnit}>{node.unit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div style={btnContainerStyle}>
                    <Button style={saveBtnStyle} onTouchStart={() => this.saveInfo()} disabled={this.state.submiting}> 保 存 </Button>
                </div>
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

    //保存主子表
    saveInfo = () => {
        const mainInfo = this.state.mainInfo;
        const struct = {
            "date": mainInfo.date,
            "time": mainInfo.time,
            'staffName': mainInfo.staffName,
            "InstrumentShow1_Num1": null,
            "InstrumentShow2_Num1": null,
            "InstrumentShow1_Num2": null,
            "InstrumentShow2_Num2": null,
            "psychrometer1_Num1": null,
            "psychrometer2_Num1": null,
            "psychrometer1_Num2": null,
            "psychrometer2_Num2": null,
            "PXS_Humidity": null,
            "PXS_Temperature": null,
            "CXS_Temperature": null,
            "CXS_Humidity": null,
            "YHCSWD1_Num1": null,
            "YHCSWD2_Num1": null,
            "YHCSWD3_Num1": null,
            "YHCSWD1_Num2": null,
            "YHCSWD2_Num2": null,
            "YHCSWD3_Num2": null,
            "HWCWD": null
        }
        //赋值到新的结构中  
        this.state.dataSections[0].data.map(objItem => {
            objItem.list.map(proItem => {
                if (proItem.value) {
                    console.log(proItem, proItem.name, proItem.value)
                    struct[proItem.name] = proItem.value
                }//proItem.name为xxx_CY
                else {
                    console.log(proItem, proItem.name, proItem.value, 'else');
                    (proItem.value) ? eval("struct." + proItem.name + "=\"" + proItem.value + "\"") : eval("struct." + proItem.name + " = null");
                }
            });
        })
        this.setState({ submiting: true })
        scriptUtil.excuteScriptService({
            objName: "ZLFXObj5",
            serviceName: "AddDataTableEntry",
            params: {
                params: JSON.stringify(struct)
            },
            cb: (res) => {
                if (res.result) {
                    this.showDialogue("保存成功");
                    window.setTimeout(() => {
                        scriptUtil.openPage('http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_003c44d6368842c285b7510abf8f62c5', '_self');
                        this.setState({ submiting: false })
                    }, 2000)
                } else {
                    this.showDialogue("保存失败");
                }
                return res.result;
            }
        });
    }

    showDialogue = (message) => {
        this.state.mainInfo.message = message;
        // 这里只是保存成功后, 显示保存成功的弹窗
        this.setState({ isSaveOkModalVisible: true }, () => {
            // 2秒后隐藏弹窗, 时间可以自己改
            setTimeout(() => {
                this.setState({ isSaveOkModalVisible: false })
            }, 2000)
        })
    }

    // input框的输入
    handleInput = (item, e) => {
        console.log(item, e.target.name, e.target.value)
        item[e.target.name] = e.target.value;
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

// 保存弹窗
const saveOkModalOutMostContainer = {
    height: '100vh',
    width: '100%',
    position: 'fixed',
    zIndex: 1000000,
    top: 0,
    left: 0
}

const saveOkModalContainer = {
    width: 227,
    height: 227,
    zIndex: 1000000,
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
}

const saveOkImgStyle = {
    marginTop: '55px'
}

const saveOkTextStyle = {
    fontSize: 16,
    color: '#fff',
    marginTop: 25,
    borderRight: 4,
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
    width: 70,
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
const showUnit = {
    display: 'inlie-block',
    fontWeight: 'bold',
    margin: '0 6px'
}