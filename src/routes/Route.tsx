import React from 'react'
import { RouteProps as ReactDOMRouteProps, Route as ReactDOMRoute, Redirect } from 'react-router-dom'

import { useAuth } from '../hooks/AuthContext' //obter variavel global de autenticacao


interface RouteProps extends ReactDOMRouteProps { //sera um component Route, por isso pear todas as props de Route
    isPrivate?: boolean  //variavel de rota que precisa ser autenticado ou n
    component: React.ComponentType 
}//obtendo as propriedades

//rota privada | usuario autenticado
//true/true = ok
//true/false = redirecionar para login
//false/true = redirecionar para dashboard
//false/false = ok

const Route: React.FC<RouteProps> = ({ 
    isPrivate = false,
    component: Component, //obtendo o componente Dashboard
    ...rest  
}) => {

    const { user } = useAuth() //se exitir a variavel significa q o user esta autenticado/logado

    return (
        <ReactDOMRoute 
            {...rest}
            render={({ location }) => {
                
                return isPrivate === !!user ? (
                    <Component />
                ) : (
                    <Redirect to={{
                        pathname: isPrivate ? '/' : '/dashboard',
                        state: {from: location} //pegar o historico do site
                        }}
                    />
                )
            }}
        
         />
    )
}

export default Route