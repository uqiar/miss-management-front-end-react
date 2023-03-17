import resolve from "./resolve";
import axios from 'axios'
let apiBase = process.env.REACT_APP_API_BASEURL;

//login
export const userLogin = async (req) => {
    return await resolve(axios.post(apiBase + "user/login", req).then(res => res.data))
}
export const getImg = (imgUrl) => {
    return apiBase + `findImage/${imgUrl}`
}
export const uploadImg = async (data, profile_image) => {
    return await resolve(axios.post(apiBase + `uploadImage/${profile_image}`, data).then(res => res.data))
}

export const updateUser = async (id,data) => {
    return await resolve(axios.put(apiBase + `user/update/${id}`, data).then(res => res.data))
}

export const getUsersList = async () => {
    return await resolve(axios.get(apiBase + `user/findAll`).then(res => res.data))
}
export const addNewItem = async (data) => {
    return await resolve(axios.post(apiBase + `items/add`,data).then(res => res.data))
}
export const getItem = async (query) => {
    return await resolve(axios.post(apiBase + `items/find`,query).then(res => res.data))
}
export const updateItem = async (id,data) => {
    return await resolve(axios.put(apiBase + `items/update/${id}`,data).then(res => res.data))
}
export const deleteItem = async (id) => {
    return await resolve(axios.delete(apiBase + `items/delete/${id}`).then(res => res.data))
}
export const registerUser = async (data) => {
    return await resolve(axios.post(apiBase + `user/register`,data).then(res => res.data))
}

export const deleteUser = async (id) => {
    return await resolve(axios.delete(apiBase + `user/delete/${id}`).then(res => res.data))
}


export const monthlyUserConfig = async (data) => {
    return await resolve(axios.post(apiBase + `monthlyConfig/get`,data).then(res => res.data))
}
export const newUserConfigure = async (data) => {
    return await resolve(axios.put(apiBase + `monthlyConfig/newConfigure`,data).then(res => res.data))
}
export const configDelete = async (id) => {
    return await resolve(axios.delete(apiBase + `monthlyConfig/delete/${id}`).then(res => res.data))
}
export const configUpdate = async (id,data) => {
    return await resolve(axios.put(apiBase + `monthlyConfig/update/${id}`,data).then(res => res.data))
}

export const allReports = async (data) => {
    return await resolve(axios.post(apiBase + `user/allUserReports`,data).then(res => res.data))
}

export const addNewOtherExpense = async (data) => {
    return await resolve(axios.post(apiBase + `otherExpense/add`,data).then(res => res.data))
}
export const getOtherExpense = async (query) => {
    return await resolve(axios.post(apiBase + `otherExpense/find`,query).then(res => res.data))
}
export const updateOtherExpense = async (id,data) => {
    return await resolve(axios.put(apiBase + `otherExpense/update/${id}`,data).then(res => res.data))
}
export const deleteOtherExpense = async (id) => {
    return await resolve(axios.delete(apiBase + `otherExpense/delete/${id}`).then(res => res.data))
}
export const markePayedUnpayed = async (data) => {
    return await resolve(axios.put(apiBase + `monthlyConfig/payedUnpayed`,data).then(res => res.data))
}
export const testApi = async () => {
    return await resolve(axios.get("https://miss-managment-system-server.onrender.com/test").then(res => res.data))
}

export const getAllUserBookes = async () => {
    return await resolve(axios.get(apiBase + `myBook/all`).then(res => res.data))
}
export const addNewAccount = async (data) => {
    return await resolve(axios.post(apiBase + `myBook/new`,data).then(res => res.data))
}
export const deleteAcountBook = async (id) => {
    return await resolve(axios.delete(apiBase + `myBook/delete/${id}`).then(res => res.data))
}
export const addAmount = async (data,id) => {
    return await resolve(axios.post(apiBase + `myBook/addAmount/${id}`,data).then(res => res.data))
}
export const receiveAmount = async (data,id) => {
    return await resolve(axios.post(apiBase + `myBook/receiveAmount/${id}`,data).then(res => res.data))
}
export const deleteAddAmount = async (data,id) => {
    return await resolve(axios.post(apiBase + `myBook/deleteAddAmount/${id}`,data).then(res => res.data))
}
export const deleteColectAmount = async (data,id) => {
    return await resolve(axios.post(apiBase + `myBook/deleteCollectAmount/${id}`,data).then(res => res.data))
}