import React, { useContext, useEffect } from "react";
import "../styles/Notification.css";
import { Context } from "../services/Context";

const Notification = () => {
    const { notification, setNotification } = useContext(Context);

    useEffect(() => {
        if (notification !== "") {
            const timer = setTimeout(() => {
                setNotification("");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [notification, setNotification]);

    return (
        <div className={`notification ${notification === "" ? "notification-closed" : ""}`}>
            <p className="notification-content">{notification}</p>
        </div>
    );
};

export default Notification;
