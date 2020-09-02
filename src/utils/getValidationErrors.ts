import { ValidationError } from 'yup'

interface Errors {
    [key: string]: string //qualquer nome de variavel desde que seja string (para no caso de nao sabermos quantas variaveis tem tbm)
}

export default function getValidationErrors(err: ValidationError): Errors { //para obter as propriedades 
    
    const ValidationErrors: Errors = {}

    err.inner.forEach(error => { //err.inner onde estao as mensagens de erros
        ValidationErrors[error.path] = error.message //nome do array(key) path = msg do erro
    })

    return ValidationErrors
}