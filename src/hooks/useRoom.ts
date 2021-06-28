import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

export interface IQuestion {
    id: string;
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    author: {
        name: string;
        avatar: string;
    };

    likeCount: number;
    likeId: string | undefined;
}

type firebaseQuestions = Record<
    string,
    {
        id: string;
        content: string;
        isHighlighted: boolean;
        isAnswered: boolean;
        author: {
            name: string;
            avatar: string;
        };

        likes: Record<
            string,
            {
                authorId: string;
            }
        >;
    }
>;

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [authorId, setAuthorId] = useState("");
    const [title, setTitle] = useState("");
    const [isClosed, setIsClosed] = useState<boolean>();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on("value", (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: firebaseQuestions = databaseRoom.questions;

            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(
                ([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isAnswered: value.isAnswered,
                        isHighlighted: value.isHighlighted,
                        likeCount: Object.values(value.likes ?? {}).length,
                        likeId: Object.entries(value.likes ?? {}).find(
                            ([key, like]) => like.authorId === user?.id
                        )?.[0],
                    };
                }
            );

            setIsClosed(!!databaseRoom?.closed_at);

            setAuthorId(databaseRoom.authorId);

            setTitle(databaseRoom.title);

            const sortedQuestions = parsedQuestions.sort(
                (question1, question2) =>
                    question2.likeCount - question1.likeCount
            );
            setQuestions(sortedQuestions);

            
        });

        return () => {
            roomRef.off("value");
        };
    }, [roomId, user?.id]);
    return {
        questions,
        title,
        authorId,
        isClosed,
    };
}
