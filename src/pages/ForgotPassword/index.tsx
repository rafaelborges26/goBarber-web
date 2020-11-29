import React, { useRef, useCallback, useState } from 'react'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup' //para validação
import { Link } from 'react-router-dom'

import logoImg from '../../assets/logo.svg'
import { Container, Content, AnimationContainer, Background } from './styles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import getValidationErrors from '../../utils/getValidationErrors'
import { useToast } from '../../hooks/ToastContext'
import api from '../../services/api'

interface ForgotPasswordFormData {
    email: string,
}

const ForgotPassword: React.FC = () => { 
    
    const [loading, setLoading] = useState(false)

    const formRef = useRef<FormHandles>(null) 

    const { addToast } = useToast()

    const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
        try{
            setLoading(true)

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
            })

            await schema.validate(data, {
                abortEarly: false, //mostrar todos os erros
            })

            //recuperação de senha
        
            await api.post('/password/forgot', {
                email: data.email
            })

            addToast({
                type: "success",
                title: "Email de recuperação enviado",
                description: "Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada."
            })

        } catch(err)  {
            if(err instanceof Yup.ValidationError) { //se o erro vier do validationError (email invalido, sem senha)

                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors);

                return;
            }

            addToast({ //se tiver problemas nas credenciais
                title: 'Erro na recuperação de senha',
                type: 'error',
                description: 'Ocorreu um erro ao tentar recuperar a senha, tente novamente.'
            })
    } 
    finally {
        setLoading(false)
    }
    },[addToast])


    return (
    <>
    <Container> 
        <Content>
         <AnimationContainer>
            <img src={logoImg} alt="GoBarber"/>

            <Form ref={formRef} onSubmit={handleSubmit}>
                <h1>Recuperar senha</h1>

                <Input name="email" icon={FiMail} placeholder="E-mail"/>
                
                <Button loading={loading} type="submit">Recuperar</Button>
            </Form>

            <Link to="/signup">
                <FiLogIn />
                Voltar ao login
            </Link>
            </AnimationContainer>
        </Content>

        <Background />
    </Container>
    </>
)

}

export default ForgotPassword