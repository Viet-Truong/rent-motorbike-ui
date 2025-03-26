import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FC, Fragment } from 'react';
import { publicRoutes } from './routes';
import DefaultLayout from './layouts/Default';

import './index.css';
import './App.css';
import ScrollToTop from './components/scrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className='App'>
        <Routes>
          {publicRoutes.map((route, key) => {
            let Layout: FC<{ children: React.ReactNode | JSX.Element }> = DefaultLayout;
            if (route?.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            const Page = route.component;
            return (
              <Route
                key={key}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              ></Route>
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
