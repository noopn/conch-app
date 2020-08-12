import React, { Component } from 'react';

class GreenNumber extends Component {
    render() {
        return (
            <div style={{}}>
                {this.props.str.split('').map(item => {
                    if (Number(item)) {
                        return <span style={{
                            display: 'inline-block',
                            width: '27px',
                            height: '40px',
                            fontSize: '36px',
                            textAlign: 'center',
                            lineHeight: '40px',
                            borderRadius: '3px',
                            color: '#ffffff',
                            // fontWeight: 'bold',
                            background: 'rgba(126, 175, 66, 1)',
                            marginRight: '12px'
                        }}>{item}</span>
                    } else {
                        return <span style={{
                            display: 'inline-block',
                            fontSize: '36px',
                            textAlign: 'center',
                            color: '#ffffff',
                            marginLeft: '-5px',
                            marginRight: '5px'
                        }}>{item}</span>
                    }
                })}
            </div>
        );
    }
}

export default CustomComp;
const wrapper = {
}
const numberStyle = {
    display: 'inline-block',
    width: '27px',
    height: '40px',
    fontSize: '36px',
    textAlign: 'center',
    lineHeight: '40px',
    borderRadius: '3px',
    color: '#ffffff',
    // fontWeight: 'bold',
    background: 'rgba(126, 175, 66, 1)',
    marginRight: '12px'
}

const dotStyle = {
    display: 'inline-block',
    fontSize: '36px',
    textAlign: 'center',
    color: '#ffffff',
    marginLeft: '-5px',
    marginRight: '5px'
}