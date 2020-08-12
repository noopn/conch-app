import React, { Component } from 'react';
import { Skeleton, Button, Select, DatePicker, message } from 'antd';
import moment from 'moment';
var nod = document.createElement('style'),
    str = `
    .ant-radio-wrapper .ant-radio .ant-radio-inner{
        background-size: 20px;
    }
    .ant-radio-inner{
        width: 20px;
        height: 20px;
    }
    .ant-radio{
        float:right
    }
    `;
nod.type = 'text/css';
nod.innerHTML = str;
nod.id = 'CustomComp'
document.getElementsByTagName('head')[0].appendChild(nod);

class CustomComp extends Component {
    state = {
        isSaveOkModalVisible: false,
        loading: true,
        cenmentMillByID: [],
        cenmentMillData: {},
        cenmentMill: '',//水泥磨列表
        cementUpBeltData: {},
        cementUpBeltByID: [],
        cementUpBelt: '',//皮带秤列表
        matieralFromBeltData: {},
        matieralFromBeltByID: [],
        matieralFromBelt: '',//物料列表
        kindType: {},
        date: moment(),
        isSubmiting: false
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
        _.map(['touchstart'], (event) => {
            this.selector1 && this.selector1.addEventListener(event, (e) => {
                e.stopPropagation();
            });
            this.selector2 && this.selector2.addEventListener(event, (e) => {
                e.stopPropagation();
            });
            this.selector3 && this.selector3.addEventListener(event, (e) => {
                e.stopPropagation();
            });
        });
        scriptUtil.getUserInfo(user => {
            scriptUtil.excuteScriptService({
                objName: "ZLGL",
                serviceName: "getUsersSessionInfo",
                params: { "username": user.userInfo.username },
                cb: (res) => {
                    const temp = {
                        staffName: res.result.userInfo.staffName, // 分析人
                        staffCode: res.result.userInfo.staffCode, // 分析人id
                        scDate: moment().clone().add(-2, 'days').format('YYYY-MM-DD'), // 生产日期
                        fxDate: moment().format('YYYY-MM-DD'), // 分析date
                    }
                    const selectDate = moment().clone().add(-2, 'days').format('YYYY-MM-DD');
                    this.setState({ mainInfo: temp });
                    this.setState({ billCode: selectDate });
                }
            });
        });

        new Promise((resolve, reject) => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "getCementMill",
                cb: (res) => {
                    const cenmentMill = _.get(res, 'result[0].name');
                    this.setState({
                        cenmentMillData: _.reduce(res.result, (obj, item) => { obj[item.name] = { ...item, id: item.name }; return obj }, {}),
                        cenmentMillByID: _.map(res.result, (item) => item.name),
                        cenmentMill,
                    })
                    resolve(cenmentMill);
                }
            });
        }).then((cenmentMill) => {
            const p1 = new Promise((resolve) => {
                scriptUtil.excuteScriptService({
                    objName: "SCGL",
                    serviceName: "getCementUpBelt",
                    params: { object: cenmentMill },
                    cb: (res) => {
                        resolve(res)
                    }
                });
            })
            const p2 = new Promise((resolve) => {
                scriptUtil.excuteScriptService({
                    objName: "SCGL",
                    serviceName: "GetMatieralFromBelt",
                    params: { isExistName: cenmentMill },
                    cb: (res) => {
                        resolve(res);
                    }
                });
            });
            return Promise.all([p1, p2]).then(res => {
                const cementUpBelt = _.get(res[0], 'result[0].value');
                const matieralFromBelt = _.get(res[1], 'result[0].ID');
                if (res[0].code === '200') {
                    this.setState({
                        cementUpBeltData: _.reduce(res[0].result, (obj, item) => { obj[item.value] = { ...item, id: item.value }; return obj }, {}),
                        cementUpBeltByID: _.map(res[0].result, (item) => item.value),
                        cementUpBelt,
                    })
                }
                if (res[1].code === '200') {
                    this.setState({
                        matieralFromBeltData: _.reduce(res[1].result, (obj, item) => { obj[item.ID] = { ...item, id: item.ID }; return obj }, {}),
                        matieralFromBeltByID: _.map(res[1].result, (item) => item.ID),
                        matieralFromBelt,
                    })
                }
                this.setState({ loading: false });
                return {
                    moName: cenmentMill,
                    pdName: cementUpBelt
                }
            })
        }).then(res => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "getCurrentTypeAndMat",
                params: { ...res },
                cb: (res) => {
                    if (res.code === '200') {
                        this.setState({
                            kindType: res.result
                        })
                    }
                }
            });
        })
    }

    render() {
        const { loading, cenmentMillByID, cenmentMillData, cenmentMill, cementUpBelt, matieralFromBelt, cementUpBeltData, cementUpBeltByID, matieralFromBeltData, matieralFromBeltByID, kindType, date, message } = this.state;
        console.log(this.state)
        return (
            <div
                style={containerStyle}
                onTouchMove={this.handleTouchMove}
                ref={ref => this.scrollDiv = ref}
            >
                {this.state.isSaveOkModalVisible && (
                    <div style={saveOkModalOutMostContainer}>
                        <div style={saveOkModalContainer}>
                            <img style={saveOkImgStyle} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAABU5JREFUaAXVms1vFVUYxlvFxG9DRROigsZIYw1RmhA3IigVE/foQhN2ysqdiX+AC13UhQu3XbBEiJJoRAuUhRs1EU00Clo/AtEgjaExUSzk+vvNPQfmTi7tzJmZW+6TPD1nZs553ve9c76noyMNotPpjCO3Az4GN8EH4B3wVij+hufhz/AkPAHnRkdHfyC9NkAQk3AanoapsK4ak3WjGk0VwPhW6r4Fn8ppLJGfCzxD+nuOZEfW53gPeetuhzfAiKNkXuetfRFvtJoSyDh8D0acJ7MP7oa3VzVuHfg8VEOtiP1kbLbtAPE10GaxBMW/0Os7m7KoVtBUW2hLG2uaspHpIDgGj0BxCc7A+xo1khNDe0OwoS0xC8dyRdKzCE3AH6E4C7elq1Wrqa1gkyTzYaKaQqE0Is/ARdXACbixUKT1S23Cr6Gwj00lGaWibyYGc4D8LUlCDVTSNtQHYVDV3hQV7DOxmSmUPLw3EE8moQ/wIBT6Vq5PUdDRLA4ANrNVezPFH0NfYGx+DhQrj34UcpgUDgAD7zPFIIrX+hR8I+lMF5/3XFPASdOx3+FyYKNZjxMlLvQt+KivV598eRhXADMldFe1CL7OQLG/ryM82Jo97q4AWps0+xpPuImvTr5xReG6shc8jAPB8u2yt9qqXuFz7O9HehzhwSQUjvGNrc16jLRwoa/BZ5LOFk1cF+y8GNJDLNsXQv6aT4Kvh4KjL112mOji5mz35ZsDzuCDfaJy36WOWw9xOnOZjEO1+A9W3s80ETd2d8J/YNepCqL6DPVdjNvkdoT67u0XK2g1UhQnnkDoA3gj/LiqaPD5eKi33YA80BBz2d8B/iEYh9sPocur9+FemIJjodIWA4ozrWcAAwPBPIqxw9Bm7pt5gV/7ImkKou8PjSA8D8WuFKWUOth6GLpWFEfhTSk6sQ71dykE5g1oIct2OptjgTZTbD0IzwSbn5HGM7tks2hsDnoLBnQhXKyrqkg9h9o34L1l6obyv5KKL6GHkLWBzjoFwYW6Ab3W1el8S7qsczxfD0+F8t+QltuglQgXrZ6AkpscQnfB2AcPk++74QrlviMV38O7S/hZugh6scmdqz0oIObZg2tA8W7RC+6the58xU/QE9NGgWbPoBBX2XtSrSD4LLwIxatRh7yz+OfeBL/B++OzJlN090Ax6zzkVwCR/MsxfzifxEDeRvg5eDP3nDSdPP+AOyn3C2kbiIPSSZvcK1B8UtcSGu9kSt3jL4dk8Sd8pK72cvXR/1RD4GUDamxxitb18CMY8ReZbJ+ynEN1nqGfX5x2Vz3cbGz7gNZt0H5zDj5ex9kydbHRu32wEjenodhXRmSlMuh4KOjquXXoMxRXjg64GOYt+GIWTrFpczMO31cibf33rWfAtxKC6T0kUZYH+WOsDfVMtV8bf11HXv0YKwTlZ0Ax/AeNISCH8GE4Cn4SPy8FX+MGtX+zoFBsl2fJb+xfavXu6hPUN7Fyf6dQ/nOKny6G+3NKaHpjBOJHJXEADu8Hr9iYCGICxm2BQa3am9I2PAiFPlX7JJkLaioIKGTzG3if0mawTZIFMxX9S0oR8U3F5mdn3JYklFBJWzAOAPqQ9maKthGyT81C4XA5A1ubfNUONrQltN3YGUQWH4KOfg7pzlPCWdrrxj6/qBU04wpAW9roe1ZR/OGTrhF38o0rCrJZu3bF6zK+8mG/dUJdNeJCk2xmY/lJs08EycMxBt1avwmfzukukffg/Bgcjn8vyzmfZQlsEtos4iaRbGVYV43au9vkN1QMzGscKvsvmvMUPwW/gsc5PGnsXzT/B1OxBjEc1WO5AAAAAElFTkSuQmCC" />
                            <div style={saveOkTextStyle}>{message}</div>
                        </div>
                    </div>
                )}
                <Skeleton loading={loading} active>
                    <div style={selectedWrapper}>
                        <div style={selectedItem} ref={(el) => { this.selector1 = el; }}>
                            <label style={selectedItemLabel}>水泥磨列表:</label>
                            <Select
                                style={pickerStyle}
                                value={cenmentMill}
                                onChange={this.cenmentMillChange}
                            >
                                {
                                    cenmentMillByID
                                        .map(id => cenmentMillData[id])
                                        .map(item => <Select.Option value={item.id}>{item.value}</Select.Option>)
                                }
                            </Select>
                        </div>
                        <div style={selectedItem} ref={(el) => { this.selector2 = el; }}>
                            <label style={selectedItemLabel}>皮带秤列表：</label>
                            <Select
                                style={pickerStyle}
                                value={cementUpBelt}
                                onChange={this.cementUpBeltChange}
                            >
                                {
                                    cementUpBeltByID
                                        .map(id => cementUpBeltData[id])
                                        .map(item => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </div>
                    </div>
                    {/* <div style={radioWrapper}>
                        <Radio.Group
                            onChange={this.millChange}
                            value={this.state.cenmentMill}
                            style={radioGrouptyle}
                        >
                            {
                                cenmentMillList.map(item =>
                                    <Radio
                                        style={radioStyle}
                                        value={item.name}
                                    >
                                        <span style={radioOptionStyle}>{item.value}</span>
                                    </Radio>)
                            }

                        </Radio.Group>

                    </div> */}
                    <div style={listPanelWrapper} >
                        <p style={listPanel}><label style={listPanelLabel}>当前品种：</label><span>{kindType.type}</span></p>
                        <p style={listPanel}><label style={listPanelLabel}>当前物料：</label><span>{kindType.mat}</span></p>
                    </div>
                    <div style={selectedWrapper}>

                        <div style={selectedItem} ref={(el) => { this.selector3 = el; }}>
                            <label style={selectedItemLabel}>物料列表：</label>
                            <Select
                                style={pickerStyle}
                                value={matieralFromBelt}
                                onChange={this.matieralFromBeltChange}
                            >
                                {
                                    matieralFromBeltByID
                                        .map(id => matieralFromBeltData[id])
                                        .map(item => <Select.Option value={item.id}>{item.NAME}</Select.Option>)
                                }
                            </Select>
                        </div>
                        <div style={selectedItem}>
                            <label style={selectedItemLabel}> 时间：</label>
                            <DatePicker showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder="选择时间"
                                value={date}
                                onChange={this.dateOnChange}
                                onOk={this.handleDateClick}
                                style={pickerStyle}
                            />
                        </div>
                    </div>
                    <div style={btnContainerStyle}>
                        <Button style={saveBtnStyle} onTouchStart={() => this.handleChangeClick()} disabled={this.state.isSubmiting}> 切换 </Button>
                    </div>
                </Skeleton>
            </div >

        );
    }

    handleTouchMove = (e) => {
        console.dir(this.scrollDiv);
        // 如果弹窗打开的话 外面的不要滚动
        const currentPosition = e.changedTouches[0].clientY;
        // 部分手机没有scrollBy
        // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
        const scrollTop = this.scrollDiv.scrollTop;
        this.scrollDiv.scrollTop = scrollTop + this.startPosition - currentPosition;
        this.startPosition = currentPosition;
        this.hasMove = true;
    }
    cenmentMillChange = mill => {
        this.setState({
            cenmentMill: mill,
        });
        new Promise((resolve, reject) => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "getCementUpBelt",
                params: { object: mill },
                cb: (res) => {
                    if (res.code === '200') {
                        const cementUpBelt = _.get(res, 'result[0].value');
                        this.setState({
                            cementUpBeltData: _.reduce(res.result, (obj, item) => { obj[item.value] = { ...item, id: item.value }; return obj }, {}),
                            cementUpBeltByID: _.map(res.result, (item) => item.value),
                            cementUpBelt,
                        })
                        resolve({
                            moName: mill,
                            pdName: cementUpBelt
                        })
                    }
                }
            });
        }).then(res => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "getCurrentTypeAndMat",
                params: { ...res },
                cb: (res) => {
                    if (res.code === '200') {
                        this.setState({
                            kindType: res.result
                        })
                    }
                }
            });
        })

    };
    cementUpBeltChange = value => {
        this.setState({
            cementUpBelt: value,
        })
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "getCurrentTypeAndMat",
            params: {
                moName: this.state.cenmentMill,
                pdName: value
            },
            cb: (res) => {
                if (res.code === '200') {
                    this.setState({
                        kindType: res.result
                    })
                }
            }
        });
    }
    matieralFromBeltChange = ID => {
        this.setState({
            matieralFromBelt: ID,
        })
    }
    dateOnChange = (value) => {
        this.setState({ date: value });
    }
    handleDateClick = (value) => {
        this.setState({ date: value });
    }
    showDialogue = (message) => {
        this.state.message = message;
        // 这里只是保存成功后, 显示保存成功的弹窗
        this.setState({ isSaveOkModalVisible: true }, () => {
            // 2秒后隐藏弹窗, 时间可以自己改
            setTimeout(() => {
                this.setState({ isSaveOkModalVisible: false })
            }, 2000)
        })
    }
    handleChangeClick = () => {
        const { matieralFromBelt, matieralFromBeltData, kindType } = this.state;
        if (kindType.mat === matieralFromBeltData[matieralFromBelt].NAME) {
            message.warning('该切换原料已经投入');
            return false;
        }
        this.setState({ isSubmiting: true });
        scriptUtil.excuteScriptService({
            objName: "KCCL",
            serviceName: "getTime",
            cb: (res) => {
                const { cenmentMillData, cenmentMill, cementUpBelt, cementUpBeltData, matieralFromBelt, matieralFromBeltData, mainInfo } = this.state;
                scriptUtil.excuteScriptService({
                    objName: "materialRecord",
                    serviceName: "AddDataTableEntry",
                    params: {
                        id: cenmentMill,
                        name: cenmentMillData[cenmentMill].value,
                        recordingTime: moment(this.state.date).format('YYYY-MM-DD HH:mm:ss'),
                        tagCode: `${cenmentMill}.${cementUpBelt}`,
                        tagName: cementUpBeltData[cementUpBelt].name,
                        inputMaterial: matieralFromBelt,
                        inputMaterialName: matieralFromBeltData[matieralFromBelt].NAME,
                        staffName: mainInfo.staffName,
                        staffCode: mainInfo.staffCode,
                        updateTime: moment(Number(res.result.list)).format('YYYY-MM-DD HH:mm:ss')
                    },
                    cb: (res) => {
                        if (res.code === '200') {
                            this.showDialogue("切换成功");
                        }
                        this.setState({ isSubmiting: false })
                    }
                });
            }
        })

    }
}


export default CustomComp;

const backgroundColor = '#f5f6fa';
const borderColor = '#e6e9f0';
const fontColor = {
    primary: '#1f2e4d',
    secondary: '#49565e',
    red: '#f05656'
};
const containerStyle = {
    height: '100%',
    width: '100%',
    padding: '20px 20px 45px 20px',
    overflowY: 'scroll',
};

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    fontSize: '16px'
};
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
    textAlign: 'center',
    lineHeight: '42px',
    height: '42px'
}
const saveBtnStyle = {
    ...commonBtn,
    color: '#fff',
    backgroundColor: '#2d7df6'
}
const radioWrapper = {
    padding: '0 10px 10px 10px'
}
const radioGrouptyle = {
    width: '100%'
}
const listPanelWrapper = {
    borderTop: '1px solid #dbdbdb',
    borderBottom: '1px solid #dbdbdb',
    padding: '10px'
}
const listPanel = {
    lineHeight: '32px',
    margin: '0',
    fontSize: '16px'
}
const listPanelLabel = {
    // fontWeight: 'bold',
    width: '100px',
    display: 'inline-block'
}
const selectedWrapper = {
    borderBottom: '1px solid #dbdbdb',
    padding: '0 10px'
}
const selectedItem = {
    lineHeight: '50px',
    fontSize: '16px'
}
const selectedItemLabel = {
    // fontWeight: 'bold',
    width: '100px',
    display: 'inline-block'
}
const pickerStyle = {
    width: '60%'
}
const radioOptionStyle = {
    float: 'left'
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