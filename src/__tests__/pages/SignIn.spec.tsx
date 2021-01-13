import React from 'react' 
import { render, fireEvent, waitFor} from '@testing-library/react'
import SignIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn() //saber se a função foi disparada pra enviar o usuário pra rota dashboard apos o login
//quando precisar chamar um a api em algum teste, sempre usr o mock para n chamar a api de verdade

const mockedSignIn = jest.fn()

const mockedAddToast = jest.fn()


jest.mock('react-router-dom', () => {
    return { 
        useHistory: () => ({
        push: mockedHistoryPush,
        }),//testar mudança de page
        Link: ({children}: { children: React.ReactNode }) => children, //definindo q o Link tem algum valor dentro q normalmente é string mas com essa tipagem pode ser qqr coisa
    };
});

jest.mock('../../hooks/AuthContext', () => {
    return {
        useAuth: () => ({
            signIn: mockedSignIn
        })
    }
} )

jest.mock('../../hooks/ToastContext', () => {
    return {
        useToast: () => ({
            addToast: mockedAddToast,
        })
    }
} )


describe('SignIn Page', () => {
    beforeEach(() => {
        mockedHistoryPush.mockClear()
    })
    it('should be able to sign in', async () => {
        const { getByPlaceholderText, getByText } = render(<SignIn/>)

        const emailField = getByPlaceholderText('E-mail')
        const passwordField = getByPlaceholderText('Senha')
        const buttonElement = getByText('Entrar')

        
        //simulabdo um evento de um user:
        fireEvent.change(emailField, { target: {value: 'johndoe@example.com'} }) //target pega o evento e executa o teste
        fireEvent.change(passwordField, { target: { value: '123456' } })
        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard') //testando se apos o click redireciona pra tela de dashboard
        })
        
    }) 

    it('should not be able to sign in with invalid credentials', async () => {
        const { getByPlaceholderText, getByText } = render(<SignIn/>)

        const emailField = getByPlaceholderText('E-mail')
        const passwordField = getByPlaceholderText('Senha')
        const buttonElement = getByText('Entrar')

        
        //simulabdo um evento de um user:
        fireEvent.change(emailField, { target: {value: 'not-valid-email'} }) //target pega o evento e executa o teste
        fireEvent.change(passwordField, { target: { value: '123456' } })
        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedHistoryPush).not.toHaveBeenCalledWith() //testando se apos o click redireciona pra tela de dashboard
        })
        
    })

    it('should display an error if login fails', async () => {

        mockedSignIn.mockImplementation(() => {
            throw new Error()
        }) //substituir por essa funcao 

        const { getByPlaceholderText, getByText } = render(<SignIn/>)

        const emailField = getByPlaceholderText('E-mail')
        const passwordField = getByPlaceholderText('Senha')
        const buttonElement = getByText('Entrar')

        
        //simulabdo um evento de um user:
        fireEvent.change(emailField, { target: {value: 'johndoe@example.com'} }) //target pega o evento e executa o teste
        fireEvent.change(passwordField, { target: { value: '123456' } })
        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'error' //sido chamada com um objeto q contem uma prop type com o valor error                   
                })
            ) //testando se apos o click redireciona pra tela de dashboard
        })
        
    })
})
