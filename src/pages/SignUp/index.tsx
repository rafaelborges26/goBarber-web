import React, {useCallback, useRef} from 'react'
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import { useToast } from '../../hooks/ToastContext' 

import logoImg from '../../assets/logo.svg'
import { Container, Content, AnimationContainer, Background } from './styles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'


interface signUpFormData {
    name: string,
    email: string,
    password: string,
}

const SignOut: React.FC = () => {
    
    const formRef = useRef<FormHandles>(null) 

    const { addToast } = useToast() //usando var global

    const history = useHistory()

    const handleSubmit = useCallback(async (data: signUpFormData) => {
        try{

            formRef.current?.setErrors({});


            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'), //informar que é string obrigatório
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 digitos') //minimo 6 caracteres
            })

            await schema.validate(data, {
                abortEarly: false, //mostrar todos os erros
            })

        api.post('/users', data)

        history.push('/')

        addToast({
            type: 'success',
            title: 'Cadastro realizado!',
            description: 'Você já pode fazer seu logon no GoBarber!'
        })

        } catch(err)  {

            if(err instanceof Yup.ValidationError) {

            const errors = getValidationErrors(err)

            formRef.current?.setErrors(errors);

            return
            }

            addToast({
                type: 'error',
                title: 'Erro no cadastro',
                description: 'Ocorreu um erro ao fazer cadastro, tente novamente.'
            })

        }
    },[addToast, history])
    

return (
         <>
    <Container>
    
    <Background />
    
        <Content>
         <AnimationContainer>
            <img src={logoImg} alt="GoBarber"/>
    
            <Form ref={formRef} onSubmit={handleSubmit}>
                <h1>Faça seu cadastro</h1>
    
                <Input name="name"  icon={FiUser} placeholder="Nome"/>
                <Input name="email" icon={FiMail} placeholder="E-mail"/>
                
                <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
    
                <Button type="submit">Cadastrar</Button>
                
            </Form>
    
            <Link to="/">
                <FiArrowLeft />
                Voltar login
            </Link>
         </AnimationContainer>
        </Content>
    
    </Container>
    </>
    )

}

export default SignOut