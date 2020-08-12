import React, { Component } from 'react';
import { DatePicker, Icon, Upload, Checkbox, Input, message, InputNumber } from 'antd';
import moment from 'moment';
const { Dragger } = Upload;
// 日期控件格式
const dateFormat = 'YYYY-MM-DD';
class CustomComp extends Component {
    state = {
        // 获取当前用户
        Code: '',
        staffName: '',
        staffCode: '',
        // 运单记录
        postInfoweightLeftHead: '',         
        postInfoweightLeftBody: '',
        postInfoweightLeftFoot: '',
        postInfoweightRightHead: '',         
        postInfoweightRightBody: '',
        postInfoweightRightFoot: '',
        postInfonullLeftHead: '',         
        postInfonullLeftBody: '',
        postInfonullLeftFoot: '',
        postInfonullRightHead: '',         
        postInfonullRightBody: '',
        postInfonullRightFoot: '',
        postInfoPost: '',
        // 实测记录
        instanceInfoweightLeftHead: '',         
        instanceInfoweightLeftBody: '',
        instanceInfoweightLeftFoot: '',
        instanceInfoweightRightHead: '',         
        instanceInfoweightRightBody: '',
        instanceInfoweightRightFoot: '',
        instanceInfonullLeftHead: '',         
        instanceInfonullLeftBody: '',
        instanceInfonullLeftFoot: '',
        instanceInfonullRightHead: '',         
        instanceInfonullRightBody: '',
        instanceInfonullRightFoot: '',
        instanceInfoPost: '',
        boatNo: '', // 船号
        arriveTime: '', // 报港时间
        kgTime: '', // 靠港时间
        isjszzInput: '', // 有无积水
        jszzInput: '', // 有无积水描述
        isyzhInput: '',// 有无卸载前抓痕
        yzhInput: '', // 有无卸载前抓痕描述
        xkTime: '', // 卸空时间
        isyjInput: '', // 有无卸前印记
        yjInput: '',// 有无卸前印记描述
        ishbInput: '', // 有无卸前画布
        hbInput: '',// 有无卸前画布描述
        coalType:''
    }
    componentDidMount() {
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
    }
    componentWillMount() {
        this.disabledEdit = true;
        const Code = scriptUtil.getFormData(['Code']).Code;
        scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getBgTotal",
            params: { code: Code },
            cb: (res) => {
                console.log(res);
                this.setState(_.get(res, 'result.list[0]', {}))
            }
        });
    }
    postInputChange = (value, key, otherKey) => {
        this.setState({
            [key]: value,
            [otherKey]: value
        }, () => {
            scriptUtil.setFormData({
                [key]: value,
                [otherKey]: value
            });
        })
    }

    instanceInputChange = (value, key) => {
        this.setState({
            [key]: value
        }, () => {
            scriptUtil.setFormData({
                [key]: value,
            });
        })
    }

    renderpost = () => {
        return (
            <div>
                <div style={titleHead}>
                    运单记录
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>项目</div>
                    <div style={topTitleStyle}>部位</div>
                    <div style={topTitleStyle}>首</div>
                    <div style={topTitleStyle}>中</div>
                    <div style={topTitleStyle}>尾</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyleDouble}>重载</div>
                    <div style={{ flex: 4 }}>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>左</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfoweightLeftHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightLeftHead', 'instanceInfoweightLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfoweightLeftBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightLeftBody', 'instanceInfoweightLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfoweightLeftFoot}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightLeftFoot', 'instanceInfoweightLeftFoot') }}
                                />
                            </div>
                        </div>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>右</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfoweightRightHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightRightHead', 'instanceInfoweightRightHead') }}/>
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfoweightRightBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightRightBody', 'instanceInfoweightRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfoweightRightFoot}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightRightFoot', 'instanceInfoweightRightFoot') }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyleDouble}>空载</div>
                    <div style={{ flex: 4 }}>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>左</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfonullLeftHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullLeftHead', 'instanceInfonullLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfonullLeftBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullLeftBody', 'instanceInfonullLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfonullLeftFoot}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullLeftFoot', 'instanceInfonullLeftFoot') }}
                                />
                            </div>
                        </div>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>右</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfonullRightHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullRightHead', 'instanceInfonullRightHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfonullRightBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullRightBody', 'instanceInfonullRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.postInfonullRightFoot}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullRightFoot', 'instanceInfonullRightFoot') }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>水运单吨位</div>
                    <div style={topDescStyle4}>
                        <Input
                            type='number'
                            disabled={this.disabledEdit}
                            style={commonStyle}
                            value={this.state.postInfoPost}
                            onChange={(e) => { this.postInputChange(e.target.value, 'postInfoPost', 'instanceInfoPost') }}
                        />
                    </div>
                </div>
            </div>
        );
    }
    renderInstance = () => {
        return (
            <div>
                <div style={titleHead}>
                    实测记录
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>项目</div>
                    <div style={topTitleStyle}>部位</div>
                    <div style={topTitleStyle}>首</div>
                    <div style={topTitleStyle}>中</div>
                    <div style={topTitleStyle}>尾</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyleDouble}>重载</div>
                    <div style={{ flex: 4 }}>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>左</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfoweightLeftHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfoweightLeftBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfoweightLeftFoot}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightLeftFoot') }}
                                />
                            </div>
                        </div>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>右</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfoweightRightHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightRightHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfoweightRightBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfoweightRightFoot}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightRightFoot') }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyleDouble}>空载</div>
                    <div style={{ flex: 4 }}>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>左</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfonullLeftHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfonullLeftBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfonullLeftFoot}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullLeftFoot') }}
                                />
                            </div>
                        </div>
                        <div style={topDivContainerStyle}>
                            <div style={topDescStyle}>右</div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfonullRightHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullRightHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfonullRightBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'
                                    disabled={this.disabledEdit}
                                    style={commonStyle}
                                    value={this.state.instanceInfonullRightFoot}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullRightFoot') }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>实卸吨位</div>
                    <div style={topDescStyle4}>
                        <Input
                            type='number'
                            disabled={this.disabledEdit}
                            style={commonStyle}
                            value={this.state.instanceInfoPost}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoPost') }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderDiff = () => {
        return (
            <div>
                <div style={titleHead}>
                    皮带秤计量与运单吨位差异
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>靠港日期</div>
                    <div style={topDescStyle4}>
                        <DatePicker
                            disabled={this.disabledEdit}
                            value={this.state.kgTime ? moment(this.state.kgTime, dateFormat) : null}
                            style={commonStyle}
                            onChange={(date, dateString) => {this.instanceInputChange(dateString, 'kgTime')}}
                        ></DatePicker>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>杂物积水</div>
                    <div style={topDescStyle}>
                        <Checkbox
                            disabled={this.disabledEdit}
                            checked={this.state.isjszzInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'isjszzInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            disabled={!this.state.isjszzInput  || this.disabledEdit}
                            value={this.state.jszzInput}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'jszzInput') }}
                        />
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸载前抓痕</div>
                    <div style={topDescStyle}>
                        <Checkbox
                            disabled={this.disabledEdit}
                            checked={this.state.isyzhInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'isyzhInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            disabled={!this.state.isyzhInput || this.disabledEdit}
                            value={this.state.yzhInput}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'yzhInput') }}
                        />
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸空时间</div>
                    <div style={topDescStyle4}>
                        <DatePicker
                            disabled={this.disabledEdit}
                            style={commonStyle}
                            onChange={(date, dateString) => {this.instanceInputChange(dateString, 'xkTime')}}
                            value={this.state.xkTime ? moment(this.state.xkTime, dateFormat) : null}
                        ></DatePicker>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸前印记</div>
                    <div style={topDescStyle}>
                        <Checkbox
                            disabled={this.disabledEdit}
                            checked={this.state.isyjInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'isyjInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            value={this.state.yjInput}
                            disabled={!this.state.isyjInput || this.disabledEdit}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'yjInput') }}
                        />
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸前雨布</div>
                    <div style={topDescStyle}>
                        <Checkbox
                            disabled={this.disabledEdit}
                            checked={this.state.ishbInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'ishbInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            disabled={!this.state.ishbInput || this.disabledEdit}
                            value={this.state.hbInput}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'hbInput') }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderPhoto = () => {
        const props = {
            name: 'file',
            multiple: true,
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            onChange(info) {
              const { status } = info.file;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
              } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
          };
        return (
            <div>
                <div style={titleHead}>
                    拍照上传
                </div>
                <div style={topDivContainerStyle}>
                    <div style={photoArea}>
                        <Icon type="camera" style={{ fontSize: '36px',color: '#2D7DF6' } }/>
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div style={containerStyle}
                ref={ref => this.scrollDiv = ref}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}dateFormat
                onScroll={this.handleScroll}
            >
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>船号</div>
                    <div style={topTitleStyle}>报岗日期</div>
                    <div style={topTitleStyle}>烟煤</div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>
                        <Input
                            disabled={this.disabledEdit}
                            style={commonStyle}
                            value={this.state.boatNo}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'boatNo') }}
                        />
                    </div>
                    <div style={topDescStyle}>
                        <DatePicker
                            style={commonStyle}
                            disabled={this.disabledEdit}
                            value={this.state.arriveTime ? moment(this.state.arriveTime, dateFormat) : null}
                            onChange={(date, dateString) => {this.instanceInputChange(dateString, 'arriveTime')}}
                        ></DatePicker>
                    </div>
                    <div style={topDescStyle}>
                        <Input
                            disabled={this.disabledEdit}
                            style={commonStyle}
                            value={this.state.coalType}
                        />
                    </div>
                </div>

                {this.renderpost()}
                {this.renderInstance()}
                {this.renderDiff()}
                {this.renderPhoto()}
            </div>
        );
    }
    // ----------处理滚动开始, 应该不用动----------
    handleTouchStart = (e) => {
        this.startPosition = e.changedTouches[0].clientY;
    }

    handleTouchMove = (e) => {
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

    handleScrollModal = (e) => {
        e.preventDefault();
    }
    // ----------处理滚动结束, 应该不用动----------
}

export default CustomComp;

const containerStyle = {
    height: '100vh',
    width: '100%',
    overflowY: 'hidden',
    paddingBottom: 10,
    background: '#F0F4FC'
};
const backgroundColor = '#f5f6fa';
const borderColor = '#e6e9f0';
const fontColor = {
    primary: '#1f2e4d',
    secondary: '#49565e',
    red: '#f05656'
};
const photoArea = {
    width: '90%',
    height: '120px',
    border: '1px dashed #2D7DF6',
    lineHeight: '133px',
    textAlign: 'center',
    margin: '10px auto 0',
    background: '#fff'
}

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

const titleHead = {
    height: '50px',
    lineHeight: '50px',
    fontSize: '16px',
    border: '1px solid rgb(230, 233, 240)',
    background: '#F7F9FC',
    fontWeight: 'bold',
    padding: '0 10px',
    marginTop: '15px'
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
    margin: '-1px 0 0 -1px'
}

const topDescStyle3 = {
    height: 50,
    lineHeight: '50px',
    fontSize: 12,
    color: fontColor.secondary,
    textAlign: 'center',
    flex: 3,
    width: '33.33%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}
const topDescStyle4 = {
    height: 50,
    lineHeight: '50px',
    fontSize: 12,
    color: fontColor.secondary,
    textAlign: 'center',
    flex: 4,
    width: '33.33%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: `solid 1px ${borderColor}`,
    margin: '-1px 0 0 -1px'
}
const topDescStyleDouble = {
    height: 100,
    lineHeight: '100px',
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
    margin: '-1px 0 0 -1px'
}


const commonStyle = {
    width: '90%'
}
