import React from 'react'
import { Drawer } from '@mui/material';
import ChatContent from '../ChatContent';


const ConversationDrawer = ({ drawerOpen }) => (
  <Drawer
    anchor="right"
    open={drawerOpen}
    color="inherit"
    variant="persistent"
    sx={{
      width: '100%',
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: '100%',
        boxSizing: 'border-box',
      },
    }}
  >
    <ChatContent />
  </Drawer>
);

export default ConversationDrawer;
