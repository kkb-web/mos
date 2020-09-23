import React, {Component} from 'react';
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import { Row, Col } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import './github-markdown.css';

export default class RichText extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            html:"<div><h1>Live demo</h1>\n" +
            "<p><strong><span style=\"font-size: 14pt;\">Get start</span></strong>.</p>\n" +
            "<ul>\n" +
            "<li>npm install</li>\n" +
            "<li>npm run start</li>\n" +
            "</ul>\n" +
            "<h2>HTML block below</h2>\n" +
            "<div>\n" +
            "<blockquote>This blockquote will change based on the HTML settings above.</blockquote>\n" +
            "</div>\n" +
            "<h2>How about some code?</h2>\n" +
            "<pre>import React from 'react';<br>import ReactDOM from 'react-dom';<br>import MRoute from './routes/index';<br><br>ReactDOM.render(<br>  &lt;MRoute /&gt;,<br>  document.getElementById('root')<br>);</pre>\n" +
            "<h2>Tables?</h2>\n" +
            "<table>\n" +
            "<thead>\n" +
            "<tr>\n" +
            "<th>Feature</th>\n" +
            "<th>Support</th>\n" +
            "</tr>\n" +
            "</thead>\n" +
            "<tbody>\n" +
            "<tr>\n" +
            "<td>tables</td>\n" +
            "<td>✔</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>alignment</td>\n" +
            "<td>✔</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>wewt</td>\n" +
            "<td>✔</td>\n" +
            "</tr>\n" +
            "</tbody>\n" +
            "</table>\n" +
            "<h2>More info?</h2>\n" +
            "<p>Read usage information and more.</a></p></div>"
        }
    }

    handleEditorChange=(html)=>{
        console.log(html);
        this.setState({html});
    };

    render() {
        const { html } = this.state;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '',
                name: '富文本'
            }
        ];
        return (
            <div>
                <BreadcrumbCustom paths={menus}/>
                <Row gutter={16}>
                    <Col md={12} style={{marginBottom:20}}>
                        <Editor
                            apiKey="vllql17719yol7wzs2jfv3c15hchg5efq6z3vp7rufn6jgqh"
                            initialValue={html}
                            init={{
                                branding: false, //This option allows you to disable the "Powered by TinyMCE" branding.
                                menubar: 'edit insert format table tools',
                                height: 300,
                                body_class: "markdown-body",
                                plugins: 'image imagetools advlist code media link colorpicker paste table textcolor',
                                toolbar: 'undo redo | fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | bullist numlist | link image',
                                selector: 'textarea',
                                // paste_data_images: true,
                                // images_upload_handler: this.handleImagesUpload,
                            }}
                            onEditorChange={this.handleEditorChange}
                        />
                    </Col>
                    <Col md={12}>
                        <div dangerouslySetInnerHTML={{__html: html}} className="markdown-body"
                             style={{minHeight:400,padding:10,boxShadow:"0 1px 6px #ccc",background:"#fff"}}/>
                    </Col>
                </Row>
            </div>
        );
    }

}
