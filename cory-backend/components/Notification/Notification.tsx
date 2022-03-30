import React, { createContext, useCallback, useState } from "react";
import { NotificationViewer } from "./NotificationViewer";

interface INotification {
    message: string;
    status: boolean;
    show: boolean;
    addError: (message: string, status: boolean) => void;
    removeError: () => void;
}

const defaultState = {
    message: "",
    status: false,
    show: false,
    addError: () => { },
    removeError: () => { },
}

export const NotificationContext = createContext<INotification>(defaultState);

export const NotificationProvider: React.FC = (props => {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(false);
    const [show, setShow] = useState(false);

    const onAddError = (message: string, status: boolean) => {
        setMessage(message);
        setStatus(status);
        setShow(true);
    }

    const onRemoveError = () => {
        setShow(false);
    }

    return (
        <NotificationContext.Provider
            value={{
                message: message,
                status: status,
                show: show,
                addError: useCallback((message, status) => onAddError(message, status), []),
                removeError: onRemoveError,
            }}>
            {props.children}
            <NotificationViewer />
        </NotificationContext.Provider >
    );
})