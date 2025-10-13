import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router/Router.tsx'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
        <Router />
     </BrowserRouter>
  </StrictMode>,
)
