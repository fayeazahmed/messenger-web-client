import React from 'react'
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const InboxInput = ({ darkMode, messageInput, setMessageInput, handleMessageInputChange, sendMessage, emojiPicker, setEmojiPicker }) => {

    const handleEmojiSelect = (emoji) => {
        setMessageInput((prevText) => prevText + emoji.native);
    };

    return (
        <div className={`inbox-input-container ${darkMode ? "inbox-input-container-dark" : ""}`}>
            <textarea
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleMessageInputChange}
                onClick={() => setEmojiPicker(false)}
                placeholder="Send something..."
                className="inbox-input"
            />
            {
                emojiPicker && <div className="inbox-input-emoji-picker">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
            }
            <button onClick={() => setEmojiPicker(!emojiPicker)} className="inbox-input-emoji-btn">
                <i className="fa fa-smile-o" aria-hidden="true"></i>
            </button>
            <button onClick={sendMessage} className="inbox-send-button btn btn-dark">
                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
            </button>
        </div>
    )
}

export default InboxInput