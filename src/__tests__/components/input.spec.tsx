import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'

import Input from '../../components/Input'

jest.mock('@unform/core', () => {
    return {
        useField() {
            return {
                fieldName: 'email',
                defaultValue: '',
                error: '',
                registerField: jest.fn()
            }
        }
    }
})

describe('Input component', () => {
    it('should be able to render an input', () => {
        const { getByPlaceholderText } = render(<Input name="email" placeholder="E-mail" />)
    
        expect(getByPlaceholderText('E-mail')).toBeTruthy() //ele exista  
    })

    it('should render highlight on input focus', async () => {
        const { getByPlaceholderText, getByTestId } = render(<Input name="email" placeholder="E-mail" />)
        
        const inputElement = getByPlaceholderText('E-mail')
        const containerElement = getByTestId('input-container')

        fireEvent.focus(inputElement)
        
        await waitFor(() => {
            expect(containerElement).toHaveStyle('border-color: #ff9000;')
            expect(containerElement).toHaveStyle('color: #ff9000;') //verificar se mudou ao cor ao clicar no input
        }) //await pois no nosso codigo esta havendo alteração da variavel state, por isso é async

        fireEvent.blur(inputElement)
        
        await waitFor(() => {
            expect(containerElement).not.toHaveStyle('border-color: #ff9000;')
            expect(containerElement).not.toHaveStyle('color: #ff9000;') //verificar se mudou ao cor ao clicar no input
        })
        
    })

    it('should keep input border highlight when input filled', async () => {
        const { getByPlaceholderText, getByTestId } = render(<Input name="email" placeholder="E-mail" />)
        
        const inputElement = getByPlaceholderText('E-mail')
        const containerElement = getByTestId('input-container')

        fireEvent.change(inputElement, {
            target: {value: 'johndue@example.com.br'}
        })

        fireEvent.blur(inputElement)
        
        await waitFor(() => {
            expect(containerElement).toHaveStyle('color: #ff9000;')
        })
    })
})