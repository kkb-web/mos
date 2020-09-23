import React,{ Component } from 'react'
import { Table } from 'antd'
import { connect } from 'react-redux'

class MosTable extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getFormList()
  }

  handleClick() {
    const {data} = this.props
    console.log(data)
  }


  render() {
    return (
      <div onClick={this.handleClick}>{this.props.default}</div>
    )
  }
}

const mapStateToProps = state => {
  console.log(state)
  return {
    data: state.formlist.data
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getFormList: dispatch.formlist.getFormList
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MosTable)
