import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  MainPage,
  Feed,
  WriteFeed,
  TempList,
  SearchPage,
  MyPage,
  ModifyInfoPage,
  Quit,
  ModifyPw,
  FindPw,
  LikeList,
  Join,
  Login,
  RootLayout,
  ErrorPage,
  feedLoader,
} from 'pages';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'util/feed-http';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: '/writefeed', element: <WriteFeed /> },
      { path: '/temp/list', element: <TempList /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/quit', element: <Quit /> },
      { path: '/channel/:id', element: <MyPage /> },
      { path: '/changepw', element: <ModifyPw /> },
      { path: '/changeinfo', element: <ModifyInfoPage /> },
      { path: '/likes', element: <LikeList /> },
      { path: '/feed/:id', element: <Feed />, loader: feedLoader },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/join', element: <Join /> },
  { path: '/findpw', element: <FindPw /> },
]);

const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default Router;
