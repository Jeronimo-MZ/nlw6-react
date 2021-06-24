import { FormEvent, useCallback, useEffect, useState } from "react";
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

interface Question {
    id: string;
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    author: {
        name: string;
        avatar: string;
    };
}
type firebaseQuestions = Record<string, Omit<Question, "id">>;

// type firebaseQuestions = Record<
//     string,
//     {
//         content: string;
//         isHighlighted: boolean;
//         isAnswered: boolean;
//         author: {
//             name: string;
//             avatar: string;
//         };
//     }
// >;

export function Room() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState("");

    const [newQuestion, setNewQuestion] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on("value", (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: firebaseQuestions = databaseRoom.questions;

            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(
                ([key, value]) => {
                    return {
                        id: key,
                        ...value,
                    };
                }
            );
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
    }, [roomId]);

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
                    <h1>Sala {title}</h1>
                    {questions?.length > 0 && (
                        <span>{questions?.length} perguntas</span>
                    )}
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

                {JSON.stringify(questions)}
            </main>
        </div>
    );
}
