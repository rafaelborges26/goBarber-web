import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import ResetPassword from '../../pages/ResetPassword'
import MockAdapter from 'axios-mock-adapter'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()

const mockedAddToast = jest.fn()

const mockedSearch = 'teste.com'


const mockedSearchInvalid = jest.fn()
const mockteste = mockedSearchInvalid.mockReturnValue('teste')
const apiMock = new MockAdapter(api)

jest.mock('react-router-dom', () => {
    return { 
        useHistory: () => ({
            push: mockedHistoryPush,
        }),//testar mudança de page
        useLocation: () => ({
            search: mockedSearch
        }),//testar mudança de page
        Link: ({children}: { children: React.ReactNode }) => children, //definindo q o Link tem algum valor dentro q normalmente é string mas com essa tipagem pode ser qqr coisa
    };
});


jest.mock('../../hooks/ToastContext', () => {
    return {
        useToast: () => ({
            addToast: mockedAddToast,
        })
    }
} )




describe('ResetPassword Page', () => {
    
    it('should be able to reset password', async () => {
        apiMock.onPost('password/reset').reply(200, {})

        const { getByPlaceholderText, getByText } = render(<ResetPassword />) 

        const newPasswordField = getByPlaceholderText('Nova senha')
        const passwordConfirmField = getByPlaceholderText('Confirmação da senha')
        const buttonElement = getByText('Alterar senha')

        fireEvent.change(newPasswordField, { target: {value: 'rafael123'} })
        fireEvent.change(passwordConfirmField, {target: {value: 'rafael123'}})
        fireEvent.click(buttonElement)
        

        await waitFor(() => {
            expect(mockedHistoryPush).toHaveBeenCalledWith('/signin')
        })

    })

    it('should not be able to reset password with invalid credentials', async () => {

        const { getByPlaceholderText, getByText } = render(<ResetPassword />) 

        const newPasswordField = getByPlaceholderText('Nova senha')
        const passwordConfirmField = getByPlaceholderText('Confirmação da senha')
        const buttonElement = getByText('Alterar senha')

        fireEvent.change(newPasswordField, { target: {value: 'rafael123'} })
        fireEvent.change(passwordConfirmField, {target: {value: '123123'}})
        fireEvent.click(buttonElement)
        

        await waitFor(() => {
            expect(mockedHistoryPush).not.toHaveBeenCalledWith()
        })

    })

    //it('should not be able to reset password without token', async () => {
    //    
    //    const { getByPlaceholderText, getByText } = render(<ResetPassword />) 
//
    //    const newPasswordField = getByPlaceholderText('Nova senha')
    //    const passwordConfirmField = getByPlaceholderText('Confirmação da senha')
    //    const buttonElement = getByText('Alterar senha')
//
    //    fireEvent.change(newPasswordField, { target: {value: 'rafael123'} })
    //    fireEvent.change(passwordConfirmField, {target: {value: 'rafael123'}})
    //    fireEvent.click(buttonElement)
    //    
//
    //    await waitFor(() => {
    //        expect(mockedHistoryPush).not.toHaveBeenCalledWith('/signin')
    //    })
    //    
    //})

    it('should not be able to set password', async () => {
       
        apiMock.onPost('password/reset').reply(400, {})

        const { getByPlaceholderText, getByText } = render(<ResetPassword />) 

        const newPasswordField = getByPlaceholderText('Nova senha')
        const passwordConfirmField = getByPlaceholderText('Confirmação da senha')
        const buttonElement = getByText('Alterar senha')

        fireEvent.change(newPasswordField, { target: {value: 'rafael123'} })
        fireEvent.change(passwordConfirmField, {target: {value: 'rafael123'}})
        fireEvent.click(buttonElement)
        

        await waitFor(() => {
            expect(mockedAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'error'
                })
            )
        })

    })

})