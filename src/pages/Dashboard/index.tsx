import React from 'react'
import { Container, Header, HeaderContent, Profile, Content, Schedule,  NextAppointment, Calendar } from './styles'

import logoImg from '../../assets/logo.svg'
import { FiClock, FiPower } from 'react-icons/fi'
import { useAuth } from '../../hooks/AuthContext'

const Dashboard: React.FC = () => {  //so sera acessivel se o usuario tiver logado
    
    const { signOut, user } = useAuth()

    console.log(user)

    return (
        <Container>

        <Header>
            <HeaderContent>
                <img src={logoImg} alt="GoBarber"/>

                <Profile>
                    <img src={user.avatar_url} alt={user.name}/>
                    <div>
                        <span>Bem vindo</span>
                        <strong>{user.name}</strong>
                    </div>
                </Profile>

                <button type="button" onClick={signOut}> 
                    <FiPower />
                </button>

            </HeaderContent>
        </Header>

        <Content>
            <Schedule>
                <h1>Horários agendados</h1>
                <p>
                <span>Hoje</span>
                <span>Dia 01</span>
                <span>Terça-feira</span>
                </p>

            <NextAppointment>
                <strong>Atendimento a seguir</strong>
                <div>
                    <img src={user.avatar_url} alt="Rafael Borges"/>
                    <strong>Rafael Borges</strong>
                    <span>
                        <FiClock />
                        08:00
                    </span>
                </div>
            </NextAppointment>

            </Schedule>

            <Calendar/>
        </Content>
    </Container>
    
    )

}

export default Dashboard 