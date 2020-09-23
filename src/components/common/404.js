import React, { Component } from 'react';
import img404 from '../../style/img/notFount.png';
import Exception from 'ant-design-pro/lib/Exception';

// 404页面
export default class NoMatch extends Component{
    render(){
        return(
            <div style={{textAlign: 'center', marginTop: '100px'}}>
                {/*<img src={img404} alt="404 Not Found" style={{marginTop: '100px', width: '60%'}}/>*/}
                <Exception type="404" />
            </div>
        )
    }
}
