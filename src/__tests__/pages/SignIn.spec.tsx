import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SignIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn() //saber se a função foi disparada pra enviar o usuário pra rota dashboard apos o login

jest.mock('react-router-dom', () => {
    return { 
        useHistory: () => ({
        push: mockedHistoryPush,
        }),//testar mudança de page
        Link: ({children}: { children: React.ReactNode }) => children, //definindo q o Link tem algum valor dentro q normalmente é string mas com essa tipagem pode ser qqr coisa
    };
});

describe('SignIn Page', () => {
    it('should be able to sign in', () => {
        const { getByPlaceholderText, getByText } = render(<SignIn/>)

        const emailField = getByPlaceholderText('E-mail')
        const passwordField = getByPlaceholderText('Senha')
        const buttonElement = getByText('Entrar')

        
        //simulabdo um evento de um user:
        fireEvent.change(emailField, { target: {value: 'johndoe@example.com'} }) //target pega o evento e executa o teste
        fireEvent.change(passwordField, { target: { value: '123456' } })
        fireEvent.click(buttonElement)

        expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard') //testando se apos o click redireciona pra tela de dashboard

    })
})
