import React, { Component } from 'react';

class CustomComp extends Component {
    state = {
        propValue: ""
    }
    componentDidMount() {
        setInterval(() => {
            scriptUtil.excuteScriptService({
                objName: "platform",
                serviceName: "getPropertyValue",
                params: {
                    propName: 'tabName'
                },
                cb: (res) => {
                    if (res.result === 'broadcast') {
                        scriptUtil.excuteScriptService({
                            objName: "platform",
                            serviceName: "setPropertyValue",
                            params: {
                                propName: "tabName",
                                propValue: ''
                            },
                            cb: () => {
                                if (window.speechSynthesis.speaking) {
                                    window.speechSynthesis.cancel();
                                    return false;
                                }
                                scriptUtil.excuteScriptService({
                                    objName: "OthersBrowser",
                                    serviceName: "SayWhat",
                                    params: {
                                        type: 'produce'
                                    },
                                    cb: (res) => {
                                        const msg = new SpeechSynthesisUtterance(res.result);
                                        window.speechSynthesis.speak(msg);
                                    }
                                });
                            }
                        })
                    }

                }
            });
        }, 1000);
    }
    render() {
        return null;
    }
}
export default CustomComp;