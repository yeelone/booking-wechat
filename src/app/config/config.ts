// const config = {
//     baseurl : 'http://jd96138.com'
// }

// for debug
const config = {
    baseurl : 'http://127.0.0.1:8080',
    // baseurl : 'http://jd96138.com',
    appid: "",
    server: "127.0.0.1:8080",
    // server: "jd96138.com",
    prompt: "",
    company:"public",
};

config.prompt = config.baseurl + '/assets/audio/prompt.mp3';

export default config;
