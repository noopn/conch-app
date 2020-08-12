import React, { Component } from 'react';
class GreenNumber extends Component {
    render() {
        return (
            <div style={{
                position:'absolute',
                top:'731px',
                left:'97px'
            }}>
                {this.props.str.split('').map(item => {
                    if (Number(item)) {
                        return <span style={{
                            display: 'inline-block',
                            width: '61px',
                            height: '92px',
                            fontSize: '36px',
                            textAlign: 'center',
                            lineHeight: '40px',
                            borderRadius: '6px',
                            color: '#ffffff',
                            fontSize: '80px',
                            // fontWeight: 'bold',
                            background: 'rgba(126, 175, 66, 1)',
                            marginRight: '12px'
                        }}>{item}</span>
                    } else {
                        return <span style={{
                            display: 'inline-block',
                            fontSize: '36px',
                            textAlign: 'center',
                            color: '#ffffff',
                            marginLeft: '-5px',
                            marginRight: '5px'
                        }}>{item}</span>
                    }
                })}
            </div>
        );
    }
}
class CustomComp extends Component {
    state = {
        scaleX: document.documentElement.clientWidth / 2688,
        scaleY: document.documentElement.clientHeight / 1728,
        eqData: [],//运行设备 分子 分母
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                scaleX: document.documentElement.clientWidth / 2688,
                scaleY: document.documentElement.clientHeight / 1728,
            })
        })
        // 运行设备分子分母

    }

    render() {
        return (
            <div
                style={{
                    width: '2688px',
                    height: '1728px',
                    transform: `scale3d(${this.state.scaleX},${this.state.scaleY}, 1)`,
                    transformOrigin: 'top left',
                    position: 'relative'
                }}
            >
                {/* 柴油消耗分析开始 */}
                <div
                    style={{
                        width: '776px',
                        height: '73px',
                        top: '185px',
                        left: '30px',
                        position: 'absolute'
                    }}
                >
                    <span
                        style={{
                            height: "31px",
                            fontSize: "31px",
                            fontFamily: "PingFangSC-Semibold,PingFang SC",
                            fontWeight: "600",
                            color: "rgba(255,255,255,1)",
                            lineHeight: "31px",
                            position: " absolute",
                            top: "21px",
                            left: "44px",
                        }}
                    >柴油消耗分析</span>
                </div>
                <div
                    style={{
                        width: "819px",
                        height: "1270px",
                        top: '265px',
                        left: '34px',
                        position: 'absolute',
                        background:'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%9C%86%E8%A7%92%E7%9F%A9%E5%BD%A2%204.png)'
                    }}
                >
                    <h2
                        style={{
                            height: "43px",
                            fontSize: "31px",
                            fontFamily: "PingFangSC-Regular,PingFang SC",
                            fontWeight: "400",
                            color: "rgba(255,255,255,1)",
                            lineHeight: "43px",
                            position: " absolute",
                            top: "663px",
                            left: "96px",
                        }}
                    >
                        年度累计所有车辆柴油消耗
                    </h2>
                    <GreenNumber str='6,242'/>
                </div>
                {/* 柴油消耗分析结束 */}

            </div >
        );
    }


}

export default CustomComp;
