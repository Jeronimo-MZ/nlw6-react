import { FormEvent, useCallback, useState } from "react";
import { useParams } from "react-router";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import "../styles/room.scss";

interface RoomParams {
    id: string;
}

export function Room() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState("");
    const { user } = useAuth();

    const handleSendQuestion = useCallback(
        async (event: FormEvent) => {
            event.preventDefault();
            if (newQuestion.trim() === "") return;

            if (!user) {
                throw new Error("You must be Logged In");
            }

            const question = {
                content: newQuestion,
                author: {
                    name: user.name,
                    avatar: user.avatar,
                },
                isHighlighted: false,
                isAnswered: false,
            };

            await database.ref(`/rooms/${roomId}/questions`).push(question);
            setNewQuestion("");
        },
        [newQuestion, roomId, user]
    );

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Let me ask" />
                    <RoomCode code={roomId} />
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={(event) => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <footer>
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>
                                Para enviar sua pergunta,{" "}
                                <button>Faça seu login</button>.
                            </span>
                        )}
                        <Button type="submit" disabled={!user}>
                            Enviar Pergunta
                        </Button>
                    </footer>
                </form>
            </main>
        </div>
    );
}