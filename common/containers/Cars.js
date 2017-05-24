import React, { Component } from 'react'
import { format } from 'url'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { items } from '../actions'

import Cars from '../components/Cars'
import { parse } from 'querystring'

class CarsContainer extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
  }

  componentDidMount() {
    const { filter, fetchItemsIfNeeded} = this.props
    fetchItemsIfNeeded(filter)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filter !== this.props.filter) {
      const { filter } = nextProps
      this.props.fetchItemsIfNeeded(filter)
    }
  }

  handlePagination = (type) => {
    const next = this.props[type]
    next && this.props.history.push(next)
  }

  handleRefreshClick = e => {
    e.preventDefault()
    const { selectedFilter, invalidate, fetchItemsIfNeeded } = this.props
    invalidate(selectedFilter)
    fetchItemsIfNeeded(selectedFilter)
  }

  render() {
    const { styles } = this.props
    return (
      <div style={styles.content}>
        <Cars {...this.props} onPagination={this.handlePagination}/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { filters, items } = state
  const { location } = ownProps
  const filter = format(location)
  const {
    isFetching,
    lastUpdated,
    next,
    prev,
    ids
  } = filters[filter] || {
    isFetching: true,
    ids: []
  }
  return {
    ...ownProps,
    filter,
    items: ids.map(id => items[id]),
    next,
    prev,
    isFetching,
    lastUpdated
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(items, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CarsContainer)
