import { useCallback } from "react";
import copyImg from "../assets/images/copy.svg";
import "../styles/room-code.scss";

interface RoomCodeProps {
    code: string;
}

export function RoomCode({ code }: RoomCodeProps) {
    const copyRoomCodeToClipboard = useCallback(() => {
        navigator.clipboard.writeText(code);
    }, [code]);

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copiar código da sala" />
            </div>
            <span>Sala #{code}</span>
        </button>
    );
}
