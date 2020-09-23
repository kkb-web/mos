import React, { Component } from 'react'
import {
  Modal
} from 'antd'


export default class BaseModal extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const {title} = this.props
    return (
      <Modal>
        titel={title}

      </Modal>
    )
  }
}
