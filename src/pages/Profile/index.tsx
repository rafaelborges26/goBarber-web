import React, {useCallback, useRef, ChangeEvent} from 'react'
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import { useToast } from '../../hooks/ToastContext' 

import { Container, Content, AvatarInput } from './styles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'
import { useAuth } from '../../hooks/AuthContext'


interface ProfileFormData {
    name: string
    email: string
    old_password: string
    password: string
    password_confirmation: string
}

const Profile: React.FC = () => {
    
    const formRef = useRef<FormHandles>(null) 

    const { addToast } = useToast() //usando var global

    const { user, updateUser } = useAuth()

    const history = useHistory()

    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const data = new FormData()
            data.append('avatar', e.target.files[0]) //utilizando o multiplataform

            api.patch('/users/avatar', data).then((response) => {
                updateUser(response.data) //atualizando o avatar na web
                addToast({
                    type: 'success',
                    title: 'Avatar atualizado'
                })
            })
        }
    }, [addToast, updateUser])

    const handleSubmit = useCallback(async (data: ProfileFormData) => {
        try{

            formRef.current?.setErrors({});


            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'), //informar que é string obrigatório
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                old_password: Yup.string(),
                password: Yup.string().when('old_password', //se o campo tiver preenchido esse campo deve ser obrigatorio 
                {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatório'),
                    otherwise: Yup.string()   
                }), //condicional
                password_confirmation: Yup.string().when('old_password', //se o campo tiver preenchido esse campo deve ser obrigatorio 
                {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatório'),
                    otherwise: Yup.string()   
                }) //condicional
                .oneOf(
                    [Yup.ref('password'), undefined], 
                    'Confirmação incorreta' 
                )
            })

            await schema.validate(data, {
                abortEarly: false, //mostrar todos os erros
            })

            const formData = Object.assign({
                name: data.name,
                email: data.email,
            }, data.old_password ? {
                old_passowd: data.old_password,
                password: data.password,
                password_confirmation: data.password_confirmation
            } : {}) //se tiver a old_password preenchida, envia os campos de password pro backend, se n tiver n envia  

       const response = await api.put('/profile', formData)

       updateUser(response.data)

        history.push('/dashboard')
        
        addToast({
            type: 'success',
            title: 'Perfil atualizado!',
            description: 'Suas informações do perfil foram atualizadas com sucesso!'
        })

        } catch(err)  {

            if(err instanceof Yup.ValidationError) {

            const errors = getValidationErrors(err)

            formRef.current?.setErrors(errors);

            return
            }

            addToast({
                type: 'error',
                title: 'Erro na atualização',
                description: 'Ocorreu um erro ao atualizar perfil, tente novamente.'
            })

        }
    },[addToast, history, updateUser])
    

return (
         <>
    <Container>
        <header>
            <div>
            <Link to="/dashboard">
                <FiArrowLeft />
            </Link>    
            </div>
        </header>    
    
        <Content>    
            <Form ref={formRef} initialData={{
                name: user.name,
                email: user.email
            }} onSubmit={handleSubmit}>

            <AvatarInput>
                <img src={user.avatar_url} alt={user.name}/>
                <label htmlFor="avatar">
                    <FiCamera />
                    <input type="file" id="avatar" onChange={handleAvatarChange}/>
                </label>
                
            </AvatarInput>

                <h1>Meu perfil</h1>

                <Input name="name"  icon={FiUser} placeholder="Nome"/>
                <Input name="email" icon={FiMail} placeholder="E-mail"/>
                            
                <Input containerStyle={{ marginTop: 24 }} name="old_password" icon={FiLock} type="password" placeholder="Senha atual" />
                <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
                <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar senha" />

    
                <Button type="submit">Confirmar mudanças</Button>
                
            </Form>
    
        </Content>
    
    </Container>
    </>
    )

}

export default Profile