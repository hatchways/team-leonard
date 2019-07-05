import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { withStyles } from "@material-ui/styles";

import FriendModal from './FriendModal';
import styles from '../../../../styles/Home/Sidebar/ContactsStyles';

const Friends = props => {
  const entries = (selected, select) => props.friends.map(curr => (
    <Grid
      item
      container
      spacing={3}
      alignItems='center'
      className={
        selected === curr.username 
        ? props.classes.friend + ' ' + props.classes.selected 
        : props.classes.friend
      }
      key={curr.username}
      onClick={() => {select(curr.username)}}
    >
      <Grid item>
        <Avatar 
          alt='avatar' 
          style={{height: '3rem', width: '3rem'}}
        >
          <Icon className='fas fa-user' style={{textAlign: "center", fontSize: '2rem'}}/>
        </Avatar>
      </Grid>
      <Grid item>
        <Typography variant='h5'>{curr.username}</Typography>
      </Grid>
    </Grid>
  ));

  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = React.useState('');

  const openModal = () => {
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  }

  const select = username => {
    setSelected(username);
  }

  return (
    <Grid 
      item 
      container
      direction='column'
    >
      <Modal 
        open={open} 
        onClose={closeModal} 
        className={props.classes.friendModal}
      >
        <FriendModal />
      </Modal>
      <Grid item className={props.classes.addFriend}>
        <Button color='primary' onClick={openModal} disableRipple>
          <Icon className='fas fa-plus' style={{marginRight: '0.5rem', fontSize: '1rem'}}/>
          <Typography variant='body1'>Add friend</Typography>
        </Button>
      </Grid>
      {entries(selected, select)}
    </Grid>
  );
}

export default withStyles(styles)(Friends);