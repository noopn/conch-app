import React, { Component } from 'react';
import { Input } from 'antd';

// 日期控件格式
const dateFormat = 'YYYY-MM-DD';

const chemicalName = '化学成分';

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
            typeName: '',//试样单类别            
            staffName: '', // 分析人
            scDate: '', // 生产日期
            fxDate: '', // 分析日期
            yaoName: '',
            code: '',
            message: ''
        },
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
        window.addEventListener("resize", function() {
            if(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                window.setTimeout(function() {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
        const code = this.props.location.search.substr(6);
        if (code) {
            this.state.mainInfo.code = code;
            const inputs = '{"code":"' + code + '"}';
            scriptUtil.excuteScriptService({
                objName: "ZLFXObj1",
                serviceName: "getDataTableScript",
                params: { inputs: inputs },
                cb: (res) => {
                    if (!res.result.map.list.empty) {
                        const obj = res.result.map.list.list[0].map;
                        const temp = {
                            code: code,
                            typeName: obj.typeShowName,
                            staffName: obj.staffName,
                            scDate: obj.scdate,
                            fxDate: obj.fxdate,
                            yaoName: obj.scShowName,
                        };
                        this.setState({ mainInfo: temp });
                        console.log(this.state.mainInfo);
                    }
                    else {
                        this.showDialogue("数据获取异常");
                    }
                }
            });

            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getFinalResult",
                params: { "code": code },
                cb: (res) => {
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
        else {
            this.showDialogue("该单据不存在");
        }

    }


    render() {
        const { mainInfo } = this.state;
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
                    <div style={topTitleStyle}>试样名称</div>
                    <div style={topTitleStyle}>试样编号</div>
                    <div style={topTitleStyle}>分析日期</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>{mainInfo.typeName}</div>
                    <div style={topDescStyle}>{mainInfo.code}</div>
                    <div style={topDescStyle}>{mainInfo.fxDate}</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>窑号</div>
                    <div style={topTitleStyle}>生产日期</div>
                    <div style={topTitleStyle}>分析人员</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>{mainInfo.yaoName}</div>
                    <div style={topDescStyle}>{mainInfo.scDate}</div>
                    <div style={topDescStyle}>{mainInfo.staffName}</div>
                </div>

                {this.state.dataSections.map(section => (
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
                                        <div>{item.showName}</div>
                                        <div style={{
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
                                                        placeholder="" value={node.value}
                                                        name="value"
                                                        onChange={(e) => this.handleInput(node, e)}
                                                    />
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
                    <div style={analysisResultStyle} onTouchStart={() => this.handleOpenAnalysisResult()}>分析结果</div>
                    <div style={saveBtnStyle} onTouchStart={this.handleSaveClick}> 修  改 </div>
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

    handleSaveClick = () => {
        const mainInfo = this.state.mainInfo;
        const inputs = '{"code":"' + mainInfo.code + '"}';
        scriptUtil.excuteScriptService({
            objName: "ZLFXObj1",
            serviceName: "getDataTableScript",
            params: { inputs: inputs },
            cb: (res) => {
                if (!res.result.map.list.empty) {
                    this.saveInfo();
                }
                else {
                    this.showDialogue("该单据数据不存在");
                    return;
                }
            }
        });
    }

    handleOpenAnalysisResult = () => {
        scriptUtil.openPage(`#/runtime-fullscreen/runtime-fullscreen/Page_b082032edc3c4367b41522af51f663af?code=${this.state.mainInfo.code}`, '_self');
        // window.top.zhizhiDispatchAppEvent('reqOpenPublicAccount', {
        //     // 下一个的最上面的标题
        //     title: '',
        //     // 下一个页面的URL
        //     url: `http://60.167.69.246:38080/#/runtime-fullscreen/runtime-fullscreen/Page_b082032edc3c4367b41522af51f663af?code=${this.state.mainInfo.code}`
        // })
    };

    //保存主子表
    saveInfo = () => {
        const mainInfo = this.state.mainInfo;
        const params = {
            "code": mainInfo.code
        }

        scriptUtil.excuteScriptService({
            objName: "ZLFXObj2",
            serviceName: "DeleteDataTableEntries",
            params: params,
            cb: (res) => {
                if (200 != res.code) {
                    return;
                }
                else {
                    const list = [];
                    this.state.dataSections[0].data.map(objItem => {
                        const struct = {
                            "code": mainInfo.code,
                            "fxdate": mainInfo.fxDate,
                            "CY": null,
                            "RYTJ": null,
                            "GLTJ": null,
                            "KZ": null,
                            "KGGZ": null,
                            "DDD": null,
                            "TYPE": objItem.name,
                            "CDWZ": null,
                            "BZ": "",
                            "SO3":null
                        };

                        objItem.list.map(proItem => {
                            objItem.list.map(proItem => {
                                if (proItem.value && parseFloat(proItem.value).toString() != "NaN") {
                                    eval("struct." + proItem.name.split('_')[1] + "=" + proItem.value);
                                }
                                else {
                                    (proItem.value) ? eval("struct." + proItem.name.split('_')[1] + "=\"" + proItem.value + "\"") : eval("struct." + proItem.name.split('_')[1] + " = null");
                                }
                            });
                        });
                        list.push(struct);
                    });
                    const paramsSub = { list: list };
                    console.log(JSON.stringify(paramsSub));
                    scriptUtil.excuteScriptService({
                        objName: "ZLFXObj2",
                        serviceName: "AddDataTableEntries",
                        params: {
                            params: JSON.stringify(paramsSub)
                        },
                        cb: (res) => {
                            return res.result;
                        }
                    });
                    this.showDialogue("修改成功");
                }

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
    width: '80%'
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
    width: 0,
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
    width: '50%',
    fontSize: '18px',
    padding: '8px',
    textAlign: 'center'
}
const analysisResultStyle = {
    ...commonBtn,
    color: '#2d7df6',
    backgroundColor: '#fff',
}

const saveBtnStyle = {
    ...commonBtn,
    color: '#fff',
    backgroundColor: '#2d7df6'
}
