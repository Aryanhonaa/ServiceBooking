import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
//   <StrictMode>
  
// </StrictMode>,
<BrowserRouter>
<App />
<ToastContainer />
</BrowserRouter>,
)
