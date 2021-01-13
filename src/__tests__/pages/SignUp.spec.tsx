import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import SignUp from '../../pages/SignUp'

const mockedHistoryPush = jest.fn()

const mockedAddToast = jest.fn()

const mockedSignUp = jest.fn()

const mockedSignUpError = jest.fn()

jest.mock('react-router-dom', () => {
    return {
        useHistory: () => ({
            push: mockedHistoryPush,
        }),
        Link: ({children}: {children: React.ReactNode }) => children,
    };
});


jest.mock('../../hooks/ToastContext', () => {
    return {
        useToast: () => ({
            addToast: mockedAddToast,
        })
    }
} )

jest.mock('../../services/api', () => {
    return {
        post: () => ({
            data: mockedSignUp,
        })
    }
} )

describe('SignUp Page', () => {
    beforeEach(() => {
        mockedHistoryPush.mockClear()
    })
  
it('should be able to sign up', async () => {


    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, {target: {value: 'John Due'} })
    fireEvent.change(emailField, { target: {value: 'johndue@example.com'} })
    fireEvent.change(passwordField, {target: {value: '123456'} })
    fireEvent.click(buttonElement)

    
    await waitFor(() => {
        expect(mockedHistoryPush).toHaveBeenCalledWith("/")
    })

    await waitFor(() => {
        expect(mockedAddToast).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'success'
            })
        )
    })

})

it('should not be able to sign up with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, {target: {value: 'John Due'} })
    fireEvent.change(emailField, { target: {value: 'not-valid-email'} })
    fireEvent.change(passwordField, {target: {value: '123456'} })
    fireEvent.click(buttonElement)

    await waitFor(() => {
        expect(mockedHistoryPush).not.toHaveBeenCalledWith()
    })
        
})

})