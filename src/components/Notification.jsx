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
    return (
        <div className="notifications">
            {notifications.map((notification, index) => {
                return <Link
                    to="/inbox"
                    state={{ connection: notification.connection }}
                    key={index}
                    className="notification fade-out"
                    style={{ animationDelay: `${index * 0.5}s` }}
                >
                    {notification.message}
                </Link>
            })}
        </div>
    );
};


export default Notification;
