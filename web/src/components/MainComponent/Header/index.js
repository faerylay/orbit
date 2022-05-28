import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconMenu2, IconUser } from '@tabler/icons';

import { LogoSection } from '../../MainComponent';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import ChatSection from './ChatSection';
import NotificationSection from './NotificationSection';
import { isLoggedIn } from '../../../auth'

const Header = ({ handleLeftDrawerToggle, auth }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navBtn = {
    borderRadius: '12px',
    ...theme.typography.commonAvatar,
    width: '90px',
    height: '34px',
    transition: 'all .2s ease-in-out',
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    '&[aria-controls="menu-list-grow"],&:hover': {
      background: theme.palette.secondary.dark,
      color: theme.palette.secondary.light
    }
  }

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        {
          !location.pathname.includes('/chat') ? (
            <ButtonBase sx={{
              borderRadius: '12px',
              overflow: 'hidden',
            }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  transition: 'all .2s ease-in-out',
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                  '&:hover': {
                    background: theme.palette.secondary.dark,
                    color: theme.palette.secondary.light
                  },
                  [theme.breakpoints.up('md')]: {
                    display: 'none'
                  }
                }}
                onClick={handleLeftDrawerToggle}
                color="inherit"
              >
                <IconMenu2 stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          ) : (
            <ButtonBase sx={{
              borderRadius: '12px',
              overflow: 'hidden',
            }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  transition: 'all .2s ease-in-out',
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                  '&:hover': {
                    background: theme.palette.secondary.dark,
                    color: theme.palette.secondary.light
                  },
                  [theme.breakpoints.up('md')]: {
                    display: 'none'
                  }
                }}
                onClick={() => navigate(`/profile/${auth?.id}`)}
                color="inherit"
              >
                <IconUser stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          )
        }
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      <Box>
        {
          Boolean(isLoggedIn()) ? (
            <ButtonBase
              sx={navBtn}
              variant="rounded"
              color="inherit" component={Link} to='/create-post'>
              <Typography sx={{ fontSize: '0.8rem' }}>Create Post</Typography>
            </ButtonBase>
          ) : (
            <ButtonBase
              sx={navBtn}
              variant="rounded"
              color="inherit" component={Link} to='/login'>
              <Typography sx={{ fontSize: '0.8rem' }}>Login</Typography>
            </ButtonBase>
          )
        }
      </Box>
      <NotificationSection auth={auth} />
      <ChatSection auth={auth} />
      <ProfileSection />
    </>
  );
};


export default Header;
