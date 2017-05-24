import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';

export default ({item, onReserve, history}) => (
  <Card>
    <CardHeader
      title={item.make}
      subtitle={item.model}
    />
    <CardMedia
      overlay={<CardTitle title={`${item.price}$`} subtitle={`${item.mileage}km`} />}
    >
      <img src={item.img} />
    </CardMedia>
    <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
    <CardActions>
      <FlatButton label="Back" onClick={() => history.goBack()} />
      <RaisedButton label="Reserve" onClick={onReserve} />
    </CardActions>
  </Card>
)
