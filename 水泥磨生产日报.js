import React, { Component } from 'react';
import { InputNumber, Button, DatePicker, Select, Table, Divider, Tag } from 'antd';
import moment from 'moment';
var css = document.createElement('style');
css.type = 'text/style';
css.id = 'CustomCompStyle';
css.innerHTML = '.ant-table .ant-table-tbody > tr > td { white-space: nowrap; border-bottom: 1px solid #e8e8e8; padding: 4px;}';
document.head.appendChild(css);

const columns = [{
  title: '原料消耗',
  children: [
    {
      title: '磨机',
      children: [
        {
          title: '磨机',
        }
      ]
    },
    {
      title: '品种',
      children: [
        {
          title: '品种',
        }
      ]
    },
    {
      title: '熟料',
      children: [
        {
          title: '熟料',
        },
        {
          title: '熟料(修订)',
        }
      ]
    },
    {
      title: '石膏',
      children: [
        {
          title: '石膏',
        },
        {
          title: '石膏(修订)',
        }
      ]
    },
    {
      title: '脱硫石膏',
      children: [
        {
          title: '脱硫石膏',
        },
        {
          title: '脱硫石膏(修订)',
        }
      ]
    },
    {
      title: '脱硫石膏',
      children: [
        {
          title: '脱硫石膏',
        },
        {
          title: '脱硫石膏(修订)',
        },
        {
          title: '脱硫石膏(自产)',
        },
        {
          title: '脱硫石膏(自产修订)',
        },
      ]
    },
    {
      title: '粉末',
      children: [
        {
          title: '粉末5',
        },
        {
          title: '粉末5(修订)',
        },
        {
          title: '粉末80',
        },
        {
          title: '粉末80(修订)',
        },
        {
          title: '粉煤灰',
        },
        {
          title: '粉煤灰(修订)',
        },
      ]
    },
    {
      title: '其他',
      children: [
        {
          title: '煤矸石',
        },
        {
          title: '煤矸石(修订)',
        },
        {
          title: '沸石',
        },
        {
          title: '沸石(修订)',
        },
        {
          title: '煤渣',
        },
        {
          title: '煤渣(修订)',
        },
        {
          title: 'S95级矿渣微粉',
        },
        {
          title: 'S95级矿渣微粉(修订)',
        },
        {
          title: '合计',
        },
        {
          title: '运转时长',
        },
        {
          title: '台产',
        },
        {
          title: '停机原因',
        },
      ]
    },
  ]
}];
const map = {
  "熟料": "chamotte0",
  "石膏": "gupse0",
  "脱硫石膏": "tgupse0",
  "脱硫石膏(自产)": "tgupsez0",
  "粉末5": "powder_5_0",
  "粉末80": "powder_80_0",
  "粉煤灰": "flyash0",
  "煤矸石": "gangue0",
  "沸石": "zeolite0",
  "煤渣": "coal_cinder0",
  "S95级矿渣微粉": "sand0",
  "熟料(修订)": "chamotte1",
  "石膏(修订)": "gupse1",
  "脱硫石膏(修订)": "tgupse1",
  "脱硫石膏(自产修订)": "tgupsez1",
  "粉末5(修订)": "powder_5_0",
  "粉末80(修订)": "powder_80_1",
  "粉煤灰(修订)": "flyash1",
  "煤矸石(修订)": "gangue1",
  "沸石(修订)": "zeolite1",
  "煤渣(修订)": "coal_cinder1",
  "磨机": "mill",
  "品种": "category",
  "S95级矿渣微粉(修订)": "sand1"
};
const dateFormat = 'YYYY-MM-DD';
class CustomComp extends Component {
  state = {
    width: '',
    data: [],
    produceDate: moment().format(dateFormat),
    team: '1', //班组
  }
  dealColumns = (columns) => {
    return columns.map(el => {
      let item = el;
      if (item.children) {
        item.children = this.dealColumns(item.children);
      }
      if (!item.children) {
        item = {
          ...item,
          width: 130,
          key: map[item.title],
          dataIndex: map[item.title],
          render: text => (<p style={{ textAlign: 'center', fontSize: '14px' }}>{`${text}`}</p>)
        }
      }
      return item;
    })
  }
  componentDidMount() {
    this.setState({
      columns: _.cloneDeep(this.dealColumns(columns)),
      data: new Array(30).fill(0).map((item, index) => {
        return Object.keys(map).reduce((obj, cur) => {
          obj[map[cur]] = 1;
          return obj;
        }, { key: index })
      })
      // width: this.state.columns.length * 110
    })
    const { produceDate, team } = this.state;
    // scriptUtil.excuteScriptService({
    //     objName: "SCGL",
    //     serviceName: "getCementProduce",
    //     params: {
    //         produceDate, team
    //     },
    //     cb: (res) => {
    //         console.log(res);
    //         this.setState({
    //             data: _.get(res, 'result.list', []).splice(60)
    //         })
    //     }
    // });
  }

  datePickChange = (date, dateString) => {
    this.setState({
      produceDate: dateString
    }, () => {
      const { produceDate, team } = this.state;
      scriptUtil.excuteScriptService({
        objName: "SCGL",
        serviceName: "getCementProduce",
        params: {
          produceDate, team
        },
        cb: (res) => {
          this.setState({
            data: _.get(res, 'result.list', [])
          })
        }
      });
    });
  }
  teamChange = (team) => {
    this.setState({
      team
    }, () => {
      const { produceDate, team } = this.state;
      scriptUtil.excuteScriptService({
        objName: "SCGL",
        serviceName: "getCementProduce",
        params: {
          produceDate, team
        },
        cb: (res) => {
          this.setState({
            data: _.get(res, 'result.list', [])
          })
        }
      });
    });
  }

  render() {
    const { produceDate, team } = this.state;
    return (
      <div style={containerWrapper}>
        <h1 style={tableTitle}>水泥磨生产班报</h1>
        <div style={serchHeader}>
          <div style={serchHeaderLeft}>
            <div style={serchHeaderItem}>
              <label>日期：</label>
              <DatePicker
                style={datePickerStyle}
                onChange={this.datePickChange}
                value={moment(produceDate)}
                suffixIcon={() => null}
              >
              </DatePicker>
            </div>
            <div style={serchHeaderItem}>
              <label>班组：</label>
              <Select
                style={selectStyle}
                value={team}
                onChange={this.teamChange}
              >
                <Select.Option value='1'>早</Select.Option>
                <Select.Option value='2'>中</Select.Option>
                <Select.Option value='3'>晚</Select.Option>
              </Select>
            </div>
          </div>
          <div style={serchHeaderRight}>
            <div style={serchHeaderItem}>
              <Button type="primary">保存</Button>
            </div>
            <div style={serchHeaderItem}>
              <Button type="primary">导出</Button>
            </div>

          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Table
            style={{ wordBreak: 'break-all' }}
            columns={this.state.columns}
            dataSource={this.state.data}
            pagination={false}
            bordered
            scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
          />
        </div>
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
const serchHeaderLeft = {
  float: 'left'
}
const serchHeaderRight = {
  float: 'right'
}
// 表头
const tableTitle = {
  textAlign: 'center',
}
// 搜索栏
const serchHeader = {
  overflow: 'hidden',
}

const serchHeaderItem = {
  display: 'inline-block',
  margin: '0 12px'
}
// 日历控件样式
const datePickerStyle = {

}
// 下拉框样式
const selectStyle = {
  width: '168px'
}