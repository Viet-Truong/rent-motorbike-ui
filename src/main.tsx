import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import GlobalStyles from '@/components/globalStyles.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <GlobalStyles>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#24c7c8',
          },
        }}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </ConfigProvider>
    </GlobalStyles>
  // </React.StrictMode>
);
