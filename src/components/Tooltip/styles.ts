import styled from 'styled-components'

export const Container = styled.div`
position: relative;

span {
    width: 160px;
    background: #ff9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0; /* para ao passar o mouse aparecer o text  */
    transition: opacity 0,4s; /* para ao passar o mouse aparecer o text  */
    visibility: hidden; /* para ao passar o mouse aparecer o text(esconder)  */

    position: absolute;
    bottom: calc(100% + 12px); /* para colocar pra cima mas nao no topo ai acrescentamos 12px*/
    left :50%; /*hack pra ficar no meio do elemento de baixo */
    transform: translateX(-50%); /*hack pra ficar no meio do elemento de baixo */
    color: #312e38;

    &::before { /*fazer a setinha embaixo do text*/
        content: ''; /*é preciso colocar um content se n, n aparece*/
        border-style: solid;
        border-color: #ff9000 transparent;
        border-width: 6px 6px 0 6px;
        bottom: 20px;
        top: 100%;
        position: absolute;
        left: 50%; /*centralizar */
        transform: translateX(-50%);
    }

}

    &:hover span {
        opacity: 1; /* para ao passar o mouse aparecer o text  */
        visibility: visible; /* para ao passar o mouse aparecer o text(aparecer)  */
    }
`