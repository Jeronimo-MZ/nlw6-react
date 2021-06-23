import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { auth, firebase } from "../services/firebase";

interface IUser {
    id: string;
    name: string;
    avatar: string;
}
interface AuthContextData {
    signInWithGoogle: () => Promise<void>;
    user: IUser | undefined;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL) {
                    throw new Error("Missing information from Google Account.");
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL,
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const signInWithGoogle = useCallback(async () => {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider);

        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL) {
                throw new Error("Missing information from Google Account.");
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
            });
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signInWithGoogle,
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
