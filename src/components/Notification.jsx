import React, { useContext, useEffect } from "react";
import "../styles/Notification.css";
import { Context } from "../services/Context";
import { Link } from "react-router-dom";

const Notification = () => {
    const { notifications, setNotifications } = useContext(Context);

    useEffect(() => {
        const interval = setInterval(() => {
            if (notifications.length > 0) {
                setNotifications(prev => prev.slice(1));
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [notifications, setNotifications]);

    const getComponent = (notification, index) => {
        const style = { animationDelay: `${index * 0.5}s` }
        const className = "notification fade-out"

        if (notification.connectionId) {
            return <Link
                to="/inbox"
                state={{ connectionId: notification.connectionId }}
                key={index}
                className={className}
                style={style}
            >
                {notification.message}
            </Link>
        } else if (notification.chatId) {
            return <Link
                to="/group"
                state={{ chatId: notification.chatId }}
                key={index}
                className={className}
                style={style}
            >
                {notification.message}
            </Link>
        }
    }

    return (
        <div className="notifications">
            {notifications.map((notification, index) => getComponent(notification, index))}
        </div>
    );
};


export default Notification;
