import axios from "axios";

const API_KEY = '45097274-693884c3aaf69587e7e519e0d';

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params) => { // {q , page , category , other}
    let url = apiUrl+ "&per_page=25&safesearch=true&editors_choice=true"
    if(!params) return url;
    let paramsKeys = Object.keys(params);
    paramsKeys.map(key=>{
        let value = key=='q'? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });
    console.log('final url : ', url);
    return url;
}

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params));
        const {data} = response;
        return {success: true,data}
    } catch (err) {
        console.log('got error : ', err.message);
        return { success: flase, msg: err.message };
    }
}