import React, { Component, PureComponent } from "react";
import {
  DatePicker,
  Icon,
  Upload,
  Checkbox,
  Input,
  message,
  Select,
  Button,
  Modal
} from "antd";
import moment from "moment";
var css = document.createElement("style");
css.type = "text/css";
css.id = "CustomCompStyle";
css.innerHTML = `
  body{
    user-select: none;
  }
  .ant-modal-wrap .ant-modal-content .ant-modal-body {
    padding: 0
  }
  .ant-upload-list-picture-card .ant-upload-list-item {
    float: left;
    width: 30%;
    height: 104px;
    margin: 0 3% 3% 0;
  }
  .ant-calendar-picker{
    width: auto !important;
  }
  .ant-calendar-input-wrap {
    display: none !important;
  }
  `;
// .ant-calendar-picker-container{
//   position: fixed !important;
//     left: 50% !important;
//     top: 50% !important;
//     transform: translate3d(-50%, -50%, 0) !important;
//     transition: all 0s !important;
// }
document.getElementsByTagName("head")[0].appendChild(css);
/**
 *  上传文件配置
 *
 *
 *
 *
 */
const config = {
  path: "/image", // 设置上传之后保存的路径
  accept:
    ".bmp,.png,.tif,.gif,.jpeg,.jpg,.mp3,.mp4,.m3u8,.MOV,.QT,.avi,.mpeg,.mpg,.ram,.flv,.rm,.rmvb,.doc,.txt,.docx,.pdf,.word", // 设置上传的文件类型,以英文逗号分割  如果不设置， 则默认是所有
  fileSize: 10240, //  设置最大能上传文件的大小 , 单位kb
  action: "api/app/manager/uploadResource" // 上传的地址  获取到真实的url
};

/**
 * 上传文件配置
 */

class UploadFileComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: null,
      deleteFileList: [],
      btnLoading: false
    };
    this.requestConfig = {
      // headers:{
      //   Authorization : 'Bearer '+window.localStorage.ticket,
      // },
      data: {
        appId: this.props.data.getAttr("appDetail").appId, // 必须要有
        path: config.path // string  图片存的路径
      },
      method: "post"
    };
    this.allowLoading = true; // 是否允许上传
    this.fileProps = {
      accept: config.accept, //string, 接受上传的文件类型, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document 等等
      action: config.action, // 请求url的地址  string|(file) => Promise
      method: this.requestConfig.method, // string,上传请求的 http method  'post' | 'put'  等等
      directory: false, // 是否支持文件夹 默认：false,
      beforeUpload: this.beforeUpload, // (file, fileList) => boolean | Promise 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传（ resolve 传入 File 或 Blob 对象则上传 resolve 传入对象）。注意：IE9 不支持该方法。
      customRequest: this.customRequest, // Function 通过覆盖默认的上传行为，可以自定义自己的上传实现
      data: this.requestConfig.data, // object|(file) => object 上传所需额外参数或返回上传额外参数的方法
      disabled: false, //boolean 是否禁用上传
      // headers:this.requestConfig.headers,//object 设置上传的请求头部，IE10 以上有效
      listType: "picture-card", // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card;  默认：'text',
      defaultFileList: this.fileList, //  初始化默认已经上传的文件列表
      fileList: this.state.fileList, //  上传的文件列表， 可控
      multiple: true, // boolean, 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
      // previewFile:this.previewFile, // 自定义文件预览逻辑 (file: File | Blob) => Promise<dataURL: string> ,
      showUploadList: true, // Boolean or { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean }  是否展示文件列表, 可设为一个对象，用于单独设定 showPreviewIcon, showRemoveIcon 和 showDownloadIcon
      openFileDialogOnClick: true, //boolean 点击打开文件对话框 默认：true,
      onChange: this.onChange, // Function({file: {  },fileList: [ ], event: { }})
      onPreview: this.onPreview, //Function(file) 点击文件的预览的回调
      onRemove: this.onRemove, // Function(file): boolean | Promise, 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除。
      onDownload: this.onDownload, // Function(file): void,点击下载文件时的回调，如果没有指定，则默认跳转到文件 url 对应的标签页。 默认：跳转新标签页
      // transformFile:this.transformFile, // Function(file): string | Blob | File | Promise<string | Blob | File> 在上传之前转换文件。支持返回一个 Promise 对象
      className: "upload-list-inline", // 上传组件的外层类名
      withCredentials: false, // boolean  是否携带cookie ， 默认：false
      name: "file" // 发到后台的文件参数名  默认：'file',
    };
    this.utils = {
      flattenMd: arr => {
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
    };
  }
  static getDerivedStateFromProps(props, preState) {
    if (Array.isArray(props.fileList) && preState.fileList === null) {
      return { fileList: props.fileList };
    }
    return null;
  }
  beforeUpload = file => {
    //  注意你的上传之前的钩子需要跟filePropS.accept 保持一致  否则会有不可预期的结果
    //  读取配置文件
    //  容错处理
    const { fileList } = this.state;

    // if (
    //   Array.isArray(fileList) &&
    //   fileList.some(_file => _file.name === file.name)
    // ) {
    //   message.warn("上传文件名字重复");
    //   this.allowLoading = false;
    //   // return false;
    //   return Promise.reject(this.allowLoading);
    // }
    try {
      let accept = config.accept.split(",");
      if (Array.isArray(accept) && accept.length > 0) {
        if (accept.length === 1 && !!accept[0] === false) {
          this.allowLoading = true;
          // return true;
        }
        //  获取后缀名
        const suffix = file.name
          .substr(file.name.lastIndexOf("."))
          .toLowerCase();
        //  格式化内容。 防止用户输入不规范
        accept = accept.map(item => {
          //  如果有多个.
          if (typeof item === "string" && item.split(".").length > 2) {
            return item
              .split(".")
              .filter(item => item)
              .map(item => ("." + item).toLowerCase());
          } else if (typeof item === "string" && item.split(".").length === 1) {
            return ("." + item).toLowerCase();
          } else if (
            typeof item === "string" &&
            item.indexOf(".") > 0 &&
            item.split(".").length === 2
          ) {
            return item
              .split(".")
              .filter(item => item)
              .map(item => ("." + item).toLowerCase());
          }
          return item;
        });
        accept = this.utils.flattenMd(accept);
        if (accept.indexOf(suffix) > -1) {
          this.allowLoading = true;
          // return true;
        } else {
          message.error(
            `上传格式不规范，只能上传${accept.join(",")}格式的文件！`
          );
          this.allowLoading = false;
          return Promise.reject(this.allowLoading);
          // return false;
        }
      }
    } catch (error) {
      this.allowLoading = false;
      message.error("上传失败，请检查config里的accept设置是否错误");
      return Promise.reject(this.allowLoading);
      // return false;
    }
    //  验证文件大小
    if (
      typeof config.fileSize === "number" ||
      !isNaN(parseInt(config.fileSize))
    ) {
      if (file.size / 1024 < config.fileSize) {
        this.allowLoading = true;
      } else {
        message.error(
          `上传失败，目前上传文件设置大小最大只能${config.fileSize / 1024}M`
        );
        this.allowLoading = false;
        return Promise.reject(this.allowLoading);
      }
    } else {
      //  如果不设置或者数据格式错误 默认无限制

      this.allowLoading = true;
    }
    // 移动端的bug 不兼容处理
    if (file.size <= 0) {
      this.allowLoading = false;
    }
    return new Promise((resolve, reject) => {
      if (this.allowLoading) {
        resolve(this.allowLoading);
      } else {
        reject(this.allowLoading);
      }
    });
  };

  customRequest = request => {
    //  如果要自定义上传文件接口的话， 写这里
    if (!this.allowLoading) return;
    const {
      action,
      filename,
      data,
      file,
      headers,
      withCredentials,
      onProgress,
      onSuccess,
      onError
    } = request;
    let formData = new FormData();
    const _file = new File([file], Date.now() + '_' + file.name, {
      type: file.type
    });
    formData.append("file", _file);
    formData.append("appId", data.appId);
    formData.append("path", data.path);
    data.file = formData;
    scriptUtil
      .request(action, {
        fetchType: "file", // 如果是上传的话 设置fetchType = file
        method: this.requestConfig.method.toUpperCase(),
        body: formData,
        onUploadProgress: ({ total, loaded }) => {
          onProgress(
            { percent: Math.round((loaded / total) * 100).toFixed(2) },
            file
          );
        }
      })
      .then(res => {
        if ((res.status >= 200 && res.status < 400) || res.ok !== false) {
          //  上传成功
          onSuccess(res, file);
        } else {
          //  失败
          onError(file);
        }
      });
    return {
      abort() {
        console.log("upload progress is aborted.");
      }
    };
  };
  //  删除上传文件后执行的方法 返回布尔值  确认
  onRemove = async file => {
    let flag = await new Promise(resolve => {
      Modal.confirm({
        title: "撤销上传",
        content: "确认删除此文件？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.setState(state => {
            return {
              fileList: state.fileList.filter(_file => _file.uid !== file.uid),
              deleteFileList: state.deleteFileList.concat(file)
            };
          });
        },
        onCancel: () => { }
      });
    });
    return flag;
  };
  onDownload = file => {
    const { uid, name, status, url, thumbUrl } = file;
    if (status === "done") {
      window.open(url);
    }
  };
  // onPreview = (file) => {
  //   const { uid, name, status, url, thumbUrl } = file

  //   if (status === 'done') {
  //     // alert(url)

  //     window.open(url)
  //   }
  // }
  onPreview = this.props.onPreview;

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
    if (!this.allowLoading) return;

    // 对于受控模式，你应该在 onChange 中始终 setState fileList，保证所有状态同步到 Upload 内。 即最终必须调用setState。
    if (file.status === "done") {
      //  上传完毕
      let { response } = file;
      //  更改file url
      let fileIndex = fileList.findIndex(fileItem => fileItem.uid === file.uid);
      fileList[fileIndex].url = response.fullPath;
      fileList[fileIndex].thumbUrl = response.fullPath;
      fileList[fileIndex].percent = 100;
      this.setState({ fileList, uploading: false });
    } else if (file.status === "error") {
      message.error("上传失败");
      this.setState({ fileList, uploading: false });
    } else {
      this.setState({ fileList, uploading: true });
    }
  };

  render() {
    this.fileProps.fileList = this.state.fileList || [];
    return (
      <Upload {...this.fileProps}>
        <Icon type="camera" style={{ fontSize: "36px", color: "#2D7DF6" }} />
      </Upload>
    );
  }
}
function getQueryStringArgs() {
  //取得查询字符串，并去掉开头'?'
  var qs = location.href.split("?")[1] || "";
  //保存数据的对象
  var args = {},
    //以分割符'&'分割字符串，并以数组形式返回
    items = qs.length ? qs.split("&") : [],
    item = null,
    name = null,
    value = null,
    i = 0,
    len = items.length;
  //逐个将每一项添加到args对象中
  for (; i < len; i++) {
    item = items[i].split("=");
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
    beltWeight: "", //皮带秤吨位
    visible: false
  };
  fileList = [];
  componentDidMount() {
    const query = getQueryStringArgs();
    //隐藏滚轮
    const css = `::-webkit-scrollbar { display: none; }`;
    this.head = document.head || document.getElementsByTagName("head")[0];
    this.style = document.createElement("style");

    this.head.appendChild(this.style);
    this.style.type = "text/css";
    if (this.style.styleSheet) {
      this.style.styleSheet.cssText = css;
    } else {
      this.style.appendChild(document.createTextNode(css));
    }
    setTimeout(() => {
      _.map(['touchstart'], (event) => {
        document.querySelector('.ant-upload.ant-upload-select-picture-card > .ant-upload').addEventListener(event, (e) => {
          e.stopPropagation();
        });
      }, 100);
    });
    window.addEventListener("resize", function () {
      if (
        document.activeElement.tagName == "INPUT" ||
        document.activeElement.tagName == "TEXTAREA"
      ) {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
    });

    scriptUtil.excuteScriptService({
      objName: "BGGL",
      serviceName: "getMobileLGList",
      params: { code: query.code },
      cb: res => {
        const data = res.result.list[0];
        // data.pic = JSON.parse(data.pic ? data.pic : '[]')
        this.setState({ ...data });
      }
    });
  }
  handleChange = (e, key) => {
    this.setState({
      [key]: e.target.value
    });
  };
  handleDateChange = (m, type, key) => {
    if (type === "date") {
      this.setState({
        [key]: m.format("YYYY-MM-DD")
      });
    } else if (type === "time") {
      this.setState({
        [key]: m.format("YYYY-MM-DD HH:mm")
      });
    }
  };
  handleSaveClick = () => {
    const jsonData = {
      where: {
        Code: this.state.code
      },
      update: {
        beltWeight: this.state.beltWeight,
        qxDate: this.state.qxDate,
        tzqcDate: this.state.tzqcDate,
        sqcDate: this.state.sqcDate,
        eqcDate: this.state.eqcDate,
        qcMember: this.state.qcMember,
        lgDate: this.state.lgDate,
        // 'pic': JSON.stringify(this.uploadRef.state.fileList.map(item => item.response.fullPath))
        bgpic: JSON.stringify(this.uploadRef.state.fileList)
      }
    };
    if (this.uploadRef.state.deleteFileList.length) {
      this.uploadRef.state.deleteFileList.forEach(file => {
        const path = file.response.filePath; // 这里写死了， 你自己要设置删除的文件路径名称
        const appId = this.props.data.getAttr("appDetail").appId;
        const url = `api/app/resource/fileAndfolder?path=${path}&appId=${appId}`;
        scriptUtil.request(url, {
          method: "DELETE"
        });
      });
    }
    console.log(jsonData);
    scriptUtil.excuteScriptService({
      objName: "BgMainDt",
      serviceName: "UpdateDataTableEntry",
      params: {
        updateData: JSON.stringify(jsonData),
      },
      cb: res => {
        this.showDialogue("保存成功");
        setTimeout(() => {
          scriptUtil.openPage(
            "#/runtime-fullscreen/runtime-fullscreen/Page_a472668c7a5844aeae3f55b2e61da092",
            "_self"
          );
        }, 1500);
      }
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  onPreview = file => {
    const { uid, name, status, url, thumbUrl } = file;

    if (status === "done") {
      // alert(url)
      this.setState({
        previewURL: url,
        previewName: name,
        visible: true
      });
      // window.open(url)
    }
  };
  render() {
    const { message } = this.state;
    return (
      <div
        style={containerStyle}
        ref={ref => (this.scrollDiv = ref)}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onScroll={this.handleScroll}
      >
        {this.state.isSaveOkModalVisible && (
          <div style={saveOkModalOutMostContainer}>
            <div style={saveOkModalContainer}>
              <img
                style={saveOkImgStyle}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAABU5JREFUaAXVms1vFVUYxlvFxG9DRROigsZIYw1RmhA3IigVE/foQhN2ysqdiX+AC13UhQu3XbBEiJJoRAuUhRs1EU00Clo/AtEgjaExUSzk+vvNPQfmTi7tzJmZW+6TPD1nZs553ve9c76noyMNotPpjCO3Az4GN8EH4B3wVij+hufhz/AkPAHnRkdHfyC9NkAQk3AanoapsK4ak3WjGk0VwPhW6r4Fn8ppLJGfCzxD+nuOZEfW53gPeetuhzfAiKNkXuetfRFvtJoSyDh8D0acJ7MP7oa3VzVuHfg8VEOtiP1kbLbtAPE10GaxBMW/0Os7m7KoVtBUW2hLG2uaspHpIDgGj0BxCc7A+xo1khNDe0OwoS0xC8dyRdKzCE3AH6E4C7elq1Wrqa1gkyTzYaKaQqE0Is/ARdXACbixUKT1S23Cr6Gwj00lGaWibyYGc4D8LUlCDVTSNtQHYVDV3hQV7DOxmSmUPLw3EE8moQ/wIBT6Vq5PUdDRLA4ANrNVezPFH0NfYGx+DhQrj34UcpgUDgAD7zPFIIrX+hR8I+lMF5/3XFPASdOx3+FyYKNZjxMlLvQt+KivV598eRhXADMldFe1CL7OQLG/ryM82Jo97q4AWps0+xpPuImvTr5xReG6shc8jAPB8u2yt9qqXuFz7O9HehzhwSQUjvGNrc16jLRwoa/BZ5LOFk1cF+y8GNJDLNsXQv6aT4Kvh4KjL112mOji5mz35ZsDzuCDfaJy36WOWw9xOnOZjEO1+A9W3s80ETd2d8J/YNepCqL6DPVdjNvkdoT67u0XK2g1UhQnnkDoA3gj/LiqaPD5eKi33YA80BBz2d8B/iEYh9sPocur9+FemIJjodIWA4ozrWcAAwPBPIqxw9Bm7pt5gV/7ImkKou8PjSA8D8WuFKWUOth6GLpWFEfhTSk6sQ71dykE5g1oIct2OptjgTZTbD0IzwSbn5HGM7tks2hsDnoLBnQhXKyrqkg9h9o34L1l6obyv5KKL6GHkLWBzjoFwYW6Ab3W1el8S7qsczxfD0+F8t+QltuglQgXrZ6AkpscQnfB2AcPk++74QrlviMV38O7S/hZugh6scmdqz0oIObZg2tA8W7RC+6the58xU/QE9NGgWbPoBBX2XtSrSD4LLwIxatRh7yz+OfeBL/B++OzJlN090Ax6zzkVwCR/MsxfzifxEDeRvg5eDP3nDSdPP+AOyn3C2kbiIPSSZvcK1B8UtcSGu9kSt3jL4dk8Sd8pK72cvXR/1RD4GUDamxxitb18CMY8ReZbJ+ynEN1nqGfX5x2Vz3cbGz7gNZt0H5zDj5ex9kydbHRu32wEjenodhXRmSlMuh4KOjquXXoMxRXjg64GOYt+GIWTrFpczMO31cibf33rWfAtxKC6T0kUZYH+WOsDfVMtV8bf11HXv0YKwTlZ0Ax/AeNISCH8GE4Cn4SPy8FX+MGtX+zoFBsl2fJb+xfavXu6hPUN7Fyf6dQ/nOKny6G+3NKaHpjBOJHJXEADu8Hr9iYCGICxm2BQa3am9I2PAiFPlX7JJkLaioIKGTzG3if0mawTZIFMxX9S0oR8U3F5mdn3JYklFBJWzAOAPqQ9maKthGyT81C4XA5A1ubfNUONrQltN3YGUQWH4KOfg7pzlPCWdrrxj6/qBU04wpAW9roe1ZR/OGTrhF38o0rCrJZu3bF6zK+8mG/dUJdNeJCk2xmY/lJs08EycMxBt1avwmfzukukffg/Bgcjn8vyzmfZQlsEtos4iaRbGVYV43au9vkN1QMzGscKvsvmvMUPwW/gsc5PGnsXzT/B1OxBjEc1WO5AAAAAElFTkSuQmCC"
              />
              <div style={saveOkTextStyle}>{message}</div>
            </div>
          </div>
        )}
        {/* <div style={tableItem}>
            <h1 style={headerTitle}>离港信息</h1>
          </div> */}
        <div style={tableItem}>
          <div style={{ textAlign: "center" }}>
            <label style={labelItem}>上传图片</label>
          </div>
          <div style={photoArea}>
            <UploadFileComponent
              ref={el => (this.uploadRef = el)}
              data={this.props.data}
              fileList={this.state.bgpic}
              onPreview={this.onPreview}
            />
          </div>
        </div>
        <div style={tableItem}>
          <div style={tableItemLeft}>
            <label style={labelItem}>皮带秤吨位</label>
          </div>
          <div style={tableItemRight}>
            <Input
              style={inputStyle}
              placeholder="请输入皮带秤吨位"
              value={this.state.beltWeight}
              onChange={e => this.handleChange(e, "beltWeight")}
            />
          </div>
        </div>
        <div style={tableItem}>
          <div style={tableItemLeft}>
            <label style={labelItem}>启卸日期</label>
          </div>
          <div style={tableItemRight}>
            <DatePicker
              placeholder="请选择起卸时间"
              format="YYYY-MM-DD HH:mm"
              showTime={{ format: "HH:mm" }}
              value={
                this.state.qxDate
                  ? moment(this.state.qxDate, "YYYY-MM-DD HH:mm")
                  : null
              }
              onChange={m => this.handleDateChange(m, "time", "qxDate")}
            />
          </div>
        </div>
        <div style={tableItem}>
          <div style={tableItemLeft}>
            <label style={labelItem}>通知清仓日期</label>
          </div>
          <div style={tableItemRight}>
            <DatePicker
              placeholder="请选择清仓时间"
              format="YYYY-MM-DD HH:mm"
              showTime={{ format: "HH:mm" }}
              value={
                this.state.tzqcDate
                  ? moment(this.state.tzqcDate, "YYYY-MM-DD HH:mm")
                  : null
              }
              onChange={m => this.handleDateChange(m, "time", "tzqcDate")}
            />
          </div>
        </div>
        <div style={tableItem}>
          <div style={tableItemLeft}>
            <label style={labelItem}>开始清仓时间</label>
          </div>
          <div style={tableItemRight}>
            <DatePicker
              placeholder="请选择开始时间"
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={
                this.state.sqcDate
                  ? moment(this.state.sqcDate, "YYYY-MM-DD HH:mm")
                  : null
              }
              onChange={m => this.handleDateChange(m, "time", "sqcDate")}
            />
          </div>
        </div>
        <div style={tableItem}>
          <div style={tableItemLeft}>
            <label style={labelItem}>结束清仓时间</label>
          </div>
          <div style={tableItemRight}>
            <DatePicker
              placeholder="请选择结束时间"
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={
                this.state.eqcDate
                  ? moment(this.state.eqcDate, "YYYY-MM-DD HH:mm")
                  : null
              }
              onChange={m => this.handleDateChange(m, "time", "eqcDate")}
            />
          </div>
        </div>
        <div style={tableItem}>
          <div style={tableItemLeft}>
            <label style={labelItem}>清仓人数</label>
          </div>
          <div style={tableItemRight}>
            <Input
              style={inputStyle}
              placeholder="请输入清仓人数"
              value={this.state.qcMember}
              onChange={e => this.handleChange(e, "qcMember")}
            />
          </div>
        </div>
        <div style={tableItem}>
          <div style={tableItemLeft}>
            <label style={labelItem}>离港日期</label>
          </div>
          <div style={tableItemRight}>
            <DatePicker
              placeholder="请选择离港日期"
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={
                this.state.lgDate
                  ? moment(this.state.lgDate, "YYYY-MM-DD HH:mm")
                  : null
              }
              onChange={m => this.handleDateChange(m, "time", "lgDate")}
            />
          </div>
        </div>
        <div style={tableItem}></div>
        <div style={btnContainerStyle}>
          <div style={saveBtnStyle} onTouchStart={this.handleSaveClick}>
            保 存
            </div>
        </div>
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

  showDialogue = message => {
    this.state.message = message;
    // 这里只是保存成功后, 显示保存成功的弹窗
    this.setState({ isSaveOkModalVisible: true }, () => {
      // 2秒后隐藏弹窗, 时间可以自己改
      setTimeout(() => {
        this.setState({ isSaveOkModalVisible: false });
      }, 2000);
    });
  };

  // input框的输入
  handleInput = (item, e) => {
    item[e.target.name] = e.target.value;
    item[e.target.name] = e.target.value;
    this.setState({ dataSections: [...this.state.dataSections] });
  };

  // ----------处理滚动开始, 应该不用动----------
  handleTouchStart = e => {
    this.startPosition = e.changedTouches[0].clientY;
  };

  handleTouchMove = e => {
    if (this.state.isAnalysisResultModalVisible) return;
    const currentPosition = e.changedTouches[0].clientY;
    const scrollTop = this.scrollDiv.scrollTop;
    this.scrollDiv.scrollTop = scrollTop + this.startPosition - currentPosition;
    this.startPosition = currentPosition;
  };

  handleScroll = e => {
    e.preventDefault();
  };
  // 弹窗里的
  handleTouchStartModal = e => {
    this.modalStartPosition = e.changedTouches[0].clientY;
  };

  handleTouchMoveModal = e => {
    const currentPosition = e.changedTouches[0].clientY;
    this.modalScrollDiv.scrollBy(0, this.modalStartPosition - currentPosition);
    this.modalStartPosition = currentPosition;
  };

  handleScrollModal = e => {
    e.preventDefault();
  };
  // ----------处理滚动结束, 应该不用动----------
}

export default CustomComp;
const photoArea = {
  // width: '90%',
  padding: "10px 16px",
  minHeight: "120px",
  border: "1px dashed #2D7DF6",
  lineHeight: "133px",
  textAlign: "center",
  margin: "0 auto 0",
  background: "#fff"
};
const containerStyle = {
  height: "100vh",
  width: "100%",
  overflowY: "scroll",
  paddingBottom: 45
};
const backgroundColor = "#f5f6fa";
const borderColor = "#e6e9f0";
const fontColor = {
  primary: "#1f2e4d",
  secondary: "#49565e",
  red: "#f05656"
};

const tableItem = {
  border: "1px solid #787878",
  lineHeight: "50px"
};

const headerTitle = {
  fontSize: "20px",
  textAlign: "center",
  lineHeight: "42px",
  margin: "0"
};
const tableItemLeft = {
  width: "120px",
  textAlign: "center",
  display: "inline-block",
  borderRight: "1px solid #787878"
};
const tableItemRight = {
  width: "calc(100% - 140px)",
  display: "inline-block",
  paddingLeft: "14px"
};
const labelItem = {
  fontSize: "15px",
  whiteSpace: 'nowrap'
};
const inputStyle = {
  border: "none",
  outline: "none",
  fontSize: "16px"
};
// 保存弹窗
const saveOkModalOutMostContainer = {
  height: "100vh",
  width: "100%",
  position: "fixed",
  zIndex: 1000000,
  top: 0,
  left: 0
};

const saveOkModalContainer = {
  width: 227,
  height: 227,
  zIndex: 1000000,
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(0, 0, 0, 0.7)"
};

const saveOkImgStyle = {
  marginTop: "55px"
};

const saveOkTextStyle = {
  fontSize: 16,
  color: "#fff",
  marginTop: 25,
  borderRight: 4
};

const volumnTitleWidth = 40;
const volumnContainerStyle = {
  position: "relative",
  width: volumnTitleWidth,
  borderTop: `solid 1px ${borderColor}`,
  borderRight: `solid 1px ${borderColor}`
};
const volumnTitleTextStyle = {
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};
const volumnDetailItemTitleStyle = {
  fontSize: 12,
  color: fontColor.secondary,
  width: `calc(60% - ${volumnTitleWidth}px)`,
  marginRight: "auto"
};
// 保存按钮
const btnContainerStyle = {
  display: "flex",
  width: "100%",
  position: "fixed",
  bottom: 0,
  left: 0,
  borderTop: `solid 1px ${borderColor}`
};
const commonBtn = {
  width: "100%",
  fontSize: "18px",
  padding: "8px",
  textAlign: "center"
};

const saveBtnStyle = {
  ...commonBtn,
  color: "#fff",
  backgroundColor: "#2d7df6"
};
