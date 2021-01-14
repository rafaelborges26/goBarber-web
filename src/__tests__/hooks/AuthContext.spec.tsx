import { renderHook } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from '../../hooks/AuthContext'
import MockAdapter from 'axios-mock-adapter'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

const apiResponse = {
    user: {
        id: 'user123',
        name: 'John Doe',
        email: 'johndoe@example.com'  
    },
    token: 'token123'
}

describe('Auth hook', () => {
    it('should be able to sign in', async () => {

        apiMock.onPost('sessions').reply(200, apiResponse) //quando tiver um post na rota session, falarei o retorno - reoly: status de sucesso ou erro e os dados

        //descobrir se dentro do localstorage a funcao setItem foi chamada
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')


        const {result, waitForNextUpdate} = renderHook(() => useAuth(), {
            wrapper: AuthProvider //componente que desejamos colocar por volta, nesse caso o AuthProvider para conseguir ler os valores
        })

        result.current.signIn({
            email: 'johndoe@example.com',
            password: '123456'
        })

        await waitForNextUpdate(); //esperar que as atualizações aconteça

        expect(setItemSpy).toHaveBeenCalledWith('@GoBarber.token', apiResponse.token)
        expect(setItemSpy).toHaveBeenCalledWith('@GoBarber.user', JSON.stringify(apiResponse.user))

        expect(result.current.user.email).toEqual('johndoe@example.com')
        

    })  
} )