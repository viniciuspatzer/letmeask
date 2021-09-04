import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  setUser: (value: User | undefined) => void;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps){
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid} = user;
  
        setUser({
          id: uid,
          name: displayName || 'Unnamed',
          avatar: photoURL || 'https://www.gravatar.com/avatar/0?d=mp&f=y'
        });
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid} = result.user;
      
      setUser({
        id: uid,
        name: displayName || 'Unnamed',
        avatar: photoURL || 'https://www.gravatar.com/avatar/0?d=mp&f=y'
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}