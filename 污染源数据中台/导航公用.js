import React, { Component } from 'react';
const bg1 = '/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF1@2x.png'
const bg2 = '/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF2.png'
class CustomComp extends Component {
    render() {
        return (
            <div className='supos-comp-wrapper'>
                <header className='header'>
                    <img
                        src='/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E8%8F%9C%E5%8D%95%E8%83%8C%E6%99%AF@2x.png'
                        style={{
                            width: '1118px',
                            height: '90px',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            margin: 'auto',
                            top: '20px'
                        }}
                    />
                    <div style={{
                        width: '625px',
                        height: '82px',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '20px',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: '40px',
                        margin: 'auto',
                        display: 'flex',
                    }}>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg2}) no-repeat center / 99px 44px` }}
                          onClick={() => { location.hash = `#/runtime-fullscreen/runtime-fullscreen/Page_bf92ec85c1ad4588ade5d15edda0ca08` }}
                        >
                          总览
                        </div>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }}
                          onClick={() => { location.hash = '#/runtime-fullscreen/runtime-fullscreen/Page_a77b775b3468448f915b073492e06dce' }}
                        >
                          报警管理
                        </div>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }} 
                          onClick={() => {location.hash = `#/runtime-fullscreen/runtime-fullscreen/Page_4356cc4fa6a04729bff8bfdb8da0be60` }}
                        >
                          统计分析
                        </div>
                        <div 
                          style={{ width: '94px', height: '38px', fontSize: '16px', textAlign: 'center', lineHeight: '38px', color: '#fff', background: `url(${bg1}) no-repeat center / 99px 38px` }} 
                          onClick={() => {location.hash = `#/design/hellow` }}
                        >
                          系统管理
                        </div>
                    </div>
                    <img
                        src='/resource/App_ef783424fcea438b82ea1eb40afa8e16/%E7%83%9F%E5%8F%B0logo@2x.png'
                        style={{
                            width: '458px',
                            height: '60px',
                            position: 'absolute',
                            left: 0,
                            top: '20px'
                        }} />
                </header>
            </div>
        );
    }
}

export default CustomComp;


var css = document.createElement('style');
css.innerHTML = `
    .supos-comp-wrapper {
        width:100%;
        height:100%;
        position:relative;
    }
    .supos-comp-wrapper .header {
        height: 106px;
    }
    `;
document.getElementsByTagName('head')[0].appendChild(css);