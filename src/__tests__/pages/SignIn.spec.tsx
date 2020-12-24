import React from 'react'
import { render } from '@testing-library/react'
import SignIn from '../../pages/SignIn'

jest.mock('react-router-dom', () => {
    return {
        Link: ({children}: { children: React.ReactNode }) => children, //definindo q o Link tem algum valor dentro q normalmente é string mas com essa tipagem pode ser qqr coisa
    };
});

describe('SignIn Page', () => {
    it('should be able to sign in', () => {
        const { debug } = render(<SignIn/>)

        debug()
    })
})
