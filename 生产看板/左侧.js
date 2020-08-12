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
        chamotteElectricity: '',//熟料综合电耗
        cementElectricity: '',//水泥磨工序电耗
        cementSales: {},  //水泥销售量
        cementStock: '',// 库存量
        top10: [],//销量排行
    }
    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                scaleX: document.documentElement.clientWidth / 2688,
                scaleY: document.documentElement.clientHeight / 1728,
            })
        })
        //熟料综合电耗
        scriptUtil.excuteScriptService({
            objName: "ManuBrowser",
            serviceName: "getMonthRawChamotteElec",
            cb: (res) => {
                this.setState({
                    chamotteElectricity: (+res.result.list[0].rate).toFixed(2)
                })
            }
        });
        //水泥磨工序电耗
        scriptUtil.excuteScriptService({
            objName: "ManuBrowser",
            serviceName: "getMonthRawCementElec",
            cb: (res) => {
                this.setState({
                    cementElectricity: (+res.result.list[0].rate).toFixed(2)
                })
            }
        });
        //水泥销售量
        scriptUtil.excuteScriptService({
            objName: "ManuBrowser",
            serviceName: "getCementSales",
            cb: (res) => {
                this.setState({
                    cementSales: res.result.list[0]
                })
            }
        });
        //水泥月库存量
        scriptUtil.excuteScriptService({
            objName: "ManuBrowser",
            serviceName: "CementStockData",
            cb: (res) => {
                this.setState({
                    cementStock: res.result.list[0].total
                })
            }
        });
        // 销量排行榜
        scriptUtil.excuteScriptService({
            objName: "ManuBrowser",
            serviceName: "cementSalesTOP10",
            cb: (res) => {
                this.setState({
                    top10: res.result.list
                })
            }
        });
    }
    componentDidUpdate() {
        // 设备停机列表超出滚动
        if (this.scroll && this.scroll.children.length && !this.scroll.scrollMark) {
            this.scroll.scrollMark = true;
            this.scroll.innerHTML += this.scroll.innerHTML;
        }
    }
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
                    width: '255px',
                    height: '86px',
                    position: 'absolute',
                    top: '17px',
                    left: '128px',
                    background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/supOS-%E7%99%BDxx.png',
                    opacity: '.1',
                }}></div>
                {/* 电耗分析开始 */}
                <div
                    style={{
                        width: '1184px',
                        height: '834px',
                        position: 'absolute',
                        top: '233px',
                        left: '128px',
                        background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AFx1.png)'
                    }}
                >
                    <div
                        style={{
                            width: '750px',
                            height: '62px',
                            position: 'absolute',
                            top: '46px',
                            left: '48px',
                            marginTop: '20px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87xc1.png)'
                        }}

                    ></div>
                    <div
                        style={{
                            width: '670px',
                            position: 'absolute',
                            top: '135px',
                            right: '40px',
                        }}
                    >
                        <div
                            style={{
                                width: '50%',
                                display: 'inline-block'
                            }}
                        >
                            <div
                                style={{
                                    height: '35px',
                                    fontSize: '35px',
                                    fontFamily: 'PingFangSC-Regular,PingFang SC',
                                    fontWeight: '400',
                                    color: 'rgba(77,193,215,1)',
                                    lineHeight: '35px',
                                    margin: '10px 0'
                                }}
                            >
                                熟料综合电耗
                            </div>
                            <div
                                style={{
                                    height: '100px',
                                    fontSize: '92px',
                                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                                    fontWeight: 'bold',
                                    color: 'rgba(255,255,255,1)',
                                    margin: '10px 0',
                                    lineHeight: '100px'
                                }}
                            >
                                {this.state.chamotteElectricity}
                            </div>
                        </div>

                        <div
                            style={{
                                width: '50%',
                                display: 'inline-block'
                            }}
                        >
                            <div
                                style={{
                                    height: '35px',
                                    fontSize: '35px',
                                    fontFamily: 'PingFangSC-Regular,PingFang SC',
                                    fontWeight: '400',
                                    color: 'rgba(77,193,215,1)',
                                    margin: '10px 0',
                                    lineHeight: '35px'
                                }}
                            >
                                水泥磨工序电耗
                            </div>
                            <div
                                style={{
                                    height: '100px',
                                    fontSize: '92px',
                                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                                    fontWeight: 'bold',
                                    color: 'rgba(255,255,255,1)',
                                    margin: '10px 0',
                                    lineHeight: '100px'
                                }}
                            >
                                {this.state.cementElectricity}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 电耗分析结束 */}
                {/* 质量分析开始 */}
                <div
                    style={{
                        width: '1184px',
                        height: '546px',
                        position: 'absolute',
                        top: '1097px',
                        left: '128px',
                        background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AFx3.png)'
                    }}
                >
                    <div
                        style={{
                            width: '750px',
                            height: '62px',
                            position: 'absolute',
                            top: '38px',
                            left: '31px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87xc3.png)'
                        }}
                    ></div>
                    <div
                        style={{
                            position: 'absolute',
                            left: '86px',
                            right: '86px',
                            top: '235px'
                        }}
                    >

                        <div
                            style={{
                                width: '50%',
                                display: 'inline-block',
                            }}
                        >
                            <div
                                style={{
                                    height: '29px',
                                    fontSize: '29px',
                                    fontFamily: 'PingFangSC-Regular,PingFang SC',
                                    fontWeight: '400',
                                    color: 'rgba(77,193,215,1)',
                                    lineHeight: '29px'
                                }}
                            >
                                出窑熟料f-CaO平均值
                            </div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    height: '89px',
                                    fontSize: '90px',
                                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                                    fontWeight: 'bold',
                                    color: 'rgba(214,119,102,1)',
                                    lineHeight: '89px',
                                    marginTop: '56px',
                                    marginRight: '30px'
                                }}
                            >
                                0.83%
                            </div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    marginTop: '56px',
                                    borderLeft: '2px solid #4DC1D7',
                                    paddingLeft: '20px'
                                }}
                            >

                                <p
                                    style={{
                                        width: '116px',
                                        height: '29px',
                                        fontSize: '29px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        fontWeight: 400,
                                        color: 'rgba(77,193,215,1)',
                                        lineHeight: '29px',
                                        margin: '10px 0 20px 0'
                                    }}
                                >
                                    年计划值
                                </p>

                                <p
                                    style={{
                                        width: '116px',
                                        height: '39px',
                                        fontSize: '29px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        fontWeight: 400,
                                        color: '#fff',
                                        lineHeight: '39px',
                                        margin: '20px 0 10px 0'
                                    }}
                                >
                                    ≤ 1.20%
                                </p>
                            </div>
                        </div>
                        <div
                            style={{
                                width: '50%',
                                display: 'inline-block',
                            }}
                        >
                            <div
                                style={{
                                    height: '29px',
                                    fontSize: '29px',
                                    fontFamily: 'PingFangSC-Regular,PingFang SC',
                                    fontWeight: '400',
                                    color: 'rgba(77,193,215,1)',
                                    lineHeight: '29px'
                                }}
                            >
                                出窑熟料f-CaO合格率
                            </div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    height: '89px',
                                    fontSize: '90px',
                                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                                    fontWeight: 'bold',
                                    color: 'rgba(43,217,153,1)',
                                    lineHeight: '89px',
                                    marginTop: '56px',
                                    marginRight: '30px'
                                }}
                            >
                                97.89%
                            </div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    marginTop: '56px',
                                    borderLeft: '2px solid #4DC1D7',
                                    paddingLeft: '20px'
                                }}
                            >

                                <p
                                    style={{
                                        width: '116px',
                                        height: '29px',
                                        fontSize: '29px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        fontWeight: 400,
                                        color: 'rgba(77,193,215,1)',
                                        lineHeight: '29px',
                                        margin: '10px 0 20px 0'
                                    }}
                                >
                                    年计划值
                                </p>

                                <p
                                    style={{
                                        width: '116px',
                                        height: '39px',
                                        fontSize: '29px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        fontWeight: 400,
                                        color: '#fff',
                                        lineHeight: '39px',
                                        margin: '20px 0 10px 0'
                                    }}
                                >
                                    ≥ 90%
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                {/* 质量分析结束 */}
                {/* 水泥销量分析开始 */}
                <div
                    style={{
                        width: '1280px',
                        height: '1411px',
                        position: 'absolute',
                        top: '233px',
                        left: '1352px',
                        background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AFx2.png)'
                    }}

                >
                    <div
                        style={{
                            width: '720px',
                            height: '60px',
                            position: 'absolute',
                            top: '46px',
                            left: '48px',
                            marginTop: '20px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87xc2.png)'
                        }}
                    ></div>
                    <div
                        style={{
                            position: 'absolute',
                            top: '167px',
                            left: '154px',
                        }}
                    >
                        <div style={{
                            height: '31px',
                            fontSize: '24px',
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(77,193,215,1)',
                            lineHeight: '31px'
                        }}>
                            本月销售量 (吨)
                        </div>
                        <div
                            style={{
                                height: '72px',
                                fontSize: '60px',
                                fontWeight: 'bold',
                                fontFamily: 'MicrosoftYaHei',
                                color: '#fff',
                                lineHeight: '72px',
                                marginTop: '20px'
                            }}
                        >
                            {this.state.cementSales.monthSales && this.state.cementSales.monthSales.split('.')[0]}
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: '167px',
                            left: '416px',
                            borderLeft: "2px solid #4DC1D7",
                            paddingLeft: "20px"
                        }}
                    >
                        <div style={{
                            height: '31px',
                            fontSize: '24px',
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(77,193,215,1)',
                            lineHeight: '31px'
                        }}>
                            库存量 (吨)
                        </div>
                        <div
                            style={{
                                height: '72px',
                                fontSize: '60px',
                                fontWeight: 'bold',
                                fontFamily: 'MicrosoftYaHei',
                                color: '#fff',
                                lineHeight: '72px',
                                marginTop: '20px'
                            }}
                        >
                            {this.state.cementStock}
                        </div>

                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: '167px',
                            left: '918px',
                        }}
                    >
                        <div style={{
                            height: '31px',
                            fontSize: '24px',
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(77,193,215,1)',
                            lineHeight: '31px'
                        }}>
                            年销售量 (吨)
                        </div>
                        <div
                            style={{
                                height: '72px',
                                fontSize: '60px',
                                fontWeight: 'bold',
                                fontFamily: 'MicrosoftYaHei',
                                color: '#fff',
                                lineHeight: '72px',
                                marginTop: '20px'
                            }}
                        >
                            {this.state.cementSales.yearSales && this.state.cementSales.yearSales.split('.')[0]}
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: '873px',
                            left: '37px',
                            fontSize: '30px',
                            fontFamily: 'PingFangSC-Regular,PingFang SC',
                            fontWeight: '400',
                            color: 'rgba(149,231,247,1)',
                            lineHeight: '42px'
                        }}
                    >
                        本月水泥销量榜TOP10
                        </div>
                    <div
                        style={{
                            position: 'absolute',
                            width: '882px',
                            height: '10px',
                            background: '#4DC1D7',
                            top: '892px',
                            left: '361px',
                        }}
                    ></div>
                    <div
                        style={{
                            position: 'absolute',
                            width: '708px',
                            height: '381px',
                            top: '934px',
                            left: '37px',
                            backgroundImage: `url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/zuoshangxiao.png),
                            url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/youshangxiao.png),
                            url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/youxiaxiao.png),
                            url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/zuoxiaxiao.png)`,
                            backgroundRepeat: 'no-repeat, no-repeat, no-repeat,no-repeat',
                            backgroundPosition: 'left top, right top, right bottom, left bottom',
                            boxSizing: 'border-box',
                            padding: '6px 26px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            align="left"
                            style={{
                                width: '100%',
                                height: ' 100%',
                            }}
                        >
                            <div style={{
                                height: '38px',
                                fontSize: '24px',
                                fontFamily: 'MicrosoftYaHei',
                                color: 'rgba(149,231,247,1)',
                                lineHeight: '38px',
                                background: '#012c65',
                                position: 'relative',
                                zIndex: 1,
                                margin: '-7px 0 0 0 ',
                            }}>
                                <div style={{ display: 'inline-block', width: '10%' }} >排名</div>
                                <div style={{ display: 'inline-block', width: '50%' }} >客户名称</div>
                                <div style={{ display: 'inline-block', width: '25%' }} >销量（吨）</div>
                                <div style={{ display: 'inline-block', width: '15%' }} >占比 (%)</div>
                            </div>
                            <section
                                ref={el => this.scroll = el}
                                style={{
                                    animation: this.scroll && this.scroll.scrollMark ? 'scrolleq 20s linear infinite' : 'none'
                                }}
                            >
                                {
                                    this.state.top10.map(item =>
                                        <div
                                            style={{
                                                fontSize: '24px',
                                                fontFamily: 'MicrosoftYaHei',
                                                color: '#fff',
                                                lineHeight: '30px',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            <div style={{ display: 'inline-block', width: '10%', verticalAlign: 'top' }}>{item.orderid}</div>
                                            <div style={{ display: 'inline-block', width: '50%', verticalAlign: 'top' }}>{item.name}</div>
                                            <div style={{ display: 'inline-block', width: '25%', verticalAlign: 'top' }}>{item.sales}</div>
                                            <div style={{ display: 'inline-block', width: '15%', verticalAlign: 'top' }}>{(item.rate * 100).toFixed(2)}</div>
                                        </div>
                                    )
                                }
                            </section>
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            width: '476px',
                            height: '387px',
                            top: '934px',
                            left: '769px',
                            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/%E7%9F%A9%E5%BD%A2xx.png)'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: '414px',
                                height: '90px',
                                top: '28px',
                                left: '36px',
                                background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/kehubiao.png)'
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '28px',
                                    fontFamily: 'MicrosoftYaHei',
                                    color: 'rgba(148,231,255,1)',
                                    lineHeight: '29px',
                                    position: 'absolute',
                                    top: '20px',
                                    left: '26px',
                                    width: '220px'
                                }}
                            >
                                {this.state.top10[0] && this.state.top10[0].name}
                            </div>
                            <div
                                style={{
                                    fontSize: '28px',
                                    fontFamily: 'MicrosoftYaHei',
                                    color: 'rgba(148,231,255,1)',
                                    lineHeight: '42px',
                                    position: 'absolute',
                                    top: '30px',
                                    left: '300px',
                                    color: '#fff'
                                }}
                            >
                                {this.state.top10[0] && (this.state.top10[0].rate * 100).toFixed(2)}%
                            </div>
                        </div>

                    </div>
                </div>
                {/* 水泥销量分析结束 */}
            </div >
        );
    }
}

export default CustomComp;