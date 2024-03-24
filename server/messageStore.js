export class MessageStore {
    constructor() {
        this.messages = [];
    }

    // Function to add a message
    addMessage(message) {
        this.messages.push(message);
    }

    // Function to remove a message by its index
    removeMessage(id) {
        const index = this.messages.findIndex(message => message.id === id);
        if (index !== -1) {
            this.messages.splice(index, 1);
            return true; // Indicate successful removal
        }
        return false;
    }

    getMessages(id) {
        const msgs = this.messages.filter((msg) => msg.to === id);
        return msgs;
    }

    // Function to get all messages
    getAllMessages() {
        return this.messages;
    }
}
