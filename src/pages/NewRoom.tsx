import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'


import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { auth, database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'
import toast, { Toaster } from 'react-hot-toast';

import '../styles/auth.scss'

export function NewRoom() {
  const { user, setUser } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if(newRoom.trim() === '') {
      return
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  async function signOut(){
    await auth.signOut();
    setUser(undefined);

    toast('Você foi deslogado da sua conta.', {
      icon: '✅',
    });

    history.push(`/`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Questions and Answers" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
            type="text"
            placeholder="Nome da sala"
            onChange={event => setNewRoom(event.target.value)}
            value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>

      { user && (
        <div onClick={signOut} className="sign-out">
          <i className="fas fa-sign-out-alt"></i>
        </div>
      ) }

    <Toaster />
    </div>
  )
}