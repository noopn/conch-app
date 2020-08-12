import React, { Component } from 'react';

class CustomComp extends Component {
    state = {
        active: ''
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
        // let mark = true;
        // let arr = []
        // window.addEventListener('touchstart', (e) => {
        //     mark = true;
        // })
        // window.addEventListener('touchmove', (e) => {
        //     arr.push([e.touches[0].clientX, e.touches[0].clientY])
        // })
        // window.addEventListener('touchend', (e) => {
        //     mark = false;
        //     // alert(arr.length)
        //     if (arr.length < 120) { arr = []; return false };
        //     var len = arr.length - 1;
        //     var disarr = [];
        //     for (let i = 0; i + 40 < len; i++) {
        //         var p1 = arr[i];
        //         var p2 = arr[20 + i];
        //         var p3 = arr[40 + i];
        //         // var x = ((Math.pow(p1[0], 2) + Math.pow(p1[1], 2)) * (p2[1] - p3[1]) + (Math.pow(p2[0], 2) + Math.pow(p2[1], 2)) * (p3[1] - p1[1]) + (Math.pow(p3[0], 2) + Math.pow(p3[1], 2)) * (p1[1] - p2[1])) /
        //         //     2 * (p1[0] * (p2[1] - p3[1]) - p1[1] * (p2[0] - p3[0]) + p2[0] * p3[1] - p3[0] * p2[1]);
        //         // var y = ((Math.pow(p1[0], 2) + Math.pow(p1[1], 2)) * (p3[0] - p2[0]) + (Math.pow(p2[0], 2) + Math.pow(p2[1], 2)) * (p1[0] - p3[0]) + (Math.pow(p3[0], 2) + Math.pow(p3[1], 2)) * (p2[0] - p1[0])) /
        //         //     2 * (p1[0] * (p2[1] - p3[1]) - p1[1] * (p2[0] - p3[0]) + p2[0] * p3[1] - p3[0] * p2[1]);
        //         var a = 2 * (p2[0] - p1[0]);
        //         var b = 2 * (p2[1] - p1[1]);
        //         var c = p2[0] * p2[0] + p2[1] * p2[1] - p1[0] * p1[0] - p1[1] * p1[1];
        //         var d = 2 * (p3[0] - p2[0]);
        //         var e = 2 * (p3[1] - p2[1]);
        //         var f = p3[0] * p3[0] + p3[1] * p3[1] - p2[0] * p2[0] - p2[1] * p2[1];
        //         var x = (b * f - e * c) / (b * d - e * a);
        //         var y = (d * c - a * f) / (b * d - e * a);
        //         disarr.push([x, y]);
        //     }
        //     var xavg = disarr.reduce((sum, val) => { sum += val[0]; return sum }, 0) / disarr.length;
        //     var yavg = disarr.reduce((sum, val) => { sum += val[1]; return sum }, 0) / disarr.length;
        //     var s2 = disarr.reduce((sum, val) => { sum += (val[0] - xavg) * (val[1] - yavg); return sum }, 0) / (disarr.length - 1);
        //     arr = [];
        //     if (Math.abs(s2) < 110) {
        //         scriptUtil.excuteScriptService({
        //             objName: "platform",
        //             serviceName: "setPropertyValue",
        //             params: { propName: 'newTabName', propValue: 'refresh' }
        //         });
        //     }
        // })

    }

    render() {
        const map = [
            { name: '生产', id: 8, width: 'calc(50% - 15px)', style: { borderRadius: '10px', overflow: 'hidden' }, value: 'produce', pic: '/resource/App_12b343cad4354915ac57078dfd689b14/22.jpg', show: true },
            { name: '码头', id: 6, width: 'calc(50% - 15px)', style: {}, value: 'wharf', pic: '/resource/App_36df0635c96949988e5a6e0d1adcb3a4/img/img_m3.jpg', },
            { name: '设备', id: 2, width: 'calc(50% - 15px)', tyle: {}, value: 'equipment', pic: '/resource/App_36df0635c96949988e5a6e0d1adcb3a4/img/img_m4.jpg' },
            { name: '专家', id: 11, width: 'calc(50% - 15px)', style: { borderRadius: '10px', overflow: 'hidden' }, value: 'specialist', pic: '/resource/App_12b343cad4354915ac57078dfd689b14/22.jpg', show: true },
            // { name: '刷新', id: 11, width: 'calc(50% - 15px)', style: { borderRadius: '10px', overflow: 'hidden' }, value: 'refresh', pic: '/resource/App_12b343cad4354915ac57078dfd689b14/22.jpg', show: true },
            // { id: null, width: 'calc(50% - 15px)', style: { visibility: 'hidden' } },

            // { name: '总览', id: 1, width: 'calc(50% - 15px)', tyle: {}, value: 'overview', pic: '/resource/App_36df0635c96949988e5a6e0d1adcb3a4/img/img_m5.jpg' },
            // { name: '能源', id: 3, width: 'calc(50% - 15px)', tyle: {}, value: 'energy', pic: '/resource/App_36df0635c96949988e5a6e0d1adcb3a4/img/img_m6.jpg' },
            // { name: '制造', id: 4, width: 'calc(50% - 15px)', tyle: {}, value: 'manufacture', pic: '/resource/App_36df0635c96949988e5a6e0d1adcb3a4/img/img_m7.jpg' },
            // { name: '矿山', id: 5, width: 'calc(50% - 15px)', tyle: {}, value: 'mine', pic: '/resource/App_36df0635c96949988e5a6e0d1adcb3a4/img/img_m8.jpg' },
            // { name: '生产', id: 7, width: 'calc(50% - 15px)', style: {}, value: 'produce', pic: '/resource/App_36df0635c96949988e5a6e0d1adcb3a4/img/img_m8备份.jpg' },

            // { name: '报表', id: 8, width: 'calc(50% - 15px)', style: { borderRadius: '10px', overflow: 'hidden' }, value: 'form', pic: '/resource/App_12b343cad4354915ac57078dfd689b14/22.jpg', show: true },
            // { name: '流程图', id: 9, width: 'calc(50% - 15px)', style: { borderRadius: '10px', overflow: 'hidden' }, value: 'flowChart', pic: '/resource/App_12b343cad4354915ac57078dfd689b14/22.jpg', show: true },
            // { name: '播报', id: 10, width: 'calc(50% - 15px)', style: { borderRadius: '10px', overflow: 'hidden' }, value: 'broadcast', pic: '/resource/App_12b343cad4354915ac57078dfd689b14/22.jpg', show: true },
            // { id: null, width: 'calc(50% - 15px)', style: { visibility: 'hidden' } },

        ]
        return (
            <React.Fragment>
                <div
                    style={containerStyle}
                    ref={ref => this.scrollDiv = ref}
                >
                    {
                        map.map(item => <div
                            style={{ ...butItem, ...{ width: item.width }, ...item.style }}
                            onClick={() => { item.id && this.handleClick(item.value) }}
                        >
                            <a style={alink} ><img src={item.pic} style={imgStyle} /> <span style={textSpan}>{item.show && item.name}</span></a>
                        </div>)
                    }

                </div >
                <div
                    onTouchEnd={this.refresh}
                    style={{
                        background: 'url(/resource/App_12b343cad4354915ac57078dfd689b14/img/%E5%88%B7%E6%96%B0.png) 0% 0% / 40px 40px',
                        width: '40px',
                        height: '40px',
                        position: 'fixed',
                        right: '20px',
                        bottom: '20px',
                        opacity: 0.1,
                        zIndex: 99
                    }}
                >
                </div>
            </React.Fragment>
        );
    }
    refresh = () => {
        scriptUtil.excuteScriptService({
            objName: "platform",
            serviceName: "setPropertyValue",
            params: { propName: 'newTabName', propValue: 'refresh' }
        });
    }
    handleClick = (value) => {
        if (value === 'flowChart' || value === 'form') {
            scriptUtil.excuteScriptService({
                objName: "platform",
                serviceName: "getPropertyValue",
                params: { propName: 'modalKey' },
                cb: function (res) {
                    scriptUtil.excuteScriptService({
                        objName: "platform",
                        serviceName: "setPropertyValue",
                        params: { propName: 'modalKey', propValue: res.result === value ? '' : value }
                    });
                }
            });
        } else {
            scriptUtil.excuteScriptService({
                objName: "platform",
                serviceName: "setPropertyValue",
                params: { propName: 'tabName', propValue: value }
            });
            scriptUtil.excuteScriptService({
                objName: "platform",
                serviceName: "setPropertyValue",
                params: { propName: 'newTabName', propValue: value }
            });
        }



    }
    // handleTouchStart = (e) => {
    //     this.startPosition = e.changedTouches[0].clientY;
    // }

    // handleTouchMove = (e) => {

    //     if (this.state.isAnalysisResultModalVisible) return;
    //     const currentPosition = e.changedTouches[0].clientY;
    //     // 部分手机没有scrollBy
    //     // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
    //     const scrollTop = this.scrollDiv.scrollTop;
    //     this.scrollDiv.scrollTop = scrollTop + this.startPosition - currentPosition;
    //     this.startPosition = currentPosition;
    // }

    // handleScroll = (e) => {
    //     e.preventDefault();
    // }



}


export default CustomComp;
const containerStyle = {
    height: '100%',
    margin: 'auto',
    padding: '35px 20px 45px 20px',
    overflow: 'hidden',
    overflowY: 'scroll',
    maxWidth: '640px',
    margin: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: ' space-around',
    alignContent: 'flex-start',
    background: '#1A1F2A',
};
const butItem = {
    position: 'relative',
    marginBottom: '35px'
}
const imgStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    margin: 'auto'
}
const alink = {
    position: 'relative',
    display: 'block',
    paddingTop: '60%',
}

const textSpan = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#FEFFFF',
    fontWeight: 'bold',
    fontSize: ' 24px',
}