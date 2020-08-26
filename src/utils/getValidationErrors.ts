import { ValidationError } from 'yup'

interface Errors {
    [key: string]: string //qualquer nome de variavel desde que seja string (para no caso de nao sabermos quantas variaveis tem)
}

export default function getValidationErrors(err: ValidationError): Errors { //para obter as propriedades 
    
    const ValidationErrors: Errors = {}

    err.inner.forEach(error => {
        ValidationErrors[error.path] = error.message //nome do array(key) path = msg do erro
    })

    return ValidationErrors
}