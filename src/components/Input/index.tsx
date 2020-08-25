import React, {InputHTMLAttributes, useEffect, useRef} from 'react'
import { Container } from './styles'
import { IconBaseProps } from 'react-icons'
import { useField } from '@unform/core'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    icon?: React.ComponentType<IconBaseProps>
}
const Input: React.FC<InputProps> = ({name ,icon: Icon, ...rest}) => {
    const inputRef = useRef(null)
    const { fieldName, defaultValue, error, registerField } = useField(name) //o nome do campo, obtenho das propriedades do InputProps

    useEffect(() => {
        registerField({
        name: fieldName,
        ref: inputRef.current, //obtendo o input, parecido com jQuery
        path: 'value', //informando que o valor esta dentro de .value

        })
    },[fieldName, registerField])

    return (
    <Container>
        {Icon && <Icon size={20} />}
        <input defaultValue={defaultValue} ref={inputRef} {...rest /*para pegar todas as propriedades do component */} /> 
    </Container>
) 

}

export default Input