import { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

interface RoomParams {
    id: string;
}

export function AdminRoom() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title, authorId } = useRoom(roomId);
    const history = useHistory();

    const { user } = useAuth();

    useEffect(() => {
        if (!!authorId) {
            if (authorId !== user?.id) {
                history.replace(`/rooms/${roomId}`);
            }
        }
    }, [user, authorId, roomId, history]);

    const handleCloseRoom = useCallback(async () => {
        await database.ref(`rooms/${roomId}`).update({
            closed_at: new Date(),
        });
        history.push("/");
    }, [roomId, history]);

    const handleCheckQuestionAsAnswered = useCallback(
        async (questionId: string) => {
            await database
                .ref(`rooms/${roomId}/questions/${questionId}`)
                .update({
                    isAnswered: true,
                });
        },
        [roomId]
    );

    const handleToggleHighlightQuestion = useCallback(
        async (questionId: string, isHighlighted: boolean) => {
            await database
                .ref(`rooms/${roomId}/questions/${questionId}`)
                .update({
                    isHighlighted: !isHighlighted,
                });
        },
        [roomId]
    );

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
                        {!!user && authorId === user.id && (
                            <Button isOutlined onClick={handleCloseRoom}>
                                Encerrar Sala
                            </Button>
                        )}
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
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswered && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCheckQuestionAsAnswered(
                                                question.id
                                            )
                                        }
                                        aria-label="Marcar pergunta como respondida"
                                        title="Marcar como respondida"
                                    >
                                        <img
                                            src={checkImg}
                                            alt="Marcar pergunta como respondida"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggleHighlightQuestion(
                                                question.id,
                                                question.isHighlighted
                                            )
                                        }
                                        aria-label="Dar destaque a pergunta"
                                        title="Destacar"
                                    >
                                        <img
                                            src={answerImg}
                                            alt="Dar destaque a pergunta"
                                        />
                                    </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteQuestion(question.id)
                                }
                                aria-label="Remover pergunta"
                                title="Remover"
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
