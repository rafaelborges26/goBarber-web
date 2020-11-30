import React, { useRef, useCallback } from 'react'
import { FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup' //para validação
import { useHistory, useLocation } from 'react-router-dom'

import logoImg from '../../assets/logo.svg'
import { Container, Content, AnimationContainer, Background } from './styles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import getValidationErrors from '../../utils/getValidationErrors'
import { useToast } from '../../hooks/ToastContext'
import api from '../../services/api'
import { cpuUsage } from 'process'

interface ResetPasswordFormData {
    password: string,
    password_confirmation: string,
}

const ResetPassword: React.FC = () => { 
    
    const formRef = useRef<FormHandles>(null) 

    const history = useHistory()

    const location = useLocation()

    const { addToast } = useToast()

    const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
        try{

            formRef.current?.setErrors({});

            
            const schema = Yup.object().shape({
                password: Yup.string().required('Senha obrigatória'), //minimo 6 caracteres
                password_confirmation: Yup.string().oneOf(
                [Yup.ref('password'), undefined], 
                'Confirmação incorreta' 
                )
            })

            await schema.validate(data, {
                abortEarly: false, //mostrar todos os erros
            })
            
            //reset password

            const { password, password_confirmation } = data

            const token = location.search.replace('?token=', '')

            if(!token) {
                throw new Error() 
            }

        await api.post('password/reset', {
            password,
            password_confirmation,
            token
        })

        

        history.push('/signin')

        } catch(err)  {
            if(err instanceof Yup.ValidationError) { //se o erro vier do validationError (email invalido, sem senha)

                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors);

                return;
            }

            addToast({ //se tiver problemas nas credenciais
                title: 'Erro ao resetar senha',
                type: 'error',
                description: 'Ocorreu um erro ao resetar sua senha, tente novamente.'
            })
    }
    },[addToast, history, location.search])


    return (
    <>
    <Container> 
        <Content>
         <AnimationContainer>
            <img src={logoImg} alt="GoBarber"/>

            <Form ref={formRef} onSubmit={handleSubmit}>
                <h1>Resetar senha</h1>

                
                <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />

                <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação da senha" />

                <Button type="submit">Alterar senha</Button>
            </Form>

            </AnimationContainer>
        </Content>

        <Background />
    </Container>
    </>
)

}

export default ResetPassword