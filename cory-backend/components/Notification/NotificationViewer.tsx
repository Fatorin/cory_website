import { useContext } from "react"
import { NotificationContext } from "./Notification"

export const NotificationViewer = () => {
    const { message, status, show, removeError } = useContext(NotificationContext);

    return (
        <div className={`text-right text-white absolute px-2 py-1 bottom-4 right-4 font-medium rounded-md border-2 transition-all duration-200 ${show ? "opacity-100" : "opacity-0"} ${status ? "border-green-200 bg-green-600" : "border-red-200 bg-red-600"}`}>
            <div className="mt-1 text-center">
                <span className="mx-4">{message}</span>
                <button className="border-2 border-white rounded-lg px-2" onClick={removeError}>X</button>
            </div>
        </div>
    )
}