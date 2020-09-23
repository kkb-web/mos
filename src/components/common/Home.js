import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {getToken, IsPC} from "../../utils/filter";

export default class Home extends Component{
    render(){
        // alert(navigator.userAgent.indexOf('DingTalk'));
        return(
            IsPC() ?
                (getToken("access_token") === null ? <Redirect to="/login"/> : <Redirect to="/app/dashboard/analysis"/>) :
                (navigator.userAgent.indexOf('DingTalk') !== -1 ? <Redirect to="/dingtalk"/> : <Redirect to="/login"/>)
        )
    }
}
