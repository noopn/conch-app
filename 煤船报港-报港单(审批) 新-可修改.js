import React, { Component, PureComponent } from 'react';
import { DatePicker, Icon, Upload, Checkbox, Input, message, InputNumber, Tabs, Modal } from 'antd';
const { TabPane } = Tabs;
var css = document.createElement('style');
css.type = 'text/css';
css.id = 'CustomCompStyle';
css.innerHTML = `
.ant-drawer-content-wrapper {
    height:300px !important
}
`;
window.parent.document.getElementsByTagName('head')[0].appendChild(css);
import moment from 'moment';

const config = {
    path: '/image',  // 设置上传之后保存的路径
    accept: '.bmp,.png,.tif,.gif,.jpeg,.jpg,.mp3,.mp4,.m3u8,.MOV,.QT,.avi,.mpeg,.mpg,.ram,.flv,.rm,.rmvb,.doc,.txt,.docx,.pdf,.word',  // 设置上传的文件类型,以英文逗号分割  如果不设置， 则默认是所有  
    fileSize: 10240,  //  设置最大能上传文件的大小 , 单位kb 
    action: 'api/app/manager/uploadResource',  // 上传的地址  获取到真实的url
}

/** 
 * 上传文件配置
*/



class UploadFileComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            deleteFileList: [],
            btnLoading: false,
        }
        this.requestConfig = {
            // headers:{
            //   Authorization : 'Bearer '+window.localStorage.ticket,
            // },
            data: {
                appId: this.props.data.getAttr('appDetail').appId,  // 必须要有
                path: config.path  // string  图片存的路径
            },
            method: 'post'
        }
        this.allowLoading = true // 是否允许上传
        this.fileProps = {
            accept: config.accept,//string, 接受上传的文件类型, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document 等等
            action: config.action,  // 请求url的地址  string|(file) => Promise
            method: this.requestConfig.method, // string,上传请求的 http method  'post' | 'put'  等等
            directory: false, // 是否支持文件夹 默认：false,
            beforeUpload: this.beforeUpload, // (file, fileList) => boolean | Promise 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传（ resolve 传入 File 或 Blob 对象则上传 resolve 传入对象）。注意：IE9 不支持该方法。
            customRequest: this.customRequest, // Function 通过覆盖默认的上传行为，可以自定义自己的上传实现 
            data: this.requestConfig.data,// object|(file) => object 上传所需额外参数或返回上传额外参数的方法 
            disabled: false, //boolean 是否禁用上传
            // headers:this.requestConfig.headers,//object 设置上传的请求头部，IE10 以上有效 
            listType: 'picture-card',  // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card;  默认：'text',
            defaultFileList: this.fileList, //  初始化默认已经上传的文件列表
            fileList: this.state.fileList,     //  上传的文件列表， 可控
            multiple: true,// boolean, 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
            // previewFile:this.previewFile, // 自定义文件预览逻辑 (file: File | Blob) => Promise<dataURL: string> ,
            showUploadList: true,// Boolean or { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean }  是否展示文件列表, 可设为一个对象，用于单独设定 showPreviewIcon, showRemoveIcon 和 showDownloadIcon
            openFileDialogOnClick: true, //boolean 点击打开文件对话框 默认：true,
            onChange: this.onChange, // Function({file: {  },fileList: [ ], event: { }}) 
            onPreview: this.onPreview, //Function(file) 点击文件的预览的回调
            onRemove: this.onRemove, // Function(file): boolean | Promise, 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除。 
            onDownload: this.onDownload, // Function(file): void,点击下载文件时的回调，如果没有指定，则默认跳转到文件 url 对应的标签页。 默认：跳转新标签页  
            // transformFile:this.transformFile, // Function(file): string | Blob | File | Promise<string | Blob | File> 在上传之前转换文件。支持返回一个 Promise 对象  
            className: 'upload-list-inline',  // 上传组件的外层类名
            withCredentials: false,  // boolean  是否携带cookie ， 默认：false
            name: 'file'  // 发到后台的文件参数名  默认：'file',

        };
        this.utils = {
            flattenMd: (arr) => {
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] instanceof Array) {
                        result = result.concat(this.utils.flattenMd(arr[i]));
                    } else {
                        result.push(arr[i]);
                    }
                }
                return result;
            }
        }
    };
    static getDerivedStateFromProps(props, preState) {
        if (Array.isArray(props.fileList) && !preState.fileList.length) {
            return { fileList: props.fileList }
        }
        return null
    }
    beforeUpload = (file) => {
        //  注意你的上传之前的钩子需要跟filePropS.accept 保持一致  否则会有不可预期的结果
        //  读取配置文件  
        //  容错处理
        const { fileList } = this.state;

        // if (Array.isArray(fileList) && fileList.some(_file => _file.name === file.name)) {
        //     message.warn('上传文件名字重复');
        //     this.allowLoading = false
        //     return false;
        // }
        try {
            let accept = config.accept.split(',')
            if (Array.isArray(accept) && accept.length > 0) {
                if (accept.length === 1 && !!accept[0] === false) {
                    this.allowLoading = true
                    return true
                }
                //  获取后缀名
                const suffix = file.name.substr(file.name.lastIndexOf('.')).toLowerCase()
                //  格式化内容。 防止用户输入不规范
                accept = accept.map(item => {
                    //  如果有多个. 
                    if (typeof item === 'string' && item.split('.').length > 2) {
                        return item.split('.').filter(item => item).map(item => ('.' + item).toLowerCase())
                    } else if (typeof item === 'string' && item.split('.').length === 1) {
                        return ('.' + item).toLowerCase()
                    } else if (typeof item === 'string' && item.indexOf('.') > 0 && item.split('.').length === 2) {
                        return item.split('.').filter(item => item).map(item => ('.' + item).toLowerCase())
                    }
                    return item
                })
                accept = this.utils.flattenMd(accept)
                if (accept.indexOf(suffix) > -1) {
                    this.allowLoading = true
                    return true
                } else {
                    message.error(`上传格式不规范，只能上传${accept.join(',')}格式的文件！`)
                    this.allowLoading = false
                    return false
                }
            }


        } catch (error) {
            this.allowLoading = false
            message.error('上传失败，请检查config里的accept设置是否错误')
            return false
        }
        //  验证文件大小 
        if (typeof config.fileSize === 'number' || (!isNaN(parseInt(config.fileSize)))) {
            this.allowLoading = file.size / 1024 < config.fileSize
            return this.allowLoading
        } else {
            //  如果不设置或者数据格式错误 默认无限制  
            this.allowLoading = true
            return true
        }
    }

    customRequest = (request) => {
        //  如果要自定义上传文件接口的话， 写这里 
        if (!this.allowLoading) return
        const { action, filename, data, file, headers, withCredentials, onProgress, onSuccess, onError } = request
        let formData = new FormData()
        const _file = new File([file], Date.now() + '_' + file.name, {
            type: file.type
        });
        formData.append('file', _file)
        formData.append('appId', data.appId)
        formData.append('path', data.path)
        data.file = formData
        scriptUtil.request(action, {
            fetchType: 'file',  // 如果是上传的话 设置fetchType = file
            method: this.requestConfig.method.toUpperCase(),
            body: formData,
            onUploadProgress: ({ total, loaded }) => {
                onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
            },
        }).then(res => {
            if ((res.status >= 200 && res.status < 400) || res.ok !== false) {
                //  上传成功
                onSuccess(res, file)
            } else {
                //  失败
                onError(file)
            }
        })
        return {
            abort() {
                console.log('upload progress is aborted.');
            },
        };

    }
    //  删除上传文件后执行的方法 返回布尔值  确认
    onRemove = async (file) => {
        let flag = await new Promise((resolve) => {
            const { fileList } = this.state;
            const newFileList = fileList.filter(_file => _file.uid !== file.uid);
            this.setState({ fileList: newFileList })
            this.props.handleFileList(newFileList)
        })
        return flag
    }
    onDownload = (file) => {
        const { uid, name, status, url, thumbUrl } = file
        if (status === 'done') {
            window.open(url)
        }
    }
    // onPreview = (file) => {
    //   const { uid, name, status, url, thumbUrl } = file

    //   if (status === 'done') {
    //     // alert(url)

    //     window.open(url)
    //   }
    // }
    onPreview = this.props.onPreview

    // transformFile = (file)=>{
    //   return new Promise(resolve => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //       const canvas = document.createElement('canvas');
    //       const img = document.createElement('img');
    //       img.src = reader.result;
    //       img.onload = () => {
    //         const ctx = canvas.getContext('2d');
    //         ctx.drawImage(img, 0, 0);
    //         ctx.fillStyle = 'red';
    //         ctx.textBaseline = 'middle';
    //         ctx.fillText('Ant Design', 20, 20);
    //         canvas.toBlob(resolve);
    //       };
    //     };
    //   });
    // }
    /**
     *上传中、完成、失败都会调用这个函数。
     *
     * @params {object} {file: {  },fileList: [ ], event: { }}
     * file 当前操作的文件对象。
        {
          uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
          name: 'xx.png'   // 文件名
          status: 'done', // 状态有：uploading done error removed
          response: '{"status": "success"}', // 服务端响应内容
          linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
        }
        fileList 当前的文件列表。
        event 上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持。
     */
    onChange = ({ file, fileList, event }) => {
        //  如果条件不允许上传
        if (!this.allowLoading) return

        // 对于受控模式，你应该在 onChange 中始终 setState fileList，保证所有状态同步到 Upload 内。 即最终必须调用setState。
        if (file.status === 'done') {
            //  上传完毕
            let { response } = file
            //  更改file url
            let fileIndex = fileList.findIndex(fileItem => fileItem.uid === file.uid)
            fileList[fileIndex].url = response.fullPath
            fileList[fileIndex].thumbUrl = response.fullPath
            fileList[fileIndex].percent = 100
            this.setState({ fileList, uploading: false })
            this.props.handleFileList(fileList);
        } else if (file.status === 'error') {
            message.error('上传失败')
            this.setState({ fileList, uploading: false })
        } else {
            this.setState({ fileList, uploading: true })
        }
    }


    render() {
        this.fileProps.fileList = this.state.fileList || [];
        return <Upload {...this.fileProps} listType='picture'>
            <Icon type="camera" style={{ fontSize: '36px', color: '#2D7DF6' }} />
        </Upload>

    }
}
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
        coalType: ''
    }
    componentDidMount() {
        const css = `::-webkit-scrollbar { display: none; }`;
        this.head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        _.map(['touchstart'], (event) => {
            document.querySelectorAll('.ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab')[0].addEventListener(event, (e) => {
                e.stopPropagation();
            });
            document.querySelectorAll('.ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab')[1].addEventListener(event, (e) => {
                e.stopPropagation();
            });
        });
        this.head.appendChild(this.style);

        this.style.type = 'text/css';
        if (this.style.styleSheet) {
            this.style.styleSheet.cssText = css;
        } else {
            this.style.appendChild(document.createTextNode(css));
        }
        this.disabledEdit = true;
        const Code = scriptUtil.getFormData(['Code']).Code;
        scriptUtil.excuteScriptService({
            objName: "BGGL",
            serviceName: "getBgTotal",
            params: { code: Code },
            cb: (res) => {
                const data = _.get(res, 'result.list[0]', {});
                data.bgpic = JSON.parse(data.bgpic ? data.bgpic : '[]')
                this.setState({ ...data })
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
    handleFileList = (fileList) => {
        this.setState({
            'bgpic': JSON.stringify(fileList),
        }, () => {
            scriptUtil.setFormData({
                'bgpic': JSON.stringify(fileList),
            });
        })
    }
    renderpost = () => {
        return (
            <div>
                {/* <div style={titleHead}>
                    运单记录
                </div> */}
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
                                    style={commonStyle}
                                    value={this.state.postInfoweightLeftHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightLeftHead', 'instanceInfoweightLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.postInfoweightLeftBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightLeftBody', 'instanceInfoweightLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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

                                    style={commonStyle}
                                    value={this.state.postInfoweightRightHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightRightHead', 'instanceInfoweightRightHead') }} />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.postInfoweightRightBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfoweightRightBody', 'instanceInfoweightRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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

                                    style={commonStyle}
                                    value={this.state.postInfonullLeftHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullLeftHead', 'instanceInfonullLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.postInfonullLeftBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullLeftBody', 'instanceInfonullLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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

                                    style={commonStyle}
                                    value={this.state.postInfonullRightHead}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullRightHead', 'instanceInfonullRightHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.postInfonullRightBody}
                                    onChange={(e) => { this.postInputChange(e.target.value, 'postInfonullRightBody', 'instanceInfonullRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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
                {/* <div style={titleHead}>
                    实测记录
                </div> */}
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

                                    style={commonStyle}
                                    value={this.state.instanceInfoweightLeftHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.instanceInfoweightLeftBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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

                                    style={commonStyle}
                                    value={this.state.instanceInfoweightRightHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightRightHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.instanceInfoweightRightBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfoweightRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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

                                    style={commonStyle}
                                    value={this.state.instanceInfonullLeftHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullLeftHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.instanceInfonullLeftBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullLeftBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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

                                    style={commonStyle}
                                    value={this.state.instanceInfonullRightHead}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullRightHead') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

                                    style={commonStyle}
                                    value={this.state.instanceInfonullRightBody}
                                    onChange={(e) => { this.instanceInputChange(e.target.value, 'instanceInfonullRightBody') }}
                                />
                            </div>
                            <div style={topDescStyle}>
                                <Input
                                    type='number'

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

                            value={this.state.kgTime ? moment(this.state.kgTime, dateFormat) : null}
                            style={commonStyle}
                            onChange={(date, dateString) => { this.instanceInputChange(dateString, 'kgTime') }}
                        ></DatePicker>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>杂物积水</div>
                    <div style={topDescStyle}>
                        <Checkbox

                            checked={this.state.isjszzInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'isjszzInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            disabled={!this.state.isjszzInput}
                            value={this.state.jszzInput}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'jszzInput') }}
                        />
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸载前抓痕</div>
                    <div style={topDescStyle}>
                        <Checkbox
                            checked={this.state.isyzhInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'isyzhInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            disabled={!this.state.isyzhInput}
                            value={this.state.yzhInput}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'yzhInput') }}
                        />
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸空时间</div>
                    <div style={topDescStyle4}>
                        <DatePicker
                            style={commonStyle}
                            onChange={(date, dateString) => { this.instanceInputChange(dateString, 'xkTime') }}
                            value={this.state.xkTime ? moment(this.state.xkTime, dateFormat) : null}
                        ></DatePicker>
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸前印记</div>
                    <div style={topDescStyle}>
                        <Checkbox

                            checked={this.state.isyjInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'isyjInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            value={this.state.yjInput}
                            disabled={!this.state.isyjInput}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'yjInput') }}
                        />
                    </div>
                </div>
                <div style={topDivContainerStyle}>
                    <div style={topDescStyle}>卸前雨布</div>
                    <div style={topDescStyle}>
                        <Checkbox

                            checked={this.state.ishbInput}
                            onChange={(e) => { this.instanceInputChange(e.target.checked, 'ishbInput') }}
                        >有</Checkbox></div>
                    <div style={topDescStyle3}>
                        <Input
                            style={commonStyle}
                            disabled={!this.state.ishbInput}
                            value={this.state.hbInput}
                            onChange={(e) => { this.instanceInputChange(e.target.value, 'hbInput') }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderPhoto = () => {
        return (
            <div>
                <div style={titleHead}>
                    拍照上传
                    </div>
                <div style={topDivContainerStyle}>
                    <div style={photoArea}>
                        <UploadFileComponent ref={(el) => this.uploadRef = el} data={this.props.data} fileList={this.state.bgpic || []} onPreview={this.onPreview} handleFileList={this.handleFileList} />
                        {/* <Icon type="camera" style={{ fontSize: '36px', color: '#2D7DF6' }} /> */}
                    </div>
                </div>
            </div>
        );
    }
    onPreview = file => {
        const { uid, name, status, url, thumbUrl } = file;
        if (status === "done") {
            this.setState({
                previewURL: url,
                previewName: name,
                visible: true
            });
        }
    };
    handleCancel = e => {
        this.setState({
            visible: false
        });
    };
    render() {
        return (
            <div style={containerStyle}
                ref={ref => this.scrollDiv = ref}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove} dateFormat
                onScroll={this.handleScroll}
            >
                <div style={topDivContainerStyle}>
                    <div style={topTitleStyle}>船号</div>
                    <div style={topTitleStyle}>报港日期</div>
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
                            onChange={(date, dateString) => { this.instanceInputChange(dateString, 'arriveTime') }}
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
                <Tabs type="card" size='large'>
                    <TabPane tab="运单记录" key="1">
                        {this.renderpost()}
                    </TabPane>
                    <TabPane tab="实测记录" key="2">
                        {this.renderInstance()}
                    </TabPane>
                </Tabs>
                {this.renderDiff()}
                {this.renderPhoto()}
                <Modal
                    title={this.state.previewName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img src={this.state.previewURL} width="100%" height="100%" />
                </Modal>
            </div>
        );
    }
    // ----------处理滚动开始, 应该不用动----------
    handleTouchStart = (e) => {
        this.startPosition = e.changedTouches[0].clientY;
    }

    handleTouchMove = (e) => {
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
    background: '#fff',
    position: 'relative',
    marginBottom: '100px'
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
