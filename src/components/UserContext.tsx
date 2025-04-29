// could potentially create a user context to wrap app
// this way, login could persist across pages for a user, and we could set up controls so that they only can update their page incrementors
// we could also post the users score in relation to the leaderboard score in the banner
// this could also DEFINITELY be a stretch feature. We have a lot to do.

import { createContext, useState, ReactNode } from 'react';

interface User {
    name: string; 
    email: string; 
}

const UserContext = createContext<[User | null, React.Dispatch<React.SetStateAction<User | null>>]>([
    null, // default value
    () => {},
  ]);
  

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
