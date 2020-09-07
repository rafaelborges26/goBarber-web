import React from 'react'
import { FiAlertCircle, FiXCircle } from 'react-icons/fi'

import Toast from './Toast'

import { ToastMessage } from '../../hooks/ToastContext' //interface
import { Container } from './styles'

interface ToastContainerProps {
    messages: ToastMessage[]
}

const ToastContainer: React.FC<ToastContainerProps> = ( {messages} ) => { 
    return (
        <Container>
        {messages.map(message => (
            <Toast key={message.id} toast={message} />
        ))}
        </Container>
    )
        }

export default ToastContainer