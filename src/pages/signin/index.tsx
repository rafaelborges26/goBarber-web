import React, { useRef, useCallback } from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup' //para validação

import logoImg from '../../assets/logo.svg'
import { Container, Content, Background } from './styles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/AuthContext'
import { useToast } from '../../hooks/ToastContext'

interface SignInFormData {
    email: string,
    password: string
}

const SignIn: React.FC = () => { 
    
    const formRef = useRef<FormHandles>(null) 

    const {signIn} = useAuth() //obtendo as variaveis globais
    const { addToast } = useToast()

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try{

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('Senha obrigatória') //minimo 6 caracteres
            })

            await schema.validate(data, {
                abortEarly: false, //mostrar todos os erros
            })
            await signIn({
                email: data.email,
                password: data.password
            }) //funcao global
        } catch(err)  {
            if(err instanceof Yup.ValidationError) {

                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors);
            }

            addToast({
                title: 'Erro na autenticação',
                type: 'error',
                description: 'Ocorreu um erro ao fazer login, cheque as credenciais.'
            })
    }
    },[signIn, addToast])


    return (
    <>
    <Container> 
        <Content>
            <img src={logoImg} alt="GoBarber"/>

            <Form ref={formRef} onSubmit={handleSubmit}>
                <h1>Faça seu logon</h1>

                <Input name="email" icon={FiMail} placeholder="E-mail"/>
                
                <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

                <Button type="submit">Entrar</Button>
                <a href="forgot">Esqueci minha senha</a>
            </Form>

        <a href="create">
            <FiLogIn />
            Criar conta
        </a>

        </Content>

        <Background />
    </Container>
    </>
)

}

export default SignIn