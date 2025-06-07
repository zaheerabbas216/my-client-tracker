import axios from "axios";

const API_BASE_URL = 'http://localhost:5000/api/';


export const get_all_tasks = () => {
    return axios.get(`${API_BASE_URL}tasks`);
}

export const create_single_task = (formdata) => {
    return axios.post(`${API_BASE_URL}tasks/create-task`, formdata);
}

export const delete_single_task = (id) => {
    return axios.delete(`${API_BASE_URL}tasks/delete-task/${id}`);
}

export const edit_single_task = (id, formdata) => {
    return axios.put(`${API_BASE_URL}tasks/edit-task/${id}`, formdata);
}