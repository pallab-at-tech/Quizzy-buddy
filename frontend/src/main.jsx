import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.jsx'
import { Toaster } from 'react-hot-toast'
import GlobalProvider from './provider/GlobalProvider.jsx'
import { Provider } from 'react-redux'
import { store } from './store/configStore.js'

createRoot(document.getElementById('root')).render(

  <>
    <Provider store={store}>

      <GlobalProvider>
        <RouterProvider router={router} />
        <Toaster />
      </GlobalProvider>

    </Provider>
  </>


)
