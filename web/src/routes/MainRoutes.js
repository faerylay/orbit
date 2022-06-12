import React, { lazy } from 'react';
import { MainComponent, Loadable } from '../components/MainComponent';
import NotFound from '../pages/NotFound';
import { isLoggedIn } from '../auth';

const AuthLogin = Loadable(lazy(() => import('../pages/Authentication/Login')));
const Home = Loadable(lazy(() => import('../pages/Home')));
const ChatPage = Loadable(lazy(() => import('../pages/ChatPage')));
const Profile = Loadable(lazy(() => import('../pages/ProfilePage')));
const PostCreate = Loadable(lazy(() => import('../pages/posts/PostCreate')));
const PostUpdate = Loadable(lazy(() => import('../pages/posts/PostUpdate')));
const PostSingle = Loadable(lazy(() => import('../pages/posts/PostSingle')));


const MainRoutes = {
  path: '/',
  element: isLoggedIn() ? <MainComponent /> : <AuthLogin />,
  children: [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/profile/:userId',
      element: <Profile />,
    },
    {
      path: '/chat/',
      element: <ChatPage />
    },
    {
      path: '/chat/:userId',
      element: <ChatPage />
    },
    {
      path: '/create-post',
      element: <PostCreate />,
    },
    {
      path: '/update-post/:postId',
      element: <PostUpdate />,
    },
    {
      path: '/single-post/:postId',
      element: <PostSingle />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default MainRoutes;
