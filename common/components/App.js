import React  from 'react'
import { Route, Switch } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar'
import withWidth from 'material-ui/utils/withWidth'
import Drawer from 'material-ui/Drawer'
import getStyles from '../../client/css'
import { Cars, Car } from '../containers'
import Search from './Search'
import { IDREGEX }  from '../../server/router/routes'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false }
  }

  handleToggle = () => this.setState({isOpen: !this.state.isOpen})

  render() {
    const { width } = this.props
    const styles = getStyles(width)
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({ userAgent: navigator.userAgent })}>
        <div>
          <AppBar style={styles.appBar} onLeftIconButtonTouchTap={this.handleToggle} title="Cars App" />
          <div style={styles.root}>
            <Drawer open={this.state.isOpen} containerStyle={styles.drawer} docked={false} onRequestChange={(isOpen) => this.setState({isOpen})}>
              <h1 style={styles.drawer}>Select</h1>
              <Search styles={styles} {...this.props}/>
            </Drawer>
            <Switch>
              <Route path={`/:id(${IDREGEX})`} render={(ownProps) => <Car styles={styles} {...this.props} {...ownProps}/>}/>
              <Route path="/:make?/:model?" render={(ownProps) => <Cars styles={styles} {...this.props} {...ownProps}/>}/>
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withWidth()(App)
