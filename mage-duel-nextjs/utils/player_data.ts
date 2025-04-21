
export const getPlayerId = () => {
    var player_id = localStorage.getItem('player_id');
    if (!player_id) {
        player_id = setPlayerId();
    }
    return player_id;
};



export const setPlayerId = () => {
    const player_id = generatePlayerId();
    const player_id_timestamp = Date.now();
    localStorage.setItem('player_id', player_id);
    localStorage.setItem('player_id_timestamp', player_id_timestamp.toString());
    return player_id;
};

//uuid
const generatePlayerId = () => {
    return uuidv4();
};

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};
