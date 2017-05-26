import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { item } from '../actions'
import Dialog from 'material-ui/Dialog'
import Car from '../components/Car'
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

class CarContainer extends Component {
  state = {
    popup: false,
    snack: false
  }
  handleOpen = () => {
    this.setState({ snack: false, popup: true });
  }
  handleClose = () => {
    this.setState({ snack: false, popup: false });
  }
  static propTypes = {
    item: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { item, fetchItemIfNeeded} = this.props
    fetchItemIfNeeded(item.id)
  }

  handleReserveClick = e => {
    const { item, reserveItem } = this.props
    reserveItem(item.id)
    this.setState({ snack: true, popup: false });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Reserve"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleReserveClick}
      />,
    ];
    return (
      <div>
        <Car {...this.props} onReserve={this.handleOpen}/>
        <Dialog
          title="Confirmation"
          actions={actions}
          modal={false}
          open={this.state.popup}
          onRequestClose={this.handleClose}
        >
          Are you sure?
        </Dialog>
        <Snackbar
          open={this.state.snack}
          message="Car was reserved"
          autoHideDuration={5000}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { items } = state
  const { match } = ownProps
  const id = match.params.id
  const item = items[id]
  return {
    ...ownProps,
    item
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(item, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CarContainer)
