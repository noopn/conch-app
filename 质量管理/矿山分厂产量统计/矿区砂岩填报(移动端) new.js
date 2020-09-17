import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Form, message, Row, Col, Spin, TimePicker } from 'antd';
import moment from 'moment';

const m2m = (time) => {
    const h = moment.duration(time, "minutes").asHours();
    const m = moment.duration(time, "minutes").minutes();
    return moment(`${h}:${m}`, 'HH:mm')
}

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    state = {
        editing: false,
    };
    toggleEdit = (record, id, dataIndex, e) => {
        e && e.stopPropagation();
        if (record.block) return false;
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                // ht的mousedown事件会触发react的onblur事件 需要阻止事件冒泡
                if (id) {
                    document.querySelector(`#${id}`).addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                    }, false)
                }
                if (dataIndex === 'CL') {
                    this.input.focus();
                }
                if (dataIndex === 'type') {
                    this.select.focus();
                }
            }
        });
    };

    save = (id) => {
        const { record, handleSave, dataIndex } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit(record, null, dataIndex);
            handleSave({ ...record, [id.split('-')[0]]: values[id] });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title, typeData } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(`${dataIndex}-${record.id}`, {
                    rules: [
                        {
                            pattern: /^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/,
                            message: '数字不合法',
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input
                    ref={node => (this.input = node)}
                    onPressEnter={() => this.save(`${dataIndex}-${record.id}`)}
                    onBlur={() => this.save(`${dataIndex}-${record.id}`)}
                    style={{ textAlign: "center" }} />
                )}
            </Form.Item>
        ) : (
                <div
                    onClick={(e) => this.toggleEdit(record, `${dataIndex}-${record.id}`, dataIndex, e)}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}
const dateFormat = 'YYYY-MM-DD';
class CustomComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            proDate: moment().format(dateFormat),
            team: "夜班", // 班组
            buttonType: null,
            typeData: [],
            crusher: [],
            currentCrusher: '',
            message: '',
            runTime: moment('00：00', 'HH:mm'),
            submiting: false,
            remark: '',
            submitType: 'insert',
            selectType: 'team'
        };
        this.element = React.createRef()
    }

    //   get teamOption() {
    //     const arr = [];
    //     if (moment(`${this.state.proDate} 08:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf() <= moment().valueOf()) {
    //       arr.push({ key: '夜班', value: '夜班' })
    //     }
    //     if (moment(`${this.state.proDate} 16:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf() <= moment().valueOf()) {
    //       arr.push({ key: '白班', value: '白班' })
    //     }
    //     if (moment(this.state.proDate, 'YYYY-MM-DD').endOf('day').valueOf() <= moment().valueOf()) {
    //       arr.push({ key: '中班', value: '中班' })
    //     }
    //     if (!arr.length) {
    //       arr.push({ key: 'null', value: '暂无班组查询' })
    //     }
    //     return arr;
    //   }
    get teamOption() {
        const arr = [];
        arr.push({ optionText: '夜班', optionValue: '夜班' })
        arr.push({ optionText: '白班', optionValue: '白班' })
        arr.push({ optionText: '中班', optionValue: '中班' })
        return arr;
    }
    columns = [
        {
            title: '堆场',
            width: '33.3%',
            key: 'MineStockName',
            align: 'center',
            dataIndex: 'MineStockName',
            render: (text, row,) => {
                const obj = {
                    children: text,
                    props: {},
                }
                const { data } = this.state;
                const lime = data.filter(item => item.MineStockName === row.MineStockName);
                if (row.id === lime[0].id) {
                    obj.props.rowSpan = lime.length
                } else {
                    obj.props.rowSpan = 0
                }
                return obj
            },
        },
        {
            title: '产品',
            width: '33.3%',
            key: 'produce',
            align: 'center',
            dataIndex: 'produce',
        },
        {
            title: '产量',
            width: '33.4%',
            key: 'CL',
            align: 'center',
            dataIndex: 'CL',
            onCell: record => ({
                record,
                editable: true,
                dataIndex: 'CL',
                title: '产量',
                handleSave: this.handleSave,
            })
        }
    ];
    handleSave = row => {
        let newData = [...this.state.data];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: this.rowMount(newData.slice(0, -1)) });
    };
    componentDidMount() {
        this.getmsCrusher()
            .then(() => {
                this.fetchData();
            })
        this.cancelRuntimeFullPage();
        this.getUsersSessionInfo();
        this.cancelConflictionEvent();
    }
    getmsCrusher = () => {
        return new Promise((resolve) => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "getmsCrusher",
                params: {},
                cb: (res) => {
                    this.setState({
                        crusher: res.result.list,
                        currentCrusher: res.result.list[0].optionValue
                    })
                    resolve()
                }
            });
        })
    }
    cancelConflictionEvent = () => {
        if (this.element && this.element.current) {
            ["touchstart", "touchmove", "touchend"].forEach((event) => {
                this.element.current.addEventListener(event, (e) => {
                    e.stopPropagation();
                });
            })
        }
    }
    cancelRuntimeFullPage = () => {
        document.getElementById('runtimePage') && (document.getElementById('runtimePage').children[0].style.display = 'none')
    }
    onSerchKeyChange = (key, value) => {
        this.setState({
            [key]: value,
            showSlider: false
        }, () => {
            this.fetchData();
        })
    }

    getUsersSessionInfo = () => {
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
                    this.setState({ ...temp });
                }
            });
        });
    }

    rowMount = (data) => {
        if (!data.length) return [];
        const mount = data.reduce((mount, item) => { mount += Number(item.CL); return mount }, 0)
        return data.concat({ MineStockName: '合计', block: true, CL: mount })
    }
    getRunTime = () => {
        let { proDate, team, currentCrusher } = this.state;

        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetCrusherRunningTime",
            params: {
                day: proDate,
                crush: currentCrusher,
                shift: team
            },
            cb: (res) => {
                const time = res && res.result > 0 ? res.result : 0;
                this.setState({
                    runTime: m2m(time)
                })
            }
        })
    }
    runTimeChange = (runTime, timeStr) => {
        this.setState({
            runTime
        })
    }
    showSelectSlide = (type) => {
        this.setState({
            showSlider: true,
            selectType: type
        })
    }
    hiddenSelectSlide = (e) => {
        e.stopPropagation();
        this.setState({
            showSlider: false
        })
    }
    fetchData = () => {
        let { proDate, team, currentCrusher } = this.state;
        // proDate = proDate.split('-').map(item => Number(item)).join('-');
        if (team === 'null' || proDate === '') {
            message.warn('请检查查询参数,或切换查询日期');
            return false;
        }
        this.setState({
            visable: true,
            message: '加载中。。。',
        })
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetDiggReport",
            params: {
                day: proDate,
                crush: currentCrusher,
                shift: team,
            },
            cb: (res) => {
                if (res.result.list.length === 0) {
                    this.getRunTime();
                    scriptUtil.excuteScriptService({
                        objName: "SCGL",
                        serviceName: "GetDiggData",
                        params: {
                            day: proDate,
                            crush: currentCrusher,
                            shift: team,
                            type: "砂岩"
                        },
                        cb: (res) => {
                            this.setState({
                                data: this.rowMount(res.result.list),
                                remark: '',
                                message: '',
                                visable: false,
                                submitType: 'insert',
                            })
                        }
                    });
                } else {
                    if (!res || !res.result || !res.result.list[0]) return false;
                    const item = res.result.list[0];
                    this.setState({
                        data: this.rowMount(res.result.list),
                        remark: res.result.list[0].remark,
                        runTime: m2m(item.duration),
                        submitType: 'update',
                        visable: false,
                        message: '',
                    })
                }
            }
        });
    }
    handleSaveSubmit = () => {
        let { data, runTime, proDate, currentCrusher, team } = this.state;
        return new Promise((resolve, reject) => {
            scriptUtil.excuteScriptService({
                objName: 'crusherreport',
                serviceName: 'AddDataTableEntries',
                params: {
                    params: JSON.stringify({
                        list: data.slice(0, -1).map(item => ({
                            produce: item.produce,
                            yard: item.MineStockName,
                            CL: Number(item.CL),
                            stack: item.name,
                            lime: item.objName,
                            type: item.type,
                            prodate: this.state.proDate,
                            team: this.state.team,
                            creator: this.state.staffName,
                            crusherid: this.state.currentCrusher,
                            duration: Number(runTime.hours() * 60) + Number(runTime.minutes()),
                            creattime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            remark: this.state.remark
                        }))
                    })
                },
                cb: (res) => {
                    if (!res.result || res.result !== (data.length - 1)) {
                        message.error('保存失败');
                        this.setState({
                            submitType: 'insert',
                            visable: false,
                            message: ''
                        })
                    } else {
                        message.success('保存成功');
                        // 保存成功重新拉取新表中的数据,因为id发生变化，再次操作在新表中操作
                        scriptUtil.excuteScriptService({
                            objName: "SCGL",
                            serviceName: "GetDiggReport",
                            params: {
                                day: proDate,
                                crush: currentCrusher,
                                shift: team,
                            },
                            cb: (res) => {
                                if (!res || !res.result || !res.result.list[0]) return false;
                                const item = res.result.list[0];
                                this.setState({
                                    data: this.rowMount(res.result.list),
                                    remark: item.remark,
                                    runTime: m2m(item.duration),
                                    submitType: 'update',
                                    visable: false,
                                    message: ''
                                })
                            }
                        });
                    }
                    resolve(res.result)
                }
            });
        })
    }
    handleEditSubmit = () => {
        const { data, runTime } = this.state;
        this.setState({
            submiting: true
        })
        const promiseData = data.slice(0, -1).map(item => new Promise((resolve) => {
            const jsonData = {
                update: {
                    CL: Number(item.CL),
                },
                where: {
                    id: item.id
                }
            };
            scriptUtil.excuteScriptService({
                objName: "crusherreport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: (res) => {
                    if (res && res.result == 1) {
                        resolve(true)
                    } else {
                        reject(false);
                    }
                }
            });
        })).concat(new Promise(resolve => {
            scriptUtil.excuteScriptService({
                objName: "crusherreport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        update: {
                            remark: this.state.remark,
                            duration: Number(runTime.hours() * 60) + Number(runTime.minutes()),
                        },
                        where: {
                            crusherid: this.state.currentCrusher,
                            prodate: this.state.proDate,
                            team: this.state.team,
                        }
                    })
                },
                cb: (res) => {
                    if (res && (res.result == (data.length - 1))) {
                        resolve(true)
                    } else {
                        reject(false);
                    }
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('修改成功')
        }).catch(err => {
            message.error('修改失败')
        }).then(() => {
            this.setState({
                visable: false,
                message: '',
            })
        })
    }
    remarkChange = (e) => {
        this.setState({
            remark: e.target.value
        })
    }
    disabledDate = (current) => current && current > moment().endOf('day');
    submit = () => {
        const { proDate, team, currentCrusher } = this.state;
        this.setState({
            visable: true,
        })
        new Promise((resolve, reject) => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "GetDiggReport",
                params: {
                    day: proDate,
                    crush: currentCrusher,
                    shift: team,
                },
                cb: (res) => {
                    if (!res.result) {
                        reject(false)
                    } else {
                        resolve(res.result);
                    }
                }
            });
        }).then(res => {
            if (res.list && res.list.length === 0) {
                this.setState({
                    message: '保存中。。。',
                })
                return this.handleSaveSubmit()
            } else {
                this.setState({
                    message: '修改中。。。',
                })
                return this.handleEditSubmit()
            }
        }).then(() => {
            // 更新保存状态
            const jsonData = {
                'update': {
                    Confirm_flag: 1
                },
                'where': {
                    prodate: this.state.proDate,
                    team: this.state.team,
                    Content: this.state.currentCrusher,
                    type: '破碎机'
                }
            };
            scriptUtil.excuteScriptService({
                objName: "ConfirmationInfo",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: () => { }
            });
        })
    }
    render() {
        const { proDate, team, data, crusher, currentCrusher, runTime, remark, visable, message, submitType, showSlider, selectType } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const optionsMap = {
            team: this.teamOption,
            currentCrusher: crusher
        }
        const stateKeyMap = {
            team,
            currentCrusher,
        }
        return (
            <Spin tip={message} spinning={visable}>
                <div className='supos-comp-wrapper' ref={this.element}>
                    <div className='serchHeader'>
                        <Row className='header-table-row'>
                            <Col span={12} className='header-table-col'>
                                <div className='header-table-col-th'>日期</div>
                                <div className='header-table-col-td'>
                                    <DatePicker
                                        onChange={(D, dateString) => this.onSerchKeyChange('proDate', dateString)}
                                        defaultValue={moment(proDate)}
                                        suffixIcon={() => null}
                                    >
                                    </DatePicker>
                                </div>

                            </Col>
                            <Col span={12} className='header-table-col'>
                                <div className='header-table-col-th'>班组</div>
                                <div
                                    className='header-table-col-td'
                                    onClick={() => this.showSelectSlide('team')}
                                >
                                    <span>{team}</span>
                                    <i className='select-icon'></i>
                                </div>
                            </Col>
                            <Col span={12} className='header-table-col'>
                                <div className='header-table-col-th'>破碎机</div>
                                <div
                                    className='header-table-col-td'
                                    onClick={() => this.showSelectSlide('currentCrusher')}
                                >
                                    <span>{!!crusher.length && crusher.find(item => item.optionValue === currentCrusher).optionText}</span>
                                    <i className='select-icon'></i>
                                </div>
                            </Col>
                            <Col span={12} className='header-table-col'>
                                <div className='header-table-col-th'>运行时长</div>
                                <div
                                    className='header-table-col-td'
                                >
                                    <TimePicker value={runTime} format={'HH:mm'} onChange={this.runTimeChange} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Table
                        style={{ wordBreak: 'break-all' }}
                        components={components}
                        columns={this.columns}
                        dataSource={data}
                        pagination={false}
                        bordered
                    />
                    <div className='remarkWrapper'>
                        <label className='remark-lable'>备注</label>
                        <input className='remarkInput' value={remark} onInput={this.remarkChange} />
                    </div>
                    <Button
                        className='submitButton'
                        type='submit'
                        onMouseDown={(e) => {
                            this.submit()
                        }}
                    >{submitType === 'insert' ? '保存' : '修改'}</Button>
                </div >
                <div
                    className='fixed-wrapper'
                    style={{ visibility: showSlider ? "visible" : 'hidden' }}
                >
                    <div
                        className='mask'
                        onTouchEnd={this.hiddenSelectSlide}
                    ></div>
                    <div
                        className={`slider ${showSlider ? 'slider-active' : ''}`}
                    >
                        {optionsMap[selectType].map(item => (
                            <div
                                className={`slider-item ${item.optionValue === stateKeyMap[selectType] ? "slider-item-active" : ''}`}
                                onTouchEnd={() => this.onSerchKeyChange(selectType, item.optionValue)}
                            >
                                {item.optionText}
                                {item.optionValue === stateKeyMap[selectType] && <i className='item-check-icon'></i>}
                            </div>
                        ))}
                    </div>
                </div>
            </Spin>
        );
    }
}

export default CustomComp;
var css = document.createElement('style');
css.id = 'CustomCompStyle';
css.innerHTML = `
.supos-comp-wrapper .ant-table .ant-table-tbody > tr > td { 
    white-space: nowrap;
    border-bottom: 1px solid #e8e8e8;
    padding: 4px;
}
.supos-comp-wrapper .ant-table-body {
  overflow: hidden;
}

.supos-comp-wrapper .ant-table-bordered .ant-table-body > table {
  border-left: none;
  border-right: none;
}
.supos-comp-wrapper .ant-table-thead {
  border-bottom: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
  background: #F1F4FA;
}
.supos-comp-wrapper .ant-table thead.ant-table-thead > tr > th {
    background: transparent !important;
    font-weight: bold !important;
    padding: 11px 0 11px 0;
    font-size: 14px;
    color: #1F2E4D;
}
.supos-comp-wrapper .ant-table thead.ant-table-thead > tr > th:last-child {
  border: none
}
.supos-comp-wrapper .ant-table-thead > tr > th {
    text-align: center;
}
.supos-comp-wrapper .edit-th-p {
    text-align: center;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    padding: 0px;
    margin: 0px;
    color: #333;
}
.supos-comp-wrapper .ant-calendar-picker {
    
}
.supos-comp-wrapper .ant-calendar-picker input {
  border:none;
  text-align:center;
  font-size: 14px;
}
.supos-comp-wrapper .ant-select-selection {
  border:none
}
#appPreviewWrapper .ant-spin-container {
    overflow: visible !important;
}
.supos-comp-wrapper{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    font-family: PingFangSC-Regular;
}
.supos-comp-wrapper .remarkWrapper {
    display: flex;
    align-items: center;
    line-height: 44px;
    border-bottom: 1px solid #e8e8e8;
}
.supos-comp-wrapper .remarkWrapper .remark-lable {
    width: 33.3%;
    display: inline-block;
    text-align: center;
}
.supos-comp-wrapper .remarkInput {
    flex: 1;
    width: 66%;
    height: 36px;
    padding-left: 20px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
}
.supos-comp-wrapper  .ant-time-picker {
    width: 100%;
}
.supos-comp-wrapper .ant-time-picker-input {
    width: 100%;
    border: none;
    text-align: center;
    color: #1F2E4D;
}
.ant-time-picker-icon {
    right: 20px !important;
}
.supos-comp-wrapper .header-table-row {
    margin-right: -2px;
}
.supos-comp-wrapper .ant-row .ant-input:focus,
.supos-comp-wrapper .ant-form-item .ant-input:focus {
    box-shadow: none !important;
    border-color: #D3DBEB !important;
}
.supos-comp-wrapper .header-table-col-th {
    position:relative;
    background: #F1F4FA;
    border-top: 1px solid #E6E9F0;
    border-right: 1px solid #E6E9F0;
    font-size: 14px;
    color: #1F2E4D;
    text-align: center;
    height:40px;
    line-height:40px;
    font-weight: 600;
}
.supos-comp-wrapper .header-table-col-td {
    position:relative;
    border-top: 1px solid #E6E9F0;
    border-right: 1px solid #E6E9F0;
    font-size: 14px;
    color: #1F2E4D;
    text-align: center;
    height:40px;
    line-height:40px;
}
.supos-comp-wrapper .select-icon{
    border-width: 6px 6px 0 6px;
    border-color: #8F9BB3 transparent transparent transparent;
    display: inline-block;
    border-style: solid;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 20px;
    height: 0px;
}
.fixed-wrapper .mask{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.40);
    z-index:99;
    cursor: pointer
}
.fixed-wrapper .slider {
    position: fixed;
    z-index: 100;
    min-height: 300px;
    background: #fff;
    border-radius: 10px 10px 0 0;
    padding: 0 16px;
    width: 100%;
    bottom: 0;
    left: 0;
    transition: transform 0.3s ease-out;
    transform: translateY(100%);
}
.fixed-wrapper .slider.slider-active {
    transform: translateY(0);
}
.fixed-wrapper .slider-item {
    height: 46px;
    line-height: 46px;
    margin: 16px 0;
    background: #FBFBFB;
    border-radius: 10px;
    font-size: 16px;
    color: #3F3F3F;
    padding: 0 30px;
}
.fixed-wrapper .slider-item-active {
    background: rgba(0,147,255,0.10);
    border: 1px solid #0093FF;
    position:relative;
}
.fixed-wrapper .slider-item-active .item-check-icon {
    display:inline-block;
    width: 8px;
    height: 16px;
    border-color: #0495ff;
    border-style: solid;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    transform-origin: top;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 30px;
}
.supos-comp-wrapper  .submitButton {
    position: fixed;
    width: 100%;
    height: 50px;
    left: 0;
    bottom: 0;
    font-size: 18px;
    background: #2D7DF6;
    color: #fff;
    line-height: 50px;
    text-align: center;
}
.supos-comp-wrapper button.ant-btn:hover,
.supos-comp-wrapper button.ant-btn:focus {
    color: #fff;
}
`;

document.getElementsByTagName('head')[0].appendChild(css);