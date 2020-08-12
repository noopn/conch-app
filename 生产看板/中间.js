import React, { Component } from 'react';
var css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `
* {
    box-sizing: border-box;
}
html,
body {
    height: 100%;
}
body {
    background-color: #1a1a1a;
    font-family: sans-serif;
    font-size: 15px;
    color: #ccc;
}

::-webkit-input-placeholder {
    color: #7aa6f3;
    text-shadow: 0 0 3px #7aa6f3;
}
:-moz-placeholder {
    color: #7aa6f3;
    text-shadow: 0 0 3px #7aa6f3;
}
::-moz-placeholder {
    color: #7aa6f3;
    text-shadow: 0 0 3px #7aa6f3;
}
:-ms-input-placeholder {
    color: #7aa6f3;
    text-shadow: 0 0 3px #7aa6f3;
}
.wrapper {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: box;
    display: flex;
    -webkit-box-align: center;
    -o-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -o-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -o-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    height: 100%;
}
.green {
    position:absolute;
    top:38px;
    left:32px;
}
.green .progress,
.red .progress,
.orange .progress {
    position: relative;
    border-radius: 50%;
}
.green .progress,
.red .progress,
.orange .progress {
    width: 245px;
    height: 245px;
}

.green .progress {
  border: 5px solid #5edf4e;
}

.me-blue .progress {
  border: 5px solid #66ccff;
}

.me-yellow .progress {
  border: 5px solid #FB9831;
}

.me-red .progress {
  border: 5px solid #F45A66;
}

.green .progress {
    box-shadow: 0 0 20px #029502;
}
.green .progress,
.red .progress,
.orange .progress {
    -webkit-transition: all 1s ease;
    transition: all 1s ease;
}
.green .progress .inner,
.red .progress .inner,
.orange .progress .inner {
    position: absolute;
    overflow: hidden;
    z-index: 2;
    border-radius: 50%;
}
.green .progress .inner,
.red .progress .inner,
.orange .progress .inner {
    width: 240px;
    height: 240px;
}
.green .progress .inner,
.red .progress .inner,
.orange .progress .inner {
    // border: 5px solid #1a1a1a;
}
.green .progress .inner,
.red .progress .inner,
.orange .progress .inner {
    -webkit-transition: all 1s ease;
    transition: all 1s ease;
}
.green .progress .inner .water,
.red .progress .inner .water,
.orange .progress .inner .water {
    position: absolute;
    z-index: 1;
    width: 200%;
    height: 200%;
    left: -50%;
    border-radius: 40%;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-name: spin;
    animation-name: spin;
}
.green .progress .inner .water {
    top: 25%;
}
.green .progress .inner .water {
    background: rgba(85, 197, 117, 0.7);
}
.green .progress .inner .water,
.red .progress .inner .water,
.orange .progress .inner .water {
    -webkit-transition: all 1s ease;
    transition: all 1s ease;
}
.green .progress .inner .water,
.red .progress .inner .water,
.orange .progress .inner .water {
    -webkit-animation-duration: 10s;
    animation-duration: 10s;
}
.green .progress .inner .water {
    box-shadow: 0 0 20px #03bc03;
}


.me-red .progress .inner .water {
  box-shadow: 0 0 20px #F45A66;
  background: #F45A66;
}
.me-yellow .progress .inner .water {
  box-shadow: 0 0 20px #FB9831;
  background: #FB9831;
}
.me-blue .progress .inner .water {
  box-shadow: 0 0 20px #37C3D7;
  background: #37C3D7;
}

.green .progress .inner .glare,
.red .progress .inner .glare,
.orange .progress .inner .glare {
    position: absolute;
    top: -120%;
    left: -120%;
    z-index: 5;
    width: 200%;
    height: 200%;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    border-radius: 50%;
}
.green .progress .inner .glare,
.red .progress .inner .glare,
.orange .progress .inner .glare {
    background-color: rgba(255, 255, 255, 0.15);
}
.green .progress .inner .glare,
.red .progress .inner .glare,
.orange .progress .inner .glare {
    -webkit-transition: all 1s ease;
    transition: all 1s ease;
}
.green .progress .inner .percent,
.red .progress .inner .percent,
.orange .progress .inner .percent {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-weight: bold;
    text-align: center;
}
.green .progress .inner .percent,
.red .progress .inner .percent,
.orange .progress .inner .percent {
    line-height: 240px;
    font-size: 75px;
}
.green .progress .inner .percent {
    color: #fff;
}
.green .progress .inner .percent {
    /* text-shadow: 0 0 10px #fff; */
}
.green .progress .inner .percent,
.red .progress .inner .percent,
.orange .progress .inner .percent {
    -webkit-transition: all 1s ease;
    transition: all 1s ease;
    position:relative;
    z-index:1
}
#copyright {
    margin-top: 25px;
    background-color: transparent;
    font-size: 14px;
    color: #b3b3b3;
    text-align: center;
}
#copyright div {
    margin-bottom: 10px;
}
#copyright a,
#copyright a:link {
    color: #808080;
    text-decoration: none;
    border-bottom: 1px solid #808080;
    padding-bottom: 2px;
}
#copyright a:active {
    color: #b3b3b3;
}
#copyright a:hover {
    color: #b3b3b3;
    border-bottom: 1px solid #b3b3b3;
    padding-bottom: 4px;
}
.instructions {
    display: inline-block;
    margin: 5px 0;
    font-size: 16px;
}
@-webkit-keyframes spin {
    from {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
@keyframes spin {
    from {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
@keyframes biling {
  from {
     left: -40px
  }
  to {
    left: 100%
  }
}
  `;  
document.getElementsByTagName('head')[0].appendChild(css);
class CustomComp extends Component {
  state = {
    scaleX: document.documentElement.clientWidth / 3840,
    scaleY: document.documentElement.clientHeight / 1728,
    millCount: [],//运行设备 分子 分母
    kilnOutput: [],
    rawOutput: [],
    SHSOutput: [],
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        scaleX: document.documentElement.clientWidth / 3840,
        scaleY: document.documentElement.clientHeight / 1728,
      })
    })


    this.GetMillOutput();
    this.GetRawOutput();
    this.GetKilnOutput();
    this.GetSHSOutput();
    setInterval(() => {
      this.GetMillOutput();
      this.GetRawOutput();
      this.GetKilnOutput();
      this.GetSHSOutput()
    }, 5 * 1000);
    // 运行设备分子分母
  }

  //石灰石
  GetSHSOutput = () => {
    scriptUtil.excuteScriptService({
      objName: "ManuBrowser",
      serviceName: "GetSHSOutput",
      cb: (res) => {
        this.setState({
          SHSOutput: res.result
        })
      }
    });
  }

  //熟料
  GetKilnOutput = () => {
    scriptUtil.excuteScriptService({
      objName: "ManuBrowser",
      serviceName: "GetKilnOutput",
      cb: (res) => {
        this.setState({
          kilnOutput: res.result
        })
      }
    });
  }

  //水泥产量
  GetMillOutput = () => {
    scriptUtil.excuteScriptService({
      objName: "ManuBrowser",
      serviceName: "GetMillOutput",
      cb: (res) => {
        this.setState({
          millCount: res.result
        })
      }
    });
  }
  //生料
  GetRawOutput = () => {
    scriptUtil.excuteScriptService({
      objName: "ManuBrowser",
      serviceName: "GetRawOutput",
      cb: (res) => {
        this.setState({
          rawOutput: res.result
        })
      }
    });
  }

  getMillAccomplish = (data) => {
    return data.length ? (data.reduce((c, item) => { c += item.value; return c }, 0) / 10000).toFixed(1) : 0
  }

  getMillPlan = (data) => {
    return data.length ? (data.reduce((c, item) => { c += item.avgVal; return c }, 0) / 10000).toFixed(1) : 0
  }


  // get getMillAccomplish() {
  //   const { millCount } = this.state;
  //   return millCount.length ? (millCount.reduce((c, item) => { c += item.value; return c }, 0) / 10000).toFixed(1) : 0
  // }
  // get getMillPlan() {
  //   const { millCount } = this.state;
  //   return millCount.length ? (millCount.reduce((c, item) => { c += item.avgVal; return c }, 0) / 10000).toFixed(1) : 0
  // }
  render() {
    const { millCount, SHSOutput, rawOutput, kilnOutput } = this.state;
    return (
      <div
        style={{
          width: '3840px',
          height: '1728px',
          transform: `scale3d(${this.state.scaleX},${this.state.scaleY}, 1)`,
          transformOrigin: 'top left'
        }}
      >
        <div
          style={{
            width: '928px',
            height: '1411px',
            position: 'absolute',
            top: '233px',
            left: '30px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF.png)'
          }}>
          {/* <div
            style={{
              width: '720px',
              height: '58px',
              position: 'absolute',
              top: '47px',
              left: '64px',
              background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87%20%E6%B0%B4%E6%B3%A5.png)'
            }}>
          </div> */}
          <div style={{
            width: '800px',
            height: '321px',
            position: 'absolute',
            top: '219px',
            left: '64px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/05-1%E7%9F%A9%E5%BD%A2-1.png)'
          }}>
            <div class="green me-blue">
              <div class="progress">
                <div class="inner">
                  <div class="water" style={{ top: `${Math.ceil((1 - this.getMillAccomplish(SHSOutput) / this.getMillPlan(SHSOutput)) * 100)}%` }}></div>
                  <div class="glare"></div>
                  <div class="percent"><span>{Math.ceil(this.getMillAccomplish(SHSOutput) / this.getMillPlan(SHSOutput) * 100)}</span>%</div>
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >已完成</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '80px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  lineHeight: '80px',
                  marginRight: '20px',
                  textAlign: 'center',

                }}
              >{this.getMillAccomplish(SHSOutput)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
            <div
              style={{
                position: 'absolute',
                top: '160px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >产能</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '58px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: 'rgba(164,255,251,1)',
                  lineHeight: '58px',
                  marginRight: '20px',
                  textAlign: 'center',
                }}
              >{this.getMillPlan(SHSOutput)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
          </div>
          <div style={{
            width: '800px',
            position: 'absolute',
            top: '581px',
            left: '64px'
          }}>
            <div
              style={{
                width: '798px',
                height: '98px',
                position: 'relative',
                background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88www.png)'
              }}

            >
              <span
                style={{
                  position: 'absolute',
                  fontSize: '29px',
                  fontFamily: 'PingFangSC-Semibold,PingFang SC',
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: '29px',
                  top: '52px',
                  left: '20px'

                }}>
                详情
                            </span>
            </div>

            {
              SHSOutput.map(item =>
                <div style={{
                  width: '796px',
                  height: '109px',
                  background: '#00285b',
                  border: '1px solid #094275',
                  borderTop: 'none',
                  marginLeft: '2px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '597px',
                    borderRight: '2px solid #094275',
                    position: 'relative',
                  }}>
                    <div
                      style={{
                        display: 'inline-block',
                        width: '150px',
                        height: '109px',
                        fontSize: '29px',
                        fontFamily: 'PingFangSC-Semibold,PingFang SC',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,1)',
                        lineHeight: '109px',
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        width: `${Math.ceil(445 * item.value / item.avgVal)}px`,
                        maxWidth: 445,
                        display: 'inline-block',
                        background: '#116d71',
                        height: '64px',
                        margin: '22px 0',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          display: item.status ? 'bolck' : 'none',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          margin: 'auto',
                          width: '40px',
                          background: ' linear-gradient(90deg, transparent,rgba(255,255,255,.3), transparent)',
                          animation: `biling 3s ease-in-out infinite`
                        }}
                      ></div>
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: '6px',
                      height: '109px',
                      lineHeight: '109px'

                    }}>
                      <span
                        style={{
                          fontSize: '32px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,1)',
                        }}
                      >{Math.floor(item.value)}/</span>
                      <span
                        style={{
                          fontSize: '29px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: '#34b6cc',
                        }}
                      >{Math.floor(item.avgVal)} (吨)</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    width: '196px',
                    verticalAlign: 'top',
                    fontSize: '42px',
                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    lineHeight: '109px',
                    textAlign: 'center'
                  }}>
                    {(item.value / item.avgVal * 100).toFixed(2)}%
                                    </div>
                </div>


              )
            }

          </div>
        </div>


        <div
          style={{
            width: '928px',
            height: '1411px',
            position: 'absolute',
            top: '233px',
            left: '985px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF.png)'
          }}>
          {/* <div
            style={{
              width: '720px',
              height: '58px',
              position: 'absolute',
              top: '47px',
              left: '64px',
              background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87%20%E6%B0%B4%E6%B3%A5.png)'
            }}>
          </div> */}
          <div style={{
            width: '800px',
            height: '321px',
            position: 'absolute',
            top: '219px',
            left: '64px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/05-1%E7%9F%A9%E5%BD%A2-1.png)'
          }}>
            <div class="green">
              <div class="progress">
                <div class="inner">
                  <div class="water" style={{ top: `${Math.ceil((1 - this.getMillAccomplish(rawOutput) / this.getMillPlan(rawOutput)) * 100)}%` }}></div>
                  <div class="glare"></div>
                  <div class="percent"><span>{Math.ceil(this.getMillAccomplish(rawOutput) / this.getMillPlan(rawOutput) * 100)}</span>%</div>
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >已完成</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '80px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  lineHeight: '80px',
                  marginRight: '20px',
                  textAlign: 'center',

                }}
              >{this.getMillAccomplish(rawOutput)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
            <div
              style={{
                position: 'absolute',
                top: '160px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >产能</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '58px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: 'rgba(164,255,251,1)',
                  lineHeight: '58px',
                  marginRight: '20px',
                  textAlign: 'center',
                }}
              >{this.getMillPlan(rawOutput)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
          </div>
          <div style={{
            width: '800px',
            position: 'absolute',
            top: '581px',
            left: '64px'
          }}>
            <div
              style={{
                width: '798px',
                height: '98px',
                position: 'relative',
                background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88www.png)'
              }}

            >
              <span
                style={{
                  position: 'absolute',
                  fontSize: '29px',
                  fontFamily: 'PingFangSC-Semibold,PingFang SC',
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: '29px',
                  top: '52px',
                  left: '20px'

                }}>
                详情
                            </span>
            </div>

            {
              rawOutput.map(item =>
                <div style={{
                  width: '796px',
                  height: '109px',
                  background: '#00285b',
                  border: '1px solid #094275',
                  borderTop: 'none',
                  marginLeft: '2px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '597px',
                    borderRight: '2px solid #094275',
                    position: 'relative',
                  }}>
                    <div
                      style={{
                        display: 'inline-block',
                        width: '150px',
                        height: '109px',
                        fontSize: '29px',
                        fontFamily: 'PingFangSC-Semibold,PingFang SC',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,1)',
                        lineHeight: '109px',
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        width: `${Math.ceil(445 * item.value / item.avgVal)}px`,
                        display: 'inline-block',
                        maxWidth: 445,
                        background: '#116d71',
                        height: '64px',
                        margin: '22px 0',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          display: item.status ? 'bolck' : 'none',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          margin: 'auto',
                          width: '40px',
                          background: ' linear-gradient(90deg, transparent,rgba(255,255,255,.3), transparent)',
                          animation: `biling 3s ease-in-out infinite`
                        }}
                      ></div>
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: '6px',
                      height: '109px',
                      lineHeight: '109px'

                    }}>
                      <span
                        style={{
                          fontSize: '32px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,1)',
                        }}
                      >{Math.floor(item.value)}/</span>
                      <span
                        style={{
                          fontSize: '29px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: '#34b6cc',
                        }}
                      >{Math.floor(item.avgVal)} (吨)</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    width: '196px',
                    verticalAlign: 'top',
                    fontSize: '42px',
                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    lineHeight: '109px',
                    textAlign: 'center'
                  }}>
                    {(item.value / item.avgVal * 100).toFixed(2)}%
                                    </div>
                </div>


              )
            }

          </div>
        </div>

        <div
          style={{
            width: '928px',
            height: '1411px',
            position: 'absolute',
            top: '233px',
            left: '1945px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF.png)'
          }}>
          {/* <div
            style={{
              width: '720px',
              height: '58px',
              position: 'absolute',
              top: '47px',
              left: '64px',
              background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87%20%E6%B0%B4%E6%B3%A5.png)'
            }}>
          </div> */}
          <div style={{
            width: '800px',
            height: '321px',
            position: 'absolute',
            top: '219px',
            left: '64px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/05-1%E7%9F%A9%E5%BD%A2-1.png)'
          }}>
            <div class="green me-yellow">
              <div class="progress">
                <div class="inner">
                  <div class="water" style={{ top: `${Math.ceil((1 - this.getMillAccomplish(kilnOutput) / this.getMillPlan(kilnOutput)) * 100)}%` }}></div>
                  <div class="glare"></div>
                  <div class="percent"><span>{Math.ceil(this.getMillAccomplish(kilnOutput) / this.getMillPlan(kilnOutput) * 100)}</span>%</div>
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >已完成</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '80px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  lineHeight: '80px',
                  marginRight: '20px',
                  textAlign: 'center',

                }}
              >{this.getMillAccomplish(kilnOutput)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
            <div
              style={{
                position: 'absolute',
                top: '160px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >产能</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '58px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: 'rgba(164,255,251,1)',
                  lineHeight: '58px',
                  marginRight: '20px',
                  textAlign: 'center',
                }}
              >{this.getMillPlan(kilnOutput)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
          </div>
          <div style={{
            width: '800px',
            position: 'absolute',
            top: '581px',
            left: '64px'
          }}>
            <div
              style={{
                width: '798px',
                height: '98px',
                position: 'relative',
                background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88www.png)'
              }}

            >
              <span
                style={{
                  position: 'absolute',
                  fontSize: '29px',
                  fontFamily: 'PingFangSC-Semibold,PingFang SC',
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: '29px',
                  top: '52px',
                  left: '20px'

                }}>
                详情
                            </span>
            </div>

            {
              kilnOutput.map(item =>
                <div style={{
                  width: '796px',
                  height: '109px',
                  background: '#00285b',
                  border: '1px solid #094275',
                  borderTop: 'none',
                  marginLeft: '2px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '597px',
                    borderRight: '2px solid #094275',
                    position: 'relative',
                  }}>
                    <div
                      style={{
                        display: 'inline-block',
                        width: '150px',
                        height: '109px',
                        fontSize: '29px',
                        fontFamily: 'PingFangSC-Semibold,PingFang SC',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,1)',
                        lineHeight: '109px',
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        width: `${Math.ceil(445 * item.value / item.avgVal)}px`,
                        display: 'inline-block',
                        maxWidth: 445,
                        background: '#116d71',
                        height: '64px',
                        margin: '22px 0',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          display: item.status ? 'bolck' : 'none',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          margin: 'auto',
                          width: '40px',
                          background: ' linear-gradient(90deg, transparent,rgba(255,255,255,.3), transparent)',
                          animation: `biling 3s ease-in-out infinite`
                        }}
                      ></div>
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: '6px',
                      height: '109px',
                      lineHeight: '109px'

                    }}>
                      <span
                        style={{
                          fontSize: '32px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,1)',
                        }}
                      >{Math.floor(item.value)}/</span>
                      <span
                        style={{
                          fontSize: '29px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: '#34b6cc',
                        }}
                      >{Math.floor(item.avgVal)} (吨)</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    width: '196px',
                    verticalAlign: 'top',
                    fontSize: '42px',
                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    lineHeight: '109px',
                    textAlign: 'center'
                  }}>
                    {(item.value / item.avgVal * 100).toFixed(2)}%
                                    </div>
                </div>


              )
            }

          </div>
        </div>

        <div
          style={{
            width: '928px',
            height: '1411px',
            position: 'absolute',
            top: '233px',
            left: '2905px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%8C%BA%E5%9F%9F%E8%83%8C%E6%99%AF.png)'
          }}>
          {/* <div
            style={{
              width: '720px',
              height: '58px',
              position: 'absolute',
              top: '47px',
              left: '64px',
              background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF%E8%AE%BE%E5%A4%87%20%E6%B0%B4%E6%B3%A5.png)'
            }}>
          </div> */}
          <div style={{
            width: '800px',
            height: '321px',
            position: 'absolute',
            top: '219px',
            left: '64px',
            background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/05-1%E7%9F%A9%E5%BD%A2-1.png)'
          }}>
            <div class="green me-red">
              <div class="progress">
                <div class="inner">
                  <div class="water" style={{ top: `${Math.ceil((1 - this.getMillAccomplish(millCount) / this.getMillPlan(millCount)) * 100)}%` }}></div>
                  <div class="glare"></div>
                  <div class="percent"><span>{Math.ceil(this.getMillAccomplish(millCount) / this.getMillPlan(millCount) * 100)}</span>%</div>
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >已完成</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '80px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  lineHeight: '80px',
                  marginRight: '20px',
                  textAlign: 'center',

                }}
              >{this.getMillAccomplish(millCount)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
            <div
              style={{
                position: 'absolute',
                top: '160px',
                left: '360px',
                padding: '20px'
              }}>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >产能</span>
              <span
                style={{
                  width: '180px',
                  display: 'inline-block',
                  fontSize: '58px',
                  fontFamily: 'DINAlternate-Bold,DINAlternate',
                  fontWeight: 'bold',
                  color: 'rgba(164,255,251,1)',
                  lineHeight: '58px',
                  marginRight: '20px',
                  textAlign: 'center',
                }}
              >{this.getMillPlan(millCount)}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontFamily: 'PingFangSC-Regular,PingFang SC',
                  fontWeight: 400,
                  color: 'rgba(77,193,215,1)',
                  lineHeight: '51px',
                  marginRight: '20px'
                }}
              >万吨</span>

            </div>
          </div>
          <div style={{
            width: '800px',
            position: 'absolute',
            top: '581px',
            left: '64px'
          }}>
            <div
              style={{
                width: '798px',
                height: '98px',
                position: 'relative',
                background: 'url(/resource/App_97ffcc0d69634043ae5aa504559681d9/imgs/%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88www.png)'
              }}

            >
              <span
                style={{
                  position: 'absolute',
                  fontSize: '29px',
                  fontFamily: 'PingFangSC-Semibold,PingFang SC',
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: '29px',
                  top: '52px',
                  left: '20px'

                }}>
                详情
                            </span>
            </div>

            {
              millCount.map(item =>
                <div style={{
                  width: '796px',
                  height: '109px',
                  background: '#00285b',
                  border: '1px solid #094275',
                  borderTop: 'none',
                  marginLeft: '2px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '597px',
                    borderRight: '2px solid #094275',
                    position: 'relative',
                  }}>
                    <div
                      style={{
                        display: 'inline-block',
                        width: '150px',
                        height: '109px',
                        fontSize: '29px',
                        fontFamily: 'PingFangSC-Semibold,PingFang SC',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,1)',
                        lineHeight: '109px',
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        width: `${Math.ceil(445 * item.value / item.avgVal)}px`,
                        display: 'inline-block',
                        maxWidth: 445,
                        background: '#116d71',
                        height: '64px',
                        margin: '22px 0',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          display: item.status ? 'bolck' : 'none',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          margin: 'auto',
                          width: '40px',
                          background: ' linear-gradient(90deg, transparent,rgba(255,255,255,.3), transparent)',
                          animation: `biling 3s ease-in-out infinite`
                        }}
                      ></div>
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: '6px',
                      height: '109px',
                      lineHeight: '109px'

                    }}>
                      <span
                        style={{
                          fontSize: '32px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,1)',
                        }}
                      >{Math.floor(item.value)}/</span>
                      <span
                        style={{
                          fontSize: '29px',
                          fontFamily: 'PingFangSC-Semibold,PingFang SC',
                          fontWeight: 600,
                          color: '#34b6cc',
                        }}
                      >{Math.floor(item.avgVal)} (吨)</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    width: '196px',
                    verticalAlign: 'top',
                    fontSize: '42px',
                    fontFamily: 'DINAlternate-Bold,DINAlternate',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    lineHeight: '109px',
                    textAlign: 'center'
                  }}>
                    {(item.value / item.avgVal * 100).toFixed(2)}%
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div >
    );
  }


}

export default CustomComp;
