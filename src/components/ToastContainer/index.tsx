import React from 'react'
import { useTransition } from 'react-spring'

import Toast from './Toast'
import { ToastMessage } from '../../hooks/ToastContext' //interface
import { Container } from './styles'

interface ToastContainerProps {
    messages: ToastMessage[]
}

const ToastContainer: React.FC<ToastContainerProps> = ( {messages} ) => { 

    const messagesWithTransictions = useTransition(
        messages, //objeto contendo todas
        messages => messages.id, //elemento unico
        { //efeito
            //posicao inicial começar do lado direito da tela
            from: {right: '-120%', transform: 'opacity: 0'},
            enter: {right: '0%', transform: 'opacity: 1' }, 
            leave: {right: '-120%', transform: 'opacity: 0'}
        }
    )

    return (
        <Container>
        {messagesWithTransictions.map(({item, key, props}) => (
            <Toast key={key} style={props} message={item} />
        ))}
        </Container>
    )
        }

export default ToastContainer