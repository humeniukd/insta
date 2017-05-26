import React from 'react'
import { Link } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Chip from 'material-ui/Chip'
import {blue300, amber300, lightBlue600, lightGreen600} from 'material-ui/styles/colors';
import NavigationMoreHoriz from 'material-ui/svg-icons/navigation/more-vert'

const Cars = ({items, next, prev, onPagination, handleSearch, params, query, styles}) => {
  const handlePaginationClick = (type) => (event) => {
    event.preventDefault()
    onPagination(type)
  }
  const { make, model } = params
  const { price, mileage } = query
  const deleteChip = (type) => () => {
    handleSearch({[type]: ''})
  }
  return (
  <div style={styles.wrapper}>
    {make && <Chip style={styles.chip} onRequestDelete={deleteChip('make')} backgroundColor={lightBlue600}>{make}</Chip>}
    {model && <Chip style={styles.chip} onRequestDelete={deleteChip('model')} backgroundColor={blue300}>{model}</Chip>}
    {price && <Chip style={styles.chip} onRequestDelete={deleteChip('price')} backgroundColor={amber300}>{price} &euro;</Chip>}
    {mileage && <Chip style={styles.chip} onRequestDelete={deleteChip('mileage')} backgroundColor={lightGreen600}>{mileage} miles</Chip>}
    <div style={styles.grid}>
      <GridList cellHeight={styles.grid.cellHeight}>
        {items.map((item) => (
          <GridTile
            key={item.id}
            title={`${item.make} ${item.model}`}
            subtitle={<span>{item.mileage} miles  - <b>{item.price}&euro;</b></span>}
            actionIcon={<Link to={`/${item.id}`}><IconButton><NavigationMoreHoriz color="white" /></IconButton></Link>}
          >
            <img src={item.img} />
          </GridTile>
        ))}
      </GridList>
      <FlatButton disabled={!prev} label="Prev" onClick={handlePaginationClick('prev')}/>
      <FlatButton disabled={!next} label="Next" onClick={handlePaginationClick('next')}/>
    </div>
  </div>
  )
}

export default Cars
