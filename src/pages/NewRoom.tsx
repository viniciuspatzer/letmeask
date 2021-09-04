import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

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
      return;
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
    toast.success('You have been logged out');
    history.push(`/`);
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
          <h2>Create a new room</h2>
          <form onSubmit={handleCreateRoom}>
            <input
            type="text"
            placeholder="Room name"
            onChange={event => setNewRoom(event.target.value)}
            value={newRoom}
            />
            <Button type="submit">
              Create room
            </Button>
          </form>
          <p>
            Want to join in an existent room? <Link to="/">click here</Link>
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