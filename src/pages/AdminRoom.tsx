import { useCallback } from "react";
import { useHistory, useParams } from "react-router";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import "../styles/room.scss";
import deleteImg from "../assets/images/delete.svg";
import { database } from "../services/firebase";

interface RoomParams {
    id: string;
}

export function AdminRoom() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);
    const history = useHistory();

    // const { user } = useAuth();

    const handleCloseRoom = useCallback(async () => {
        await database.ref(`rooms/${roomId}`).update({
            closed_at: new Date(),
        });
        history.push("/");
    }, [roomId, history]);

    const handleDeleteQuestion = useCallback(
        async (questionId: string) => {
            if (
                window.confirm("Tem certeza que deseja excluir essa pergunta?")
            ) {
                await database
                    .ref(`rooms/${roomId}/questions/${questionId}`)
                    .remove();
            }
        },
        [roomId]
    );

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Let me ask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleCloseRoom}>
                            Encerrar Sala
                        </Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions?.length > 0 && (
                        <span>{questions?.length} perguntas</span>
                    )}
                </div>

                <div className="question-list">
                    {questions.map((question) => (
                        <Question
                            key={question.id}
                            author={question.author}
                            content={question.content}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteQuestion(question.id)
                                }
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    ))}
                </div>
            </main>
        </div>
    );
}
