import axios from 'axios';

import { API_URL } from '../constants';

//API End Point
export const EVENT = `${API_URL}/event`;
export const CATEGORY = `${API_URL}/category`;

//INDEX
export async function getEvents(params = {}){
    try{
        let res = await axios.get(`${EVENT}`, {params});

        return res.data;
    }catch (e) {
        throw handler(e)
    }
}

//CREATE AND EDIT
export async function createUpdateEvent(data, id){
    try{
        const form_data = new FormData();
        for ( let key in data )
            form_data.append(key, data[key]);


        const options = {
            method: !id ? 'POST' : 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            },
            data: form_data,
            url : id ? `${EVENT}/${id}` : `${EVENT}`
        };

        let res = await axios(options);
        return res.data;
    }catch (e) {
        throw handler(e);
    }
}

//READ
export async function getEvent(id){
    try{
        let res = await axios.get(`${EVENT}/${id}`);

        return res.data;
    }catch (e) {
        throw handler(e);
    }
}

//DELETE
export async function deleteEvent(id) {
    try {
        let res = await axios.delete(`${EVENT}/${id}`);

        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

//READ CATEGORIES
export async function getCategories(params = {}){
    try{
        let res = await axios.get(`${CATEGORY}`, {params});
        return res.data;
    }catch (e) {
        throw handler(e)
    }
}

//SEARCH
export async function search(query, cancelToken){
    try{
        //create params object
        let params = {
            q:query.toLowerCase(), 
            cancelToken: cancelToken.token,
            limit: 500, group: false, sort_order: 'asc'
        };

            let res = await axios.get(`${EVENT}`, {params});
        return res.data;
    }catch (error) {
        let err = new Error(error.message);
        err.isCancel = (axios.isCancel(error));

        throw err;
    }
}

export function handler(err) {
    let error = err;

    if (err.response && err.response.data.hasOwnProperty("message"))
        error = err.response.data;
    else if (!err.hasOwnProperty("message")) error = err.toJSON();

    return new Error(error.message);
}