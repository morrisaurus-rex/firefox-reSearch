
export const MessageType = {
    "SEARCH": 1,
    "JUMP_TO": 2,
    "CLEAR": 3,
    "CHANGE_COLOR": 4,
    "GET_NUM": 5,
    "SENT_NUM": 6,
    "GET_MAX": 7,
    "SENT_MAX": 8
};

/**
 * Invert key-value of MessageType so we have a two-way association
 */
export const MessageTypeInverse = InvertEnumKeyValue(MessageType);

function InvertEnumKeyValue(obj) {
    let o = {};
    for (let key of Object.keys(obj)) {
        o[obj[key]] = key;
    }
    return o;
}

export class Message {
    constructor(msgtype, params) {
        if (!MessageType.hasOwnKeys(msgtype)) throw new Error('Invalid message type');
        this.command = msgtype;
        this.params = params;
    }
    /**
     * For debugging purposes.
     * @returns Name of the code corresponding to {@link MessageType}.
     */
    GetTypeString() {
        return MessageTypeInverse[this.command];
    }
}