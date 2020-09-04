import { AuthProvider } from './AuthContext' //importar aq oara depois importar para o app para ficar mais facil
import { ToastProvider } from './ToastContext'
import React from 'react'

const AppProvider: React.FC = (({children}) => { //Providers global, colocamos todos os providers aq para depois setar no App
    return (
        <AuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </AuthProvider>
        
    )
})

export default AppProvider