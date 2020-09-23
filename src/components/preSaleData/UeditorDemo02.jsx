import React, { Component } from 'react'
// import 'braft-editor/dist/index.css'
// import BraftEditor from 'braft-editor'

class UEditor02 extends Component {
    state = {
        // editorState: BraftEditor.createEditorState(null)
    };
    componentDidMount () {

    }

    componentWillUnmount () {

    }
    handleChange = (editorState) => {
        // this.setState({ editorState })
        // console.log(this.state.editorState.toHTML())
    };



    render () {
        const controls = [
            'undo', 'redo', 'separator',
            'font-size','font-family', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'media', 'separator',
            'clear'
        ];
        return (
            <div style={{border:'1px soild #000'}}>
                {/*<BraftEditor controls={controls} value={this.state.editorState} onChange={this.handleChange}/>*/}
                {/*<p>{this.state.editorState}</p>*/}
            </div>
        )
    }

}

export default UEditor02