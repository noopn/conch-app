import React, { Component } from 'react';
import { InputNumber, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment';
var symbol = ['#', '(', '+', '-', '*', '/', ')']
var symbolPriority = {
    '#': 0,
    '(': 1,
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    ')': 4
}
// 如果遇到左括号则直接入栈
// 如果遇到右括号,则弹出站内只到出现左括号为止
// 如果站外操作符的优先级高于站内的优先级则入栈
// 如果栈外的操作符优先级低于或等于栈内的优先级，输出栈内的符号，并入栈栈外的符号
// 中缀表达式遍历完成，但是栈中还有符号存在，一一出栈输出
function operaSymbol(char, symArr, resArr) {
    var lastChar = symArr[symArr.length - 1]
    if (!lastChar) {
        symArr.push(char)
        return
    }
    if (char === '(') {
        symArr.push(char)
    } else if (char === ')') {
        var curChar = symArr.pop()
        while (symArr && curChar != '(') {
            resArr.push(curChar)
            curChar = symArr.pop()
        }
    } else if (symbolPriority[char] > symbolPriority[lastChar]) {
        symArr.push(char)
    } else if (symbolPriority[char] <= symbolPriority[lastChar]) {
        while (lastChar && (symbolPriority[char] <= symbolPriority[lastChar])) {
            var curChar = symArr.pop()
            resArr.push(curChar)
            lastChar = symArr[symArr.length - 1]
        }
        //      operaSymbol(char, symArr, resArr)
        symArr.push(char)
    } else {
        symArr.push(char)
    }
}
function toSuffixExpre(str) {
    var resArr = []
    var symArr = []
    // 用于记录数字
    var substr = ''
    for (var i = 0, len = str.length; i < len; i++) {
        // 判断是否是符号
        if (symbol.includes(str[i])) {
            resArr.push(substr)
            substr = ''
            operaSymbol(str[i], symArr, resArr)
        } else {
            substr += str[i]
            // resArr.push(str[i])
        }
    }
    resArr.push(substr)
    while (symArr.length > 0) {
        var curChar = symArr.pop()
        resArr.push(curChar)
    }
    return resArr
}
function calculate(RPolishArray) {
    var result = 0;
    var tempArray = new Array(100);
    var tempNum = -1;
    for (var i = 0; i < RPolishArray.length; i++) {
        if (RPolishArray[i].match(/\d/)) {
            tempNum++;
            tempArray[tempNum] = RPolishArray[i];
        } else {
            switch (RPolishArray[i]) {
                case '+':
                    result = (tempArray[tempNum - 1] * 1) + (tempArray[tempNum] * 1);
                    tempNum--;
                    tempArray[tempNum] = result;
                    break;
                case '-':
                    result = (tempArray[tempNum - 1] * 1) - (tempArray[tempNum] * 1);
                    tempNum--;
                    tempArray[tempNum] = result;
                    break;
                case '*':
                    result = (tempArray[tempNum - 1] * 1) * (tempArray[tempNum] * 1);
                    tempNum--;
                    tempArray[tempNum] = result;
                    break;
                case '/':
                    result = (tempArray[tempNum - 1] * 1) / (tempArray[tempNum] * 1);
                    tempNum--;
                    tempArray[tempNum] = result;
                    break;
            }
        }
    }
    result = tempArray[tempNum].toFixed(2);
    return result;
}
function getQueryStringArgs() {
    //取得查询字符串，并去掉开头'?'
    var qs = location.href.split('?')[1] || '';
    //保存数据的对象
    var args = {},
        //以分割符'&'分割字符串，并以数组形式返回
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    //逐个将每一项添加到args对象中
    for (; i < len; i++) {
        item = items[i].split('=');
        //解码操作，因为查询字符串经过编码的
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}
class CustomComp extends Component {
    state = {
        isSaveOkModalVisible: false,
        yard: null,
        yardById: [],
        yardData: {},
        date: moment().format('YYYY-MM-DD HH:mm')
    }
    heapGroup = {
        5004: [
            { heapName: '堆A', group: '5004A' },
            { heapName: '堆B', group: '5004B' },
        ],
        5005: [
            { heapName: '堆A', group: '5005A' },
            { heapName: '堆B', group: '5005B' },
        ],
        5006: [
            { heapName: '堆A', group: '5006A' },
            { heapName: '堆B', group: '5006B' },
        ]
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
        const query = getQueryStringArgs();
        scriptUtil.excuteScriptService({
            objName: "KCCL",
            serviceName: "GetWarehouseByCategory",
            params: { type: '页岩' },
            cb: (res) => {
                this.setState({
                    yardById: _.map(res.result, item => item.id),
                    yardData: _.reduce(res.result, (obj, item) => { obj[item.id] = { ...item }; return obj }, {}),
                });
            }
        });
        _.map(['touchstart'], (event) => {
            this.selector.addEventListener(event, (e) => {
                e.stopPropagation();
            });
        });
        scriptUtil.excuteScriptService({
            objName: "KCCL",
            serviceName: "GetMineStrockDetail",
            params: {
                date: query.date.split(' ')[0],
                code: query.code
            },
            cb: (res) => {
                this.setState({
                    date: res.result.data.dataSource[0].recordTime.slice(0, -3),
                    yard: res.result.data.dataSource[0].whCode,
                });
                this.setState(res.result.data.dataSource.reduce((obj, item) => {
                    return Object.assign(obj, {
                        [`width${item.whCode}${item.name.slice(-1)}`]: item.width,
                        [`len${item.whCode}${item.name.slice(-1)}`]: item.len,
                        [`head${item.whCode}${item.name.slice(-1)}`]: item.head,
                    })
                }, {}))
            }
        });

    }
    handleInputChange = (val, key) => {
        this.setState({ [key]: val || null })
    }
    render() {
        const { yardById, yard, yardData } = this.state;
        return (
            <div
                style={containerStyle}
                onTouchMove={this.handleTouchMove}
                ref={ref => this.scrollDiv = ref}
            >

                <div style={listWrapper}>
                    <div style={listItemStyle}>
                        <label style={listItemLabel}>日期</label>
                        <div style={listItemInput}>{this.state.date}</div>

                    </div>
                    <div style={{ ...listItemStyle, marginBottom: '14px' }} ref={(el) => this.selector = el}>
                        <label style={listItemLabel}>堆场</label>
                        <div style={listItemInput}>{(this.state.yardData[this.state.yard] || {}).name}</div>


                    </div>
                    {yard && this.heapGroup[yard].map(item => (
                        <table style={table} cellpadding='5px'>
                            <tr>
                                <th style={th}>{item.heapName}</th>
                                <td style={td}></td>
                            </tr>
                            <tr>
                                <th style={th}>
                                    <p style={{ fontSize: '14px', height: '14px' }}> 取余</p>
                                    <p style={{ fontSize: '14px', height: '14px' }}>(提前换堆使用)</p>
                                </th>
                                <td style={td}><InputNumber value={this.state[`head${item.group}`]} style={{ width: '60%' }} onChange={(val => { this.handleInputChange(val, `head${item.group}`) })} placeholder='请输入堆头' /> 吨</td>
                            </tr>
                            <tr>
                                <th style={th}>长</th>
                                <td style={td}><InputNumber value={this.state[`len${item.group}`]} style={{ width: '60%' }} onChange={(val => { this.handleInputChange(val, `len${item.group}`) })} placeholder='请输入长' /> 米</td>
                            </tr>
                            <tr>
                                <th style={th}>宽</th>
                                <td style={td}><InputNumber value={this.state[`width${item.group}`]} style={{ width: '60%' }} onChange={(val => { this.handleInputChange(val, `width${item.group}`) })} placeholder='请输入宽' /> 米</td>
                            </tr>
                            {/* <tr>
                                <th style={th}>吨数</th>
                                <td style={td}>{this.getExp} {yard && '='} <strong style={thStrong}>{this.getExpValue(item.heapName)}</strong></td>
                            </tr> */}
                        </table>
                    ))}

                    <div style={btnContainerStyle}>
                        <div style={saveBtnStyle} onTouchStart={this.handleSubmit}> 修改 </div>
                    </div>
                </div>
            </div >
        );
    }
    get getExp() {
        const { yardById, yard, yardData } = this.state;
        if (yard && yardData[yard]) {
            const expression = JSON.parse(yardData[yard].expression);
            return expression.exp.replace(/head|high|width|len/g, ($) => expression.map[$])
        }
        return false;
    }
    getExpValue(heap) {
        const { yard, yardData } = this.state;
        if (yard && yardData[yard]) {
            const expression = JSON.parse(yardData[yard].expression);
            const exp = expression.exp
                .replace(/head|high|width|len/g, ($) => {
                    if (expression.expMap[$]) {
                        return expression.expMap[$];
                    }
                    return $;
                })
                .replace(/head|high|width|len/g, $ => {
                    return this.state[`${$}${yard}${heap.slice(-1)}`] || '0';
                });
            return calculate(toSuffixExpre(exp))
        }
        return false;
    }
    handleTouchMove = (e) => {
        // 如果弹窗打开的话 外面的不要滚动
        const currentPosition = e.changedTouches[0].clientY;
        // 部分手机没有scrollBy
        // this.scrollDiv.scrollBy(0, this.startPosition - currentPosition);
        const scrollTop = this.scrollDiv.scrollTop;
        this.scrollDiv.scrollTop = scrollTop + this.startPosition - currentPosition;
        this.startPosition = currentPosition;
        this.hasMove = true;
    }

    handleSubmit = () => {
        const { yard, widthA, lengthA, widthB, lengthB, date, headB, headA } = this.state;
        // if (!widthA || !lengthA || !widthB || !lengthB || !date || !yard) {
        //     message.warn('请检查是否填写完整');
        //     return false;
        // }
        Promise.all(
            this.heapGroup[yard].map(item => {
                return new Promise(resolve => {
                    scriptUtil.excuteScriptService({
                        objName: "MineStockRecord",
                        serviceName: "UpdateDataTableEntry",
                        params: {
                            updateData: JSON.stringify({
                                update: {
                                    width: this.state[`width${item.group}`] || 0,
                                    len: this.state[`len${item.group}`] || 0,
                                    head: this.state[`head${item.group}`] || 0,
                                },
                                where: {
                                    whCode: yard,
                                    // [`STR_TO_DATE(recordTime,'%Y-%m-%d')`]: date.split(' ')[0],
                                    // recordTime: date.split(' ')[0],
                                    // ["date_format(recordTime,'%Y-%m-%d')"]: date.split(' ')[0],
                                    recordTime: `${date}:00`,
                                    name: item.heapName,
                                }

                            })
                        },
                        cb: (res) => {
                            resolve()
                        }
                    });
                })
            })).then(() => {
                message.success('修改成功');
                setTimeout(() => {
                    scriptUtil.openPage('#/runtime-fullscreen/runtime-fullscreen/Page_2b63b71e37fd4884bb17cf3d42d72d77', '_self');
                }, 800)
            })
    }
}


export default CustomComp;

const containerStyle = {
    height: '100%',
    width: '100%',
    paddingBottom: 45,
    overflowY: 'scroll',
};
const pickerStyle = {
    width: '60%'
}

const listWrapper = {

}

const listItemStyle = {
    lineHeight: '50px',
    borderBottom: '1px solid #E0E0E0',
    padding: '4px 12px'
}
const listItemLabel = {
    fontWeight: 'bold',
    width: '80px',
    fontSize: '16px',
    color: '#222222',
    display: 'inline-block'
}

const listItemInput = {
    border: 'none',
    outLine: 'none',
    width: 'calc(100% - 80px)',
    color: '#666666',
    fontSize: '16px',
    display: 'inline-block',
    padding: '0 10px'
}
const btnContainerStyle = {
    display: 'flex',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
}
const commonBtn = {
    width: '100%',
    fontSize: '18px',
    padding: '8px',
    textAlign: 'center'
}

const saveBtnStyle = {
    ...commonBtn,
    color: '#fff',
    backgroundColor: '#2d7df6'
}
const table = {
    width: '100%',
    textAlign: 'left',
    marginTop: '10px',
    borderTop: ' 1px solid #E0E0E0',
}
const th = {
    fontSize: '16px',
    lineHeight: '40px',
    textIndent: '14px'
}
const td = {
    fontSize: '16px',
    lineHeight: '40px'
}
const thStrong = {
    whiteSpace: 'nowrap',
    width: '50px',
    display: 'inline-block'
}