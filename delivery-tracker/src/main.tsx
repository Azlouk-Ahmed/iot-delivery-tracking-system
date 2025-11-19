import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router/Router.tsx'
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext.tsx';
import { SocketProvider } from './context/SoketContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <AuthContextProvider>
     <SocketProvider>
      <BrowserRouter>
          <Router />
      </BrowserRouter>
     </SocketProvider>
   </AuthContextProvider>
  </StrictMode>,
)
