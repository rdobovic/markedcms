const rand = () => {
    return Math.random().toString(36).split('.')[1];
}

export default function generateToken() {
    return rand() + rand() + rand() + rand();
}