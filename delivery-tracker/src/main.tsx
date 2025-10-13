import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router/Router.tsx'
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <AuthContextProvider>
     <BrowserRouter>
        <Router />
     </BrowserRouter>
   </AuthContextProvider>
  </StrictMode>,
)
