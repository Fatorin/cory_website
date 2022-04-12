import React, { createContext, useCallback, useState } from "react";
import { NotificationViewer } from "./NotificationViewer";

interface INotification {
    message: string;
    status: boolean;
    show: boolean;
    addMessage: (message: string, status: boolean) => void;
    removeMessage: () => void;
}

const defaultState = {
    message: "",
    status: false,
    show: false,
    addMessage: () => { },
    removeMessage: () => { },
}

export const NotificationContext = createContext<INotification>(defaultState);

export const NotificationProvider: React.FC = (props => {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(false);
    const [show, setShow] = useState(false);

    const onAddMessage = (message: string, status: boolean) => {
        setMessage(message);
        setStatus(status);
        setShow(true);
        setTimeout(onRemoveMessage, 5000);
    }

    const onRemoveMessage = () => {
        setShow(false);
    }

    return (
        <NotificationContext.Provider
            value={{
                message: message,
                status: status,
                show: show,
                addMessage: useCallback((message, status) => onAddMessage(message, status), []),
                removeMessage: onRemoveMessage,
            }}>
            {props.children}
            <NotificationViewer />
        </NotificationContext.Provider >
    );
})