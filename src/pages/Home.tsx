import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import { useAuth } from '../hooks/useAuth'
import { auth, database } from '../services/firebase'
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

    if (roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()){
      toast.error("There's no room with this password");
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error('Room is no longer active');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  async function signOut(){
    await auth.signOut();
    setUser(undefined);
    toast.success('You have been logged out');
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Questions and Answers" />
        <strong>Create live Q&amp;A rooms</strong>
        <p>Answer your audience's questions in real time</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Google logo" />
            Create your room with Google
          </button>
          <div className="separator">or join in a room</div>
          <form onSubmit={handleJoinRoom}>
            <input
            type="text"
            placeholder="Type the room password"
            onChange={event => setRoomCode(event.target.value)}
            value={roomCode}
            />
            <Button type="submit">
              Join room
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