import React from 'react'
import TextField from 'material-ui/TextField'
import { List, ListItem } from 'material-ui/List'
import { makes, models } from '../index'
import debounce from 'lodash/debounce'

export default ({params, handleSearch, query, styles}) => {
  const { make } = params
  const { price = '', mileage = '' } = query

  const handleClick = params => () => {
    handleSearch(params)
  }

  const getItems = (make) => models[make].map(model =>
    <ListItem key={model} onClick={handleClick({model})}>{model}</ListItem>
  )

  const inputHandler = e => {
    const { name, value } = e.target
    handleSearch({[name]: value})
  }

  return (
      <div>
      <List style={styles.sideMenu}>
        { makes.map(item =>
          <ListItem key={item} nestedItems={getItems(item)} onClick={handleClick({make: item})} open={item === make}>
            {item}
          </ListItem>
        )}
      </List>
      <div style={styles.flex}>
      <TextField
        type="number" hintText="$" name="price"
        value={price} onChange={inputHandler}
      />
      <TextField
        type="number" hintText="km" name="mileage"
        value={mileage} onChange={inputHandler}
      />
      </div>
      </div>
  )
}
