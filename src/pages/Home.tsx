import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { auth, database } from '../services/firebase'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import toast, { Toaster } from 'react-hot-toast';

import '../styles/auth.scss'


export function Home() {
  const history = useHistory();
  const { user, setUser, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  
  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    // Guard clause
    if (roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()){
      toast("There's no room with this ID.", {
        icon: '⚠️',
      });
      return
    }

    if (roomRef.val().endedAt) {
      toast("Room is no longer active.", {
        icon: '⚠️',
      });
      return
    }

    history.push(`/rooms/${roomCode}`);
  }

  async function signOut(){
    await auth.signOut();
    setUser(undefined);

    toast('Você foi deslogado da sua conta.', {
      icon: '✅',
    });
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
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Google Logo" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
            type="text"
            placeholder="Digite o código da sala"
            onChange={event => setRoomCode(event.target.value)}
            value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
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