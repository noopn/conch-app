import React, { Component } from 'react';
var css = document.createElement('style');
css.type = 'text/css';
css.id = 'CustomCompStyle';
css.innerHTML = `
@keyframes scrolleq{
    0%{
        transform:translateY(0);
    }
    100%{
        transform:translateY(-50%);
    }
}
`;
document.getElementsByTagName('head')[0].appendChild(css);
class CustomComp extends Component {
    state = {
        scaleX: document.documentElement.clientWidth / 2688,
        scaleY: document.documentElement.clientHeight / 1728,
        eqData: {},//运行设备 分子 分母
        eqFetchData: [],//设备停机数据
        seShowIndex: 0,//设备停机切换显示索引,
        eqStateData: [],
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                scaleX: document.documentElement.clientWidth / 2688,
                scaleY: document.documentElement.clientHeight / 1728,
            })
        })
        // 停机显示切换
        setInterval(() => {
            this.setState(state => ({
                seShowIndex: state.seShowIndex === 4 ? 0 : state.seShowIndex + 1
            }))
        }, 6 * 1000);
        // 运行设备分子分母
        scriptUtil.excuteScriptService({
            objName: "EquipBrowser",
            serviceName: "getMachineAllCount",
            cb: (res) => {
                this.setState({
                    eqData: res.result
                })
            }
        });

        // 分厂设备状态
        scriptUtil.excuteScriptService({
            objName: "EquipBrowser",
            serviceName: "getList",
            cb: (res) => {
                let arr = [];
                for (var key in res.result) {
                    arr.push(res.result[key]);
                }
                this.setState({ eqStateData: arr });
            }
        });
        // 设备停机数据
        Promise.all(['GetCrusherStatus', 'getMaterialMillStatus', 'getCoalMillStatus', 'getKilnStatus', 'getMillStatus'].map(item => new Promise((resolve, reject) => {
            scriptUtil.excuteScriptService({
                objName: "EquipBrowser",
                serviceName: item,
                cb: (res) => {
                    resolve(res);
                }
            });
        })))
            .then(res => {
                this.setState({
                    eqFetchData: res.map(item => item.result)
                })
            })

        setInterval(() => {
            Promise.all(['GetCrusherStatus', 'getMaterialMillStatus', 'getCoalMillStatus', 'getKilnStatus', 'getMillStatus'].map(item => new Promise((resolve, reject) => {
                scriptUtil.excuteScriptService({
                    objName: "EquipBrowser",
                    serviceName: item,
                    cb: (res) => {
                        resolve(res);
                    }
                });
            })))
                .then(res => {
                    this.setState({
                        eqFetchData: res.map(item => item.result)
                    })
                })
        }, 10 * 1000)

    }

    componentDidUpdate() {
        // 设备停机列表超出滚动
        this.eqTipData.forEach((item, index) => {
            if (this[`eqlist${index}`] && this[`eqlist${index}`].children.length > 6 && !this[`eqlist${index}`].scrollMark) {
                this[`eqlist${index}`].scrollMark = true;
                this[`eqlist${index}`].innerHTML += this[`eqlist${index}`].innerHTML;
            }
        })
    }
    // 设备标签的数组
    eqTipData = [
        {
            name: '破碎机',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2c1.png'
        },
        {
            name: '原料磨',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2c2.png'
        },
        {
            name: '煤磨',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2c3.png'
        },
        {
            name: '回转窑',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2c4.png'
        },
        {
            name: '水泥磨',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2c5.png'
        },
    ]
    eqStateTipData = [
        {
            name: '矿山分厂',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2%20copy1.png'
        },
        {
            name: '制造一',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2%20copy2.png'
        },
        {
            name: '制造二',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2%20copy3.png'
        },
        {
            name: '水泥分厂',
            src: '/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E7%9F%A9%E5%BD%A2%20copy4.png'
        },

    ]
    render() {
        return (
            <div
                style={{
                    width: '2688px',
                    height: '1728px',
                    transform: `scale3d(${this.state.scaleX},${this.state.scaleY}, 1)`,
                    transformOrigin: 'top left'
                }}
            >
                <div style={{
                    width: "928px",
                    height: '608px',
                    position: 'absolute',
                    top: '174px',
                    left: '128px',
                    background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF%E6%98%AF.png)',

                }}>
                    <div
                        style={{
                            width: "648px",
                            height: '79px',
                            position: 'absolute',
                            top: '34px',
                            left: '28px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87ss.png)',

                        }}
                    ></div>
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: ' 120px',
                            left: '40px',
                            right: '40px',
                        }}
                    >
                        {
                            this.eqTipData.map(item =>
                                <div
                                    style={{
                                        height: '88px',
                                        lineHeight: '88px',
                                        fontSize: '29px',
                                        color: '#fff',
                                        margin: '0 5px',
                                        flex: 1,
                                        textAlign: 'center',
                                        background: `url(${item.src})`,
                                        backgroundSize: 'cover'
                                    }}
                                >
                                    {item.name}
                                </div>
                            )
                        }
                    </div>
                    <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '24px solid transparent',
                        borderRight: '24px solid transparent',
                        borderBottom: '25px solid #1b7091',
                        position: 'absolute',
                        top: '213px',
                        left: `${this.state.seShowIndex * 170 + 100}px`,
                        transition: 'left .3s ease-out',
                        // display:'none'
                    }}
                    ></div>
                    <div
                        style={{
                            position: 'absolute',
                            top: ' 236px',
                            left: '45px',
                            right: '45px',
                            height: '340px',
                            border: '2px solid #1b7091',
                            // borderBottom:"none",
                            overflow: 'hidden',
                            borderTop: '8px solid #1b7091',
                            borderRadius: '10px 10px 0 0',
                        }}
                    >
                        {
                            this.state.eqFetchData.map((item, index) =>
                                <div
                                    ref={el => this[`eqlist${index}`] = el}
                                    style={{
                                        display: index === this.state.seShowIndex ? 'block' : 'none',
                                        animation: this[`eqlist${index}`] && this[`eqlist${index}`].scrollMark ? 'scrolleq 10s linear infinite' : 'none'
                                        // height: ' 340px',
                                        // overflow: 'hidden',
                                    }}>
                                    {
                                        this.state.eqFetchData[index].map(item =>
                                            <div
                                                style={{
                                                    height: '55px',
                                                    boxSizing: 'border-box',
                                                    borderBottom: "2px solid #1b7091"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'inline-block',
                                                        boxSizing: 'border-box',
                                                        width: '30%',
                                                        fontSize: '26px',
                                                        fontFamily: 'PingFangSC-Semibold,PingFang SC',
                                                        fontWeight: 600,
                                                        color: '#fff',
                                                        lineHeight: '53px',
                                                        borderRight: "2px solid #1b7091",
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {item.name}
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'inline-block',
                                                        boxSizing: 'border-box',
                                                        width: '30%',
                                                        fontSize: '23px',
                                                        fontFamily: 'PingFangSC-Semibold,PingFang SC',
                                                        fontWeight: 600,
                                                        color: 'rgba(19,200,244,1)',
                                                        lineHeight: '53px',
                                                        borderRight: "2px solid #1b7091",
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <i
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            display: 'inherit',
                                                            verticalAlign: 'text-bottom',
                                                            background: item.status ? 'linear-gradient(45deg, #72D904, #B2F603)' : 'linear-gradient(45deg, #FA6B6C, #F4393A)'
                                                        }}>
                                                    </i>
                                                    {/* {item.status ? '开' : '关'} */}
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'inline-block',
                                                        boxSizing: 'border-box',
                                                        width: '40%',
                                                        fontSize: '23px',
                                                        fontFamily: 'PingFangSC-Semibold,PingFang SC',
                                                        fontWeight: 600,
                                                        color: 'rgba(19,200,244,1)',
                                                        lineHeight: '53px',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {item.status ? ' 开机' : '关机'}时长 <span style={{ display: 'inline-block', width: '80px', textAlign: 'center', fontSize: '30px', color: '#ffffff' }}>{item.runtime}</span> h
                                    </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }

                    </div>
                </div>
                <div style={{
                    width: "928px",
                    height: '608px',
                    position: 'absolute',
                    top: '174px',
                    left: '1132px',
                    background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF%E6%98%AF.png)',

                }}>
                    <div
                        style={{
                            width: "648px",
                            height: '79px',
                            position: 'absolute',
                            top: '34px',
                            left: '28px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87xx.png)',

                        }}
                    ></div>
                    {
                        this.eqStateTipData.map((item, index) =>
                            <div
                                style={{
                                    display: 'flex',
                                    position: 'absolute',
                                    left: '33px',
                                    right: '33px',
                                    top: `${136 + 104 * index}px`
                                }}>
                                <div
                                    style={{
                                        background: `url(${item.src})`,
                                        height: '91px',
                                        lineHeight: '91px',
                                        fontSize: '29px',
                                        color: '#fff',
                                        textAlign: 'center',
                                        width: '208px',
                                        margin: '0 8px',
                                    }}
                                >
                                    {item.name}
                                </div>
                                <div style={{
                                    background: 'linear-gradient(180deg,rgba(63,202,241,.2) 0%,rgba(41,61,255,0.041) 100%)',
                                    borderRadius: '8px',
                                    height: '89px',
                                    margin: '0 6px',
                                    position: 'relative',
                                    textAlign: 'center',
                                    flex: '1'
                                }}>
                                    <div
                                        style={{
                                            height: '35px',
                                            fontSize: '23px',
                                            fontFamily: 'PingFangSC-Regular,PingFang SC',
                                            color: 'rgba(156,178,214,1)',
                                            textAlign: 'center',
                                            lineHeight: '35px',
                                            margin: '8px 0 4px 0'
                                        }}
                                    >隐患</div>
                                    <div
                                        style={{
                                            height: '35px',
                                            fontSize: '31px',
                                            fontFamily: 'DINAlternate-Bold,DINAlternate',
                                            fontWeight: 'bold',
                                            color: '#f4f4f4',
                                            textAlign: 'center',
                                            margin: '4px 0 8px 0',
                                            lineHeight: '35px'
                                        }}
                                    >{this.state.eqStateData[index] && this.state.eqStateData[index].YH}</div>
                                </div>
                                <div
                                    style={{
                                        background: 'linear-gradient(180deg,rgba(63,202,241,.2) 0%,rgba(41,61,255,0.041) 100%)',
                                        borderRadius: '8px',
                                        height: '89px',
                                        margin: '0 6px',
                                        position: 'relative',
                                        flex: '1'
                                    }}
                                ><div
                                    style={{
                                        height: '35px',
                                        fontSize: '23px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        color: 'rgba(156,178,214,1)',
                                        textAlign: 'center',
                                        lineHeight: '35px',
                                        margin: '8px 0 4px 0'
                                    }}
                                >故障</div>
                                    <div
                                        style={{
                                            height: '35px',
                                            fontSize: '31px',
                                            fontFamily: 'DINAlternate-Bold,DINAlternate',
                                            fontWeight: 'bold',
                                            color: '#f4f4f4',
                                            textAlign: 'center',
                                            margin: '4px 0 8px 0',
                                            lineHeight: '35px'
                                        }}
                                    >{this.state.eqStateData[index] && this.state.eqStateData[index].GZ}</div></div>
                                <div
                                    style={{
                                        background: 'linear-gradient(180deg,rgba(63,202,241,.2) 0%,rgba(41,61,255,0.041) 100%)',
                                        borderRadius: '8px',
                                        height: '89px',
                                        margin: '0 6px',
                                        position: 'relative',
                                        flex: '1'
                                    }}
                                ><div
                                    style={{
                                        height: '35px',
                                        fontSize: '23px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        color: 'rgba(156,178,214,1)',
                                        textAlign: 'center',
                                        lineHeight: '35px',
                                        margin: '8px 0 4px 0'
                                    }}
                                >润滑</div>
                                    <div
                                        style={{
                                            height: '35px',
                                            fontSize: '31px',
                                            fontFamily: 'DINAlternate-Bold,DINAlternate',
                                            fontWeight: 'bold',
                                            color: '#f4f4f4',
                                            textAlign: 'center',
                                            margin: '4px 0 8px 0',
                                            lineHeight: '35px'
                                        }}
                                    >{this.state.eqStateData[index] && this.state.eqStateData[index].RH}</div></div>
                                <div
                                    style={{
                                        background: 'linear-gradient(180deg,rgba(63,202,241,.2) 0%,rgba(41,61,255,0.041) 100%)',
                                        borderRadius: '8px',
                                        height: '89px',
                                        margin: '0 6px',
                                        position: 'relative',
                                        flex: '1'
                                    }}
                                ><div
                                    style={{
                                        height: '35px',
                                        fontSize: '23px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        color: 'rgba(156,178,214,1)',
                                        textAlign: 'center',
                                        lineHeight: '35px',
                                        margin: '8px 0 4px 0'
                                    }}
                                >检修</div>
                                    <div
                                        style={{
                                            height: '35px',
                                            fontSize: '31px',
                                            fontFamily: 'DINAlternate-Bold,DINAlternate',
                                            fontWeight: 'bold',
                                            color: '#f4f4f4',
                                            textAlign: 'center',
                                            margin: '4px 0 8px 0',
                                            lineHeight: '35px'
                                        }}
                                    >{this.state.eqStateData[index] && this.state.eqStateData[index].JX}</div>
                                </div>
                            </div>
                        )
                    }

                </div>

                {/* 设备开始 */}
                <div
                    style={{
                        width: '929px',
                        height: '818px',
                        top: '825px',
                        left: '128px',
                        background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/equipment/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF%E5%A4%87%E4%BB%BD%E7%9F%AD.png)',
                        position: 'absolute'
                    }}
                >
                    <div
                        style={{
                            width: '642px',
                            height: '74px',
                            position: 'absolute',
                            top: '51px',
                            left: '35px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/equipment/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF11.png)'
                        }}
                    >
                        <img
                            src='/resource/App_97ffcc0d69634043ae5aa504559681d9/equipment/%E8%8F%9C%E5%8D%95icon.png'
                            style={{
                                width: '35px',
                                height: '37px',
                                position: 'absolute',
                                top: '17px',
                                left: '34px',
                            }}
                        />
                        <span
                            style={{
                                width: '96px',
                                height: '32px',
                                fontSize: '32px',
                                fontWeight: '600',
                                color: 'rgba(0,204,255,1)',
                                lineHeight: '32px',
                                position: 'absolute',
                                top: '20px',
                                left: '96px',
                            }}
                        >

                            设备
                        </span>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            left: '20px',
                            right: '20px',
                            top: '125px',
                            bottom: '20px',
                            margin: 'auto'
                        }}
                    >

                        <div style={{
                            position: 'absolute',
                            width: '50%',
                            left: '0',
                            top: '10px',
                            bottom: '0',
                            margin: 'auto'
                        }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '120px',
                                    left: '0',
                                    top: '0',
                                    right: '0',
                                    margin: 'auto'
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '140px',
                                        height: '43px',
                                        left: '50px',
                                        bottom: '0',
                                        textAlign: 'center',
                                        fontSize: '30px',
                                        color: '#ffffff',
                                    }}
                                >
                                    运行设备
                            </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '140px',
                                        height: '85px',
                                        left: '200px',
                                        bottom: '0',
                                        textAlign: 'center',
                                        fontSize: '30px',
                                        color: '#00CCFF',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '70px',
                                        }}
                                    >
                                        {this.state.eqData.count}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '56px',
                                        }}
                                    >
                                        /{this.state.eqData.sumcount}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        textAlign: 'center',
                                        color: 'rgba(19,200,244,1)',
                                        lineHeight: '38px',
                                        textAlign: 'center',
                                        fontSize: '33px',
                                        top: '490px',
                                    }}
                                >
                                    设备运转率
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        textAlign: 'center',
                                        height: '67px',
                                        fontSize: '58px',
                                        fontFamily: 'DINAlternate-Bold,DINAlternate',
                                        fontWeight: 'bold',
                                        color: 'rgba(125,250,255,1)',
                                        lineHeight: '67px',
                                        top: '550px'
                                    }}
                                >
                                    {(this.state.eqData.count / this.state.eqData.sumcount * 100).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                        <div style={{
                            position: 'absolute',
                            width: '50%',
                            left: '50%',
                            top: '10px',
                            bottom: '0',
                            margin: 'auto'
                        }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '120px',
                                    left: '0',
                                    top: '0',
                                    right: '0',
                                    margin: 'auto'
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '140px',
                                        height: '43px',
                                        left: '50px',
                                        bottom: '0',
                                        textAlign: 'center',
                                        fontSize: '30px',
                                        color: '#ffffff',
                                    }}
                                >
                                    维护设备
                            </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '140px',
                                        height: '85px',
                                        left: '200px',
                                        bottom: '0',
                                        textAlign: 'center',
                                        fontSize: '30px',
                                        color: '#00CCFF',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '70px',
                                        }}
                                    >
                                        {this.state.eqData.wcount}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '56px',
                                        }}
                                    >/{this.state.eqData.sumcount}</span>
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        textAlign: 'center',
                                        color: 'rgba(19,200,244,1)',
                                        lineHeight: '38px',
                                        textAlign: 'center',
                                        fontSize: '33px',
                                        top: '490px',
                                    }}
                                >
                                    设备故障率
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        textAlign: 'center',
                                        height: '67px',
                                        fontSize: '58px',
                                        fontFamily: 'DINAlternate-Bold,DINAlternate',
                                        fontWeight: 'bold',
                                        color: 'rgba(125,250,255,1)',
                                        lineHeight: '67px',
                                        top: '550px'
                                    }}
                                >
                                    {(this.state.eqData.wcount / this.state.eqData.sumcount * 100).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 设备结束 */}
                {/* 隐患巡检开始 */}
                <div
                    style={{
                        width: '929px',
                        height: '818px',
                        top: '825px',
                        left: '1132px',
                        background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/equipment/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF%E5%A4%87%E4%BB%BD%E7%9F%AD.png)',
                        position: 'absolute'
                    }}
                >
                    <div
                        style={{
                            width: '642px',
                            height: '74px',
                            position: 'absolute',
                            top: '51px',
                            left: '35px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/equipment/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF11.png)'
                        }}
                    >
                        <img
                            src='/resource/App_97ffcc0d69634043ae5aa504559681d9/equipment/%E8%8F%9C%E5%8D%95icon.png'
                            style={{
                                width: '35px',
                                height: '37px',
                                position: 'absolute',
                                top: '17px',
                                left: '34px',
                            }}
                        />
                        <span
                            style={{
                                width: '200px',
                                height: '32px',
                                fontSize: '32px',
                                fontWeight: '600',
                                color: 'rgba(0,204,255,1)',
                                lineHeight: '32px',
                                position: 'absolute',
                                top: '20px',
                                left: '96px',
                            }}
                        >

                            隐患巡检
                        </span>
                    </div>
                </div>
                {/* 隐患巡检结束 */}

            </div >
        );
    }


}

export default CustomComp;
