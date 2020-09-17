import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Row, Col, Form, message, Spin } from 'antd';
import moment from 'moment';

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

    toggleEdit = (record, id) => {
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
                this.input.focus();
            }
        });
    };

    save = (id) => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit(record);
            handleSave({ ...record, [id.split('-')[0]]: values[id] });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
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
                })(<Input ref={node => (this.input = node)} onPressEnter={() => this.save(`${dataIndex}-${record.id}`)} onBlur={() => this.save(`${dataIndex}-${record.id}`)} style={{ textAlign: "center" }} />)}
            </Form.Item>
        ) : (
                <div
                    onClick={() => this.toggleEdit(record, `${dataIndex}-${record.id}`)}
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
    element = React.createRef();
    state = {
        data: [],
        proDate: moment().format(dateFormat),
        digg: '',
        userInfo: {},
        diggs: [],
        visable: false,
        message: '',
        showSlider: false
    }
    keyMap = {
        "Diggings": "矿区",
        "Platform": "平台",
        "BPL": "日常爆破量",
        "ZCL": "转场量",
        "XLL": "下料量",
    }
    filterMap = {
        // "Platform": "平台",
        "BPL": "日常爆破量",
        "ZCL": "转场量",
        "XLL": "下料量",
    }
    columns = [
        {
            key: 'Diggings',
        },
        {
            key: 'Platform',
        },
        {
            key: 'BPL',
        },
        {
            key: 'XLL',
        },
        {
            key: 'ZCL',
        },
    ];
    handleColumns = (columns) => {
        return columns.map(el => {
            let item = el;
            if (item.children) {
                item.children = this.handleColumns(item.children);
            }
            if (!item.children) {
                item = {
                    ...item,
                    width: `${100 / 5}%`,
                    title: this.keyMap[item.key],
                    dataIndex: item.key,
                    editable: !!this.filterMap[item.key] && item.block !== true,
                    render: (text, row, index) => {
                        const obj = {
                            children: <p className='edit-th-p'>{text}</p>,
                            props: {},
                        }
                        if (item.key === 'Diggings') {
                            const { data } = this.state;
                            const indexByDiggings = data.filter(item => item.Diggings === text);
                            if (row.id === indexByDiggings[0].id) {
                                obj.props.rowSpan = indexByDiggings.length
                            } else {
                                obj.props.rowSpan = 0
                            }
                        }
                        return obj
                    },
                    onCell: record => ({
                        record,
                        editable: item.editable,
                        dataIndex: item.dataIndex,
                        title: item.title,
                        handleSave: this.handleSave,
                    })
                }
            }
            return item;
        })
    }
    handleSave = row => {
        let newData = [...this.state.data];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: newData });
    };


    componentDidMount() {
        this.fetchDigg()
            .then(() => {
                this.fetchData();
            });
        this.cancelRuntimeFullPage();
        this.getUsersSessionInfo();
        this.cancelConflictionEvent();
    }
    cancelRuntimeFullPage = () => {
        document.getElementById('runtimePage') && (document.getElementById('runtimePage').children[0].style.display = 'none')
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

    onSerchKeyChange = (key, value) => {
        this.setState({
            [key]: value,
            showSlider: false
        }, () => {
            this.fetchData();
        })
    }
    fetchDigg = () => {
        return new Promise(resolve => {
            scriptUtil.excuteScriptService({
                objName: "SCGL",
                serviceName: "Getdiggings",
                params: {},
                cb: (res) => {
                    this.setState({
                        diggs: res.result.list,
                        digg: res.result.list[0].optionText
                    }, () => {
                        resolve(res);
                    })
                }
            });
        })
    }
    fetchData = () => {
        let { proDate, digg } = this.state;
        this.setState({
            visable: true,
            message: '加载中。。。',
        })
        scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetPlatformByDate",
            params: {
                day: proDate, digg
            },
            cb: (res) => {
                this.staticProDate = res.result.length ? res.result[0].ProDate : '';
                this.setState({
                    data: res.result,
                    visable: false,
                    message: ''
                })
            }
        });
    }
    showSelectSlide = () => {
        this.setState({
            showSlider: true
        })
    }
    hiddenSelectSlide = (e) => {
        e.stopPropagation();
        this.setState({
            showSlider: false
        })
    }
    handleEditSubmit = () => {
        const { data, digg } = this.state;
        if (!data.length) return false;
        this.setState({
            visable: true,
            message: '提交中'
        })
        if (digg !== '官山') {
            scriptUtil.excuteScriptService({
                objName: "PlatformExploitationReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        'update': {
                            XLL: Math.round((data.reduce((val, item) => { val += Number(item.XLL); return val }, 0) * 0.06)) + '',
                            Createtime: moment().format("YYYY-MM-DD HH:mm:ss"),
                            Creator: this.state.staffName,
                        },
                        'where': {
                            Diggings: digg,
                            ProDate: this.staticProDate,
                            Platform: '夹石',
                        }
                    })
                },
                cb() { }
            });
            scriptUtil.excuteScriptService({
                objName: "PlatformExploitationReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify({
                        'update': {
                            XLL: Math.round((data.reduce((val, item) => { val += Number(item.XLL); return val }, 0) * 0.07)) + '',
                            CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                            Creator: this.state.staffName,
                        },
                        'where': {
                            Diggings: digg,
                            ProDate: this.staticProDate,
                            Platform: '剥离物',
                        }
                    })
                },
                cb() { }
            });
        }
        const promiseData = data.map(item => new Promise((resolve, reject) => {
            const jsonData = {
                'update': {
                    Platform: item.Platform,
                    BPL: item.BPL,
                    ZCL: item.ZCL,
                    XLL: item.XLL,
                    CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    Creator: this.state.staffName,
                },
                'where': {
                    id: item.id,
                }
            };
            scriptUtil.excuteScriptService({
                objName: "PlatformExploitationReport",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: (res) => {
                    if (res.result == 1) {
                        resolve(true)
                    } else {
                        reject(false)
                    }
                }
            });
        }))
        Promise.all(promiseData).then(res => {
            message.success('保存成功');
            this.setState({
                visable: false,
                message: ''
            })
            const jsonData = {
                'update': {
                    Confirm_flag: 1
                },
                'where': {
                    prodate: this.state.proDate,
                    team: '天',
                    Content: this.state.digg,
                    type: '平台开采'
                }
            };
            // 更新保存状态
            scriptUtil.excuteScriptService({
                objName: "ConfirmationInfo",
                serviceName: "UpdateDataTableEntry",
                params: {
                    updateData: JSON.stringify(jsonData)
                },
                cb: () => { }
            });
        }).catch((err) => {
            console.log(err)
            this.setState({
                visable: false,
                message: ''
            })
            message.error('保存失败');
        })
    }
    render() {
        const { proDate, digg, data, diggs, visable, message, showSlider } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        this.columns = this.handleColumns(this.columns);
        return (
            <Spin tip={message} spinning={visable}>
                <div ref={this.element} className='supos-comp-wrapper'>
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
                                <div className='header-table-col-th'>矿区</div>
                                <div
                                    className='header-table-col-td'
                                    onClick={this.showSelectSlide}
                                >
                                    <span>{digg}</span>
                                    <i className='select-icon'></i>
                                </div>
                            </Col>
                            {/* <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
                                <div ref={this.select}>
                                    <Select
                                        style={selectStyle}
                                        value={digg}
                                        onChange={(value, e) => this.onSerchKeyChange('digg', value)}
                                    >
                                        {
                                            diggs.map(item => (
                                                <Select.Option value={item.optionText}>{item.optionText}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </Col> */}
                        </Row>
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        <Table
                            style={{ wordBreak: 'break-all' }}
                            components={components}
                            columns={this.columns}
                            dataSource={data}
                            pagination={false}
                            bordered
                        />
                    </div>
                    <Button
                        className="submitButton"
                        onClick={(e) => {
                            this.handleEditSubmit()
                        }}
                    >保存</Button>
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
                        {diggs.map(item => (
                            <div
                                className={`slider-item ${item.optionValue === digg ? "slider-item-active" : ''}`}
                                onTouchEnd={() => this.onSerchKeyChange('digg', item.optionValue)}
                            >
                                {item.optionText}
                                {item.optionValue === digg && <i className='item-check-icon'></i>}
                            </div>
                        ))}
                    </div>
                </div>
            </Spin >
        );
    }
}

export default CustomComp;
var css = document.createElement('style');
css.type = 'text/css';
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
`;

document.getElementsByTagName('head')[0].appendChild(css);