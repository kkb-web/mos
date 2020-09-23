import {Component} from "react";
import React from "react";
import {setTitle} from "../../utils/filter";

export default class NoAuthor extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        setTitle('');
    }

    render () {
        return(
            <div style={{width: '100%', minHeight: '100%', background: '#fff'}}>
                {/*<div style={{fontSize: '14px', color: '#333', fontWeight: '600', width: '80%', margin: '300px auto'}}>
                    <p style={{marginBottom: 0}}>Sorry~</p>
                    <p style={{marginBottom: 0}}>你还不是开课吧CRM系统的使用者，</p>
                    <p style={{marginBottom: 0}}>暂时还没有权限查看哦。</p>
                </div>*/}
                <img style={{width: '100%', lineHeight: '100%'}} src="https://img.kaikeba.com/no_auther.png" alt=""/>
            </div>
        )
    }
}
