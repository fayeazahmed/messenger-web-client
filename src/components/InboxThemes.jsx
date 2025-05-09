import React, { useContext, useEffect, useState } from 'react'
import bgImage0 from "../images/0.jpg";
import bgImage1 from "../images/1.jpg";
import bgImage2 from "../images/2.jpg";
import bgImage3 from "../images/3.jpg";
import bgImage4 from "../images/4.jpg";
import { Context } from '../services/Context';
import apiClient from '../services/ApiClient';

const bgImages = [bgImage0, bgImage1, bgImage2, bgImage3, bgImage4];

const InboxThemes = ({ connection, groupChatId, selectedTheme }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { setConnections } = useContext(Context);

    useEffect(() => setSelectedIndex(selectedTheme), [selectedTheme])

    const updateTheme = async (index) => {
        if (connection) {
            try {
                await apiClient.updateChatSettings({
                    id: connection.chat.id,
                    theme: index
                })
                setSelectedIndex(index)
                setConnections(connections => connections.map(conn => {
                    if (conn.id === connection.id) {
                        return {
                            ...conn, chat: {
                                ...conn.chat,
                                theme: index
                            }
                        };
                    }
                    return conn
                })
                );
            } catch (error) {
                console.log(error);
            }
        } else if (groupChatId) {
            try {
                await apiClient.updateChatSettings({
                    id: groupChatId,
                    theme: index
                })
                setSelectedIndex(index)




            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="inbox-themes">
            {bgImages.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`inbox-themes-image ${selectedIndex === index ? "inbox-themes-image-selected" : ""}`}
                    onClick={() => updateTheme(index)}
                />
            ))}
        </div>
    )
}

export default InboxThemes