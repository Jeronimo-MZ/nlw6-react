import logoImg from "../assets/images/logo.svg";
import illustrationImg from "../assets/images/illustration.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();

    const handleCreateRoom = useCallback(async () => {
        if (!user) {
            await signInWithGoogle();
        }
        history.push("/rooms/new");
    }, [signInWithGoogle, user, history]);

    return (
        <div id="page-auth">
            <aside>
                <img
                    src={illustrationImg}
                    alt="Ilustração simbolizando perguntas e respostas"
                />
                <strong>Crie salas de Q&amp;A ao vivo!</strong>
                <p>Tire as dúvidas da sua audiência em tempo real.</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Let me ask" />
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form>
                        <input
                            type="text"
                            placeholder="Digite o Código da sala"
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
