import {spacing, typography} from 'material-ui/styles'
import { SMALL } from 'material-ui/utils/withWidth'
export default (width) => ({
  appBar: {
    position: 'fixed',
    left: 0,
    top: 0
  },
  drawer: {
    cursor: 'pointer',
    fontSize: '24px',
    color: 'rgb(0, 188, 212)',
    lineHeight: '64px',
    fontWeight: 300,
    paddingLeft: '24px',
    marginBottom: '8px'
  },
  logo: {
    color: typography.textFullBlack
  },
  root: {
    paddingTop: width > SMALL ? spacing.desktopKeylineIncrement : spacing.desktopGutter,
    minHeight: 400
  },
  content: {
    margin: width > SMALL ? `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px` : spacing.desktopGutter,
    display: 'flex',
    flexWrap: 'wrap'
  },
  input: {
    width: 160,
    fontSize: 20
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.desktopGutterLess}px`
  },
  sideMenu: {
    minWidth: `${spacing.desktopGutterMore * 4}px`
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    cellHeight: spacing.desktopKeylineIncrement * width * 2
  },
  chip: {
    margin: 4
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
})
