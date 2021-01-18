import { renderHook, act } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from '../../hooks/AuthContext'
import MockAdapter from 'axios-mock-adapter'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

const apiResponse = {
    user: {
        id: 'user123',
        name: 'John Doe',
        email: 'johndoe@example.com', 
        avatar_url: 'iamge-teste.jpg' 
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
    
    it('should restore saved data from storage when auth inits', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch(key) {
                case '@GoBarber.token':
                    return 'token123';
                case '@GoBarber.user':
                    return JSON.stringify({
                            id: 'user123',
                            name: 'John Doe',
                            email: 'johndoe@example.com'                       
                    })
                default: null;
            }
        })

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider //componente que desejamos colocar por volta, nesse caso o AuthProvider para conseguir ler os valores
        })

        expect(result.current.user.email).toEqual('johndoe@example.com')        

    })

    it('should be able to sign out', async () => {

        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch(key) {
                case '@GoBarber.token':
                    return 'token123';
                case '@GoBarber.user':
                    return JSON.stringify({
                            id: 'user123',
                            name: 'John Doe',
                            email: 'johndoe@example.com'                       
                    })
                default: null;
            }
        })

        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')
         

        const { result, waitForNextUpdate } = renderHook(() => useAuth(), { //chamamos o hook
            wrapper: AuthProvider //componente que desejamos colocar por volta, nesse caso o AuthProvider para conseguir ler os valores
        })

        act(() => {
            result.current.signOut()
        }) 
        //quando houver alteração de state no codigo, usar o act, para aguardar a atualização da variavel
        
        expect(removeItemSpy).toHaveBeenCalledTimes(2) //tenha sido chamado 2 vezes
        expect(result.current.user).toBeUndefined()
    })

    it('should be able to update user data', () => {
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

        const {result} = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        })

        const user = {
            id: 'user123',
            name: 'John Doe2',
            email: 'johndoe@example.com',
            avatar_url: 'image-teste.jpg'
        }

        act(() => {
            result.current.updateUser(user)
        })

        expect(setItemSpy).toHaveBeenCalledWith(
            '@GoBarber.user',
            JSON.stringify(user),
        )

        expect(result.current.user).toEqual(user) //checando se é igual ao user q eu passei pra atualização
    })

} )