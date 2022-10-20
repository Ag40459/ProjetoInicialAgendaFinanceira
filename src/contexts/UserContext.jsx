import { createContext } from "react";
import useUseProvider from '../hooks/useUserProvider.jsx';

const UserContext = createContext({});

export function UserProvider(props) {
    const userProvider = useUseProvider();
    return (
        <UserContext.Provider value={userProvider}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext;
