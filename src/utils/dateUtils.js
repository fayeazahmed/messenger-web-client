function groupMessages(messages) {
    // Create an object to store grouped messages
    const groupedMessages = {};

    messages.forEach(message => {
        // Extract date from timestamp (e.g., '2025-02-17')
        const date = new Date(message.createdAt);

        // Format the date as "Day Month, Year" (e.g., "17 February, 2025")
        const formattedDate = date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // If the date doesn't exist as a key, initialize it with an empty array
        if (!groupedMessages[formattedDate]) {
            groupedMessages[formattedDate] = [];
        }

        // Push the message to the corresponding date group
        groupedMessages[formattedDate].push(message);
    });

    return groupedMessages;
}

function getTimeFromTimestamp(timestamp) {
    const dateObj = new Date(timestamp);

    let time = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return time.toLowerCase().replace(' ', '');
}

export { groupMessages, getTimeFromTimestamp }