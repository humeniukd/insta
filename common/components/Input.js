import React from 'react'
import TextField from 'material-ui/TextField'
import debounce from 'lodash/debounce'

export default class Input extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value || ''
    }

    this.isDebouncing = false
  }

  componentWillMount() {
    this.createNotifier(500)
  }

  componentWillReceiveProps({value}) {
    if (this.isDebouncing) {
      return
    }
    if (typeof value !== 'undefined' && this.state.value !== value) {
      this.setState({value})
    }
  }

  createNotifier = debounceTimeout => {
    const debouncedChangeFunc = debounce(event => {
      this.isDebouncing = false
      this.doNotify(event)
    }, debounceTimeout)

    this.notify = event => {
      this.isDebouncing = true
      debouncedChangeFunc(event)
    }
  }

  doNotify = (...args) => {
    const {onChange} = this.props;
    onChange(...args);
  };

  onChange = event => {
    event.persist()
    this.setState({value: event.target.value}, () => {
        this.notify(event)
    })
  }

  render () {
    return <TextField {...this.props} value={this.state.value} onChange={this.onChange}/>
  }
}
