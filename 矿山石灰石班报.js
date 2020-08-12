import React, { Component } from 'react';
import { Button, DatePicker, Select, Table, Input, Popconfirm, Form, message, Row, Col } from 'antd';
import moment from 'moment';
var css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `
    .ant-table .ant-table-tbody > tr > td { 
        white-space: nowrap;
        border-bottom: 1px solid #e8e8e8;
        padding: 4px;
    }
    .ant-table-body {
      overflow: hidden;
    }

    .ant-table-bordered .ant-table-body > table {
      border-left: none;
      border-right: none;
    }
    .ant-table-thead {
      border-bottom: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
    }
    .ant-table thead.ant-table-thead > tr > th {
      background: transparent !important;
      color: #444 !important;
      font-weight: bold !important;
    }
    .ant-table thead.ant-table-thead > tr > th:last-child {
      border: none
    }
    .ant-table-thead > tr > th {
        text-align: center;
    }
    .ant-calendar-picker input {
      border:none;
      text-align:center
    }
    .ant-select-selection {
      border:none
    }
    `;
document.getElementsByTagName('head')[0].appendChild(css);
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
    console.log(record, id, dataIndex, e)
    e && e.stopPropagation();
    if (record.block) return false;
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        // ht的mousedown事件会触发react的onblur事件 需要阻止事件冒泡
        if (id) {
          console.log(id);
          document.querySelector(`#${id}`).addEventListener('mousedown', (e) => {
            e.stopPropagation();
          }, false)
        }
        if (dataIndex === 'value') {
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
      team: "", // 班组
      buttonType: null,
      typeData: [],
      crusher: [],
      currentCrusher: '',
      submiting: false
    };
    this.element = React.createRef()
  }

  get teamOption() {
    const arr = [];
    if (moment(`${this.state.proDate} 08:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf() <= moment().valueOf()) {
      arr.push({ key: '夜班', value: '夜班' })
    }
    if (moment(`${this.state.proDate} 16:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf() <= moment().valueOf()) {
      arr.push({ key: '白班', value: '白班' })
    }
    if (moment(this.state.proDate, 'YYYY-MM-DD').endOf('day').valueOf() <= moment().valueOf()) {
      arr.push({ key: '中班', value: '中班' })
    }
    if (!arr.length) {
      arr.push({ key: 'null', value: '暂无班组查询' })
    }
    return arr;
  }
  columns = [
    {
      title: '堆场',
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
        console.log(lime, row)

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
      key: 'produce',
      align: 'center',
      dataIndex: 'produce',
    },
    {
      title: '产量',
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
  componentWillMount() {
    this.setState({
      team: this.teamOption[0].key
    })
  }
  componentDidMount() {
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
    scriptUtil.excuteScriptService({
      objName: "SCGL",
      serviceName: "getlsCrusher",
      params: {},
      cb: (res) => {
        this.setState({
          crusher: res.result.list,
        })
      }
    });
    if (this.element && this.element.current) {
      ["touchstart", "touchmove", "touchend"].forEach((event) => {
        this.element.current.addEventListener(event, (e) => {
          e.stopPropagation();
        });
      })
    }

  }
  onSerchKeyChange = (key, value) => {
    this.setState({
      [key]: value
    }, () => {
      if (key === 'proDate') {
        this.setState({
          team: this.teamOption[0].key
        })
      }
      if (key === 'currentCrusher') {
        this.fetchData();
        this.getRunTime();
      }
    })
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
        shift: team,
        type: '石灰石'
      },
      cb: (res) => {
        console.log(res);
      }
    })
  }

  fetchData = () => {
    let { proDate, team, currentCrusher } = this.state;
    // proDate = proDate.split('-').map(item => Number(item)).join('-');
    if (team === 'null' || proDate === '') {
      message.warn('请检查查询参数,或切换查询日期');
      return false;
    }
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
          scriptUtil.excuteScriptService({
            objName: "SCGL",
            serviceName: "GetDiggData",
            params: {
              day: proDate,
              crush: currentCrusher,
              shift: team,
              type: "石灰石"
            },
            cb: (res) => {
              this.submitType = 'insert'
              this.setState({
                data: this.rowMount(res.result.list)
              })
            }
          });
        } else {
          this.submitType = 'update'
          this.setState({
            data: this.rowMount(res.result.list.map((item, index) => ({ ...item, id: index + 1 })))
          })
        }
      }
    });
  }
  handleSaveSubmit = () => {
    let { data } = this.state;
    data = data.map(item => ({ ...item, createDate: moment().format('YYYY-MM-DD HH:mm:ss') }));
    if (data.some(item => !item.type)) {
      message.warn('请填入类型');
      return false;
    }
    this.setState({
      submiting: true
    })
    scriptUtil.excuteScriptService({
      objName: 'crusherreport',
      serviceName: 'AddDataTableEntries',
      params: {
        params: JSON.stringify({
          list: data.map(item => ({
            produce: item.produce,
            yard: item.MineStockName,
            CL: item.CL,
            stack: item.name,
            lime: item.objName,
            type: item.type,
            proDate: this.state.proDate,
            team: this.state.team,
            creator: this.state.staffCode,
            crusherid: this.state.currentCrusher,
            duration: 20,
            createTime: moment().format('YYYY-MM-DD HH:mm:ss')
          }))
        })
      },
      cb: (res) => {
        message.success('保存成功');
        this.setState({
          submiting: false
        })
        return res.result;
      }
    });

  }
  handleEditSubmit = () => {
    const { data } = this.state;
    this.setState({
      submiting: true
    })
    const promiseData = data.map(item => new Promise((resolve) => {
      const jsonData = {
        update: {
          output: item.value,
        },
        where: {
          name: item.limeName,
          stack: item.name,
          lime: item.objName,
          type: item.type,
          proDate: this.state.proDate,
        }
      };
      scriptUtil.excuteScriptService({
        objName: "MineProduceResult",
        serviceName: "crusherreport",
        params: {
          updateData: JSON.stringify(jsonData)
        },
        cb: (res) => {
          resolve(res.result)
          return res.result;
        }
      });
    }))
    Promise.all(promiseData).then(res => {
      this.setState({
        submiting: false
      })
      message.success('修改成功')
    })
  }
  disabledDate = (current) => current && current > moment().endOf('day');
  render() {
    const { proDate, team, buttonType, data, currentCrusher } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    return (
      <div style={containerWrapper} ref={this.element}>
        <div style={serchHeader}>
          <Row>
            <Col span={5} style={borderTopRight}>
              <label style={headerLabel}>日期：</label>
            </Col>
            <Col span={7} style={borderTopRight}>
              <DatePicker
                disabledDate={this.disabledDate}
                style={datePickerStyle}
                onChange={(D, dateString) => this.onSerchKeyChange('proDate', dateString)}
                defaultValue={moment(proDate)}
                suffixIcon={() => null}
              >
              </DatePicker>
            </Col>
            <Col span={5} style={borderTopRight}>
              <label style={headerLabel}>班组：</label>
            </Col>
            <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
              <Select
                style={selectStyle}
                value={team}
                onChange={(value) => this.onSerchKeyChange('team', value)}
              >
                {this.teamOption.map(item => <Select.Option value={item.key}>{item.value}</Select.Option>)}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={5} style={borderTopRight}>
              <label style={headerLabel}>破碎机：</label>
            </Col>
            <Col span={7} style={borderTopRight}>
              <Select
                style={selectStyle}
                value={currentCrusher}
                onChange={(value) => this.onSerchKeyChange('currentCrusher', value)}
              >
                {this.state.crusher.map(item => <Select.Option value={item.optionValue}>{item.optionText}</Select.Option>)}
              </Select>
            </Col>
            <Col span={5} style={borderTopRight}>
              <label style={headerLabel}>运行时长：</label>
            </Col>
            <Col span={7} style={Object.assign({}, borderTopRight, rightBorderNone)}>
              <div>----</div>
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
        <div style={remarkWrapper}>
          <label>备注</label>
          <input style={remarkInput} onChange={}/>
        </div>
        <div
          style={submitButton}
          onClick={() => {
            if (this.state.submiting) return false;
            this.submitType === 'insert' ? this.handleSaveSubmit() : this.handleEditSubmit()
          }}
        >保存</div>
      </div >
    );
  }
}

export default CustomComp;

const containerWrapper = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  margin: 'auto'
}
const remarkWrapper = {
  lineHeight: '44px',
  paddingLeft: '20px',
  borderBottom: '1px solid #e8e8e8'
}
const remarkInput ={
  border: 'none',
  marginLeft: '20px',
  /* display: table-cell; */
  width: '300px',
  height: '36px'
}
const headerLabel = {
  whiteSpace: 'nowrap'
}
const borderTopRight = {
  borderTop: '1px solid #e8e8e8',
  borderRight: '1px solid #e8e8e8',
  textAlign: 'center',
  lineHeight: '40px'
}
const rightBorderNone = {
  borderRight: 'none'
}
const serchHeader = {
  overflow: 'hidden',
  marginTop: '10px'
}

const serchHeaderItem = {
  margin: '0 10px'
}
// 日历控件样式
const datePickerStyle = {
  width: '100%'
}
// 下拉框样式
const selectStyle = {
  width: '100%'
}
const submitButton = {
  position: 'fixed',
  width: '100%',
  height: '40px',
  left: 0,
  bottom: 0,
  background: '#4579bb',
  color: '#fff',
  lineHeight: '40px',
  textAlign: 'center'
}