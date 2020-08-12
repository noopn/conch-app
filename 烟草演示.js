import React, { Component } from 'react';
import { Table } from 'antd';
// import moment from 'moment';
const columns = [
  {
    title: '库区',
    dataIndex: 'kq',
    key: 'kq',
    render: text => <a>{text}</a>,
  },
  {
    title: '温度℃',
    dataIndex: 'wd',
    key: 'wd',
  },
  {
    title: '湿度%',
    dataIndex: 'sd',
    key: 'sd',
  },
  {
    title: '磷化氢PPM',
    dataIndex: 'lhq',
    key: 'lhq',
  },
];

const data = [
  {
    key: '1',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  },
  {
    key: '2',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  }, {
    key: '3',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  }, {
    key: '4',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  }, {
    key: '5',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  }, {
    key: '6',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  }, {
    key: '7',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  }, {
    key: '8',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  }, {
    key: '9',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  },
  {
    key: '10',
    kq: '1层A库',
    wd: 23.2,
    sd: 52,
    lhq: '0',
  },
];

const columns2 = [
  {
    title: '垛位',
    dataIndex: 'dw',
    key: 'dw',
    render: text => <a>{text}</a>,
  },
  {
    title: '温度℃',
    dataIndex: 'wd',
    key: 'wd',
  },
  {
    title: '湿度%',
    dataIndex: 'sd',
    key: 'sd',
  },
  {
    title: '磷化氢PPM',
    dataIndex: 'lhq',
    key: 'lhq',
  },
  {
    title: '含氧量',
    dataIndex: 'hyl',
    key: 'hyl',
  },
];
const data2 = [
  {
    key: '1',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  },
  {
    key: '2',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '3',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '4',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '5',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '6',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '7',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '8',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '9',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  }, {
    key: '10',
    dw: '1层A库1垛',
    wd: 23.2,
    sd: 52,
    lhq: '0',
    hyl: 20
  },
];
const columns3 = [
  {
    title: '包温',
    dataIndex: 'bw',
    key: 'bw',
    render: text => <a>{text}</a>,
  },
  {
    title: '温度℃',
    dataIndex: 'wd',
    key: 'wd',
  },
];
const data3 = [
  {
    key: '1',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  },
  {
    key: '2',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '3',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '4',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '5',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '6',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '7',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '8',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '9',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }, {
    key: '10',
    bw: '1层A库1垛（2，2，1）',
    wd: 23.2
  }
];
class CustomComp extends Component {
  baseStyle = {
    width: '100%',
    height: '100%',
  }
  state = {
    style: {},
    index: 0,
    hover: false,
    hover1: false,
    tableIndex: 0
  }
  scrArr = [
    'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E5%8F%8C%E7%BB%B4%E6%99%BA%E6%85%A7-%E5%85%A8%E5%8E%82.jpg',
    'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/pppp.jpg',
    'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E5%BA%93%E5%8C%BA%E7%8A%B6%E6%80%81.png',
    'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E4%B8%8A%E4%BD%8D%E6%B8%A9%E5%BA%A6.png'
  ]
  hotArr = [
    {
      normal: '',
      hover: ''
    }
  ]
  componentDidMount() {
    document.addEventListener('click', (e) => {
      this.pageX = e.pageX;
      this.pageY = e.pageY;
    }, true)
  }
  transformClick = (e) => {
    this.setState({
      hover: false,
      hover1: false,
      style: {
        ...this.baseStyle,
        transformOrigin: `${this.pageX}px ${this.pageY}px`,
        transform: `translate3d(${359 - this.pageX}px,${474 - this.pageY}px,50px)`,
        transition: '1s',
        position: 'relative',
        opacity: 0,
      }
    })
    setTimeout(() => {
      this.setState(state => ({
        index: state.index + 1,
        style: {
          ...this.baseStyle,
        }
      }))
    }, 1100)
  }
  back = () => {
    this.setState(state => ({
      index: state.index - 1,
    }))
  }
  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          perspective: 200,
          position: 'relative'
        }}
      >
        {this.state.index && <img
          src='http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/back.png'
          onClick={this.back}
          style={{
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '10px',
            top: '10px',
            zIndex: 99
          }}>
        </img>}

        <div
          style={this.state.style}
        >
          <img
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0
            }}
            src={this.scrArr[this.state.index]}
          />
          {this.state.index === 0 && [
            <img
              onClick={this.transformClick}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
              src={this.state.hover ?
                'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E6%A5%BC%E5%8C%BA%E5%9F%9Fhoverx.png'
                : 'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E6%A5%BC%E5%8C%BA%E5%9F%9Fnor.png'}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                width: '25%',
                height: '18%',
                left: '50%',
                top: '6.4%',
                zIndex: 99
              }}
            />,
            <img
              onClick={() => scriptUtil.openPage('http://supos235.demo.supos.net:8001/#/runtime-fullscreen/runtime-fullscreen/Page_71547efab32a4d9b9aa88f57944ca791', '_self')}
              onMouseEnter={() => this.setState({ hover1: true })}
              onMouseLeave={() => this.setState({ hover1: false })}
              src={this.state.hover1 ?
                'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E9%BC%A0%E6%A0%87hover.png'
                : 'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/1px.png'}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                width: '24%',
                height: '27%',
                left: '31%',
                top: '31.4%',
                zIndex: 99
              }}
            />,
            <div id='container'></div>
          ]}
          {this.state.index === 1 && [
            <img
              onClick={this.transformClick}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
              src={this.state.hover ?
                'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/9cxxxhover.png'
                : 'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/9xxxnor.png'}

              style={{
                cursor: 'pointer',
                position: 'absolute',
                width: '15.8%',
                height: '22%',
                left: '45%',
                top: '45.3%',
                zIndex: 99
              }}
            />,
            <img
              src='http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200520162209.png'
              style={{
                position: 'absolute',
                width: '21%',
                height: '39%',
                left: '76%',
                top: '10.4%',
                zIndex: 99
              }}
            />,
            <img
              style={{
                position: 'absolute',
                width: '21%',
                height: '39%',
                left: '76%',
                top: '49.4%',
                zIndex: 99
              }}
              src='http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200520162402.png'
            />
          ]}
          {this.state.index === 2 && [
            <img
              onClick={this.transformClick}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
              src={this.state.hover ?
                'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/hover222.png'
                : 'http://supos235.demo.supos.net:8001/resource/App_05ae2aa127cd4bd6986504b9f1ccb58e/image/1px.png'}

              style={{
                cursor: 'pointer',
                position: 'absolute',
                width: '10%',
                height: '7.2%',
                left: '3.5%',
                top: '11.3%',
                zIndex: 99
              }}
            />,
            <div
              style={{
                position: 'absolute',
                width: '23%',
                right: '4%',
                top: '12%',
                zIndex: 99
              }}
            >

              {
                this.state.tableIndex === 0 &&
                < Table
                  style={{ cursor: 'pointer' }}
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  onRow={record => {
                    return {
                      onClick: event => { this.setState({ tableIndex: 1 }) }, // 点击行
                    };
                  }}
                />
              }
              {
                this.state.tableIndex === 1 &&
                < Table
                  style={{ cursor: 'pointer' }}
                  columns={columns2}
                  dataSource={data2}
                  pagination={false}
                  onRow={record => {
                    return {
                      onClick: event => { this.setState({ tableIndex: 2 }) }, // 点击行
                    };
                  }}
                />
              }
              {
                this.state.tableIndex === 2 &&
                < Table
                  style={{ cursor: 'pointer' }}
                  columns={columns3}
                  dataSource={data3}
                  pagination={false}
                />
              }
            </div>
          ]
          }
        </div>
      </div>
    );
  }

}


export default CustomComp;

const fontColor = {

};

