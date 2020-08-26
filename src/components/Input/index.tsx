import React, {InputHTMLAttributes, useEffect, useState, useRef, useCallback} from 'react'
import { Container } from './styles'
import { IconBaseProps } from 'react-icons'
import { useField } from '@unform/core'
import { callbackify } from 'util'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    icon?: React.ComponentType<IconBaseProps>
}
const Input: React.FC<InputProps> = ({name ,icon: Icon, ...rest}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const { fieldName, defaultValue, error, registerField } = useField(name) //o nome do campo, obtenho das propriedades do InputProps

    const handleInputBlur = useCallback(() => {
        setIsFocused(false)

        if(inputRef.current?.value) { //se tiver valor
            setIsFilled(true) //aviso o state que tem valor
        } else {
            setIsFilled(false)
        }

    },[])

    const handleInputFocus = useCallback(() => {
        setIsFocused(true)
    },[])

    useEffect(() => {
        registerField({
        name: fieldName,
        ref: inputRef.current, //obtendo o input, parecido com jQuery
        path: 'value', //informando que o valor esta dentro de .value
        })
    },[fieldName, registerField])

    return (
    <Container isFilled={isFilled} isFocused={isFocused}>
        {Icon && <Icon size={20} />}
        <input 
            defaultValue={defaultValue} 
            ref={inputRef} 
            {...rest /*para pegar todas as propriedades do component */}
            onFocus={handleInputFocus} //ao o usuario colocar o foco no input
            onBlur={handleInputBlur} //ao o usuario tirar o foco do input
        /> 
    </Container>
) 

}

export default Input