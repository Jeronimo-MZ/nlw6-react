import { useEffect, useState } from "react";
import { database } from "../services/firebase";

interface IQuestion {
    id: string;
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    author: {
        name: string;
        avatar: string;
    };
}
type firebaseQuestions = Record<string, Omit<IQuestion, "id">>;

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [title, setTitle] = useState("");

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

    return { questions, title };
}
