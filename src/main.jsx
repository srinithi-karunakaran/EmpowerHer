import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './utils/LanguageContext';
import { AuthProvider } from './utils/AuthContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </AuthProvider>
    </StrictMode>,
)
