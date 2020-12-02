import React ,{ createContext, useCallback, useState, useContext } from 'react'
import api from '../services/api'


interface User {
    id: string
    name: string
    avatar_url: string
}

interface SignInCredentials {
    email: string,
    password: string
}

interface AuthContextData {
    user: User
    signIn(credentials : SignInCredentials): Promise<void>
    signOut(): void 
}

interface AuthState {
    token: string
    user: User
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData ) //criar contexto quando as variaveis seram acessadas em diversos locais, ex: nome do usuario

export const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => { //quando o user sair e voltar pro site
        const token = localStorage.getItem('@GoBarber.token')
        const user = localStorage.getItem('@GoBarber.user')

        if(token && user) {
            api.defaults.headers.authorization = `Bearer ${token}` //automatizar o token nas rotas
            return {token, user: JSON.parse(user)}

        }
        
        return ({} as AuthState)
    })

   const signIn = useCallback(async ({email, password}) => { //metodo para login
    const response = await api.post('sessions', {
        email,
        password
    })

    const { token,user } = response.data //valores da api

    localStorage.setItem('@GoBarber.token', token)
    localStorage.setItem('@GoBarber.user', JSON.stringify(user)) //usar stringfy por ser um objeto

    api.defaults.headers.authorization = `Bearer ${token}`
        setData({token, user})
   }, [])

    const signOut = useCallback(() => { //metodo para logout
    localStorage.removeItem('@GoBarber.token')
    localStorage.removeItem('@GoBarber.user')

    setData({} as AuthState)
    },[])

    return (
        <AuthContext.Provider value={{user: data.user, signIn, signOut}} >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext) //passando a var de contexto aqui

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider') //disparar o erro se usar o Auth sem passar o auth provider em volta da tag
    }

    return context // se achar retorna
} 