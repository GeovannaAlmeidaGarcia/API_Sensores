import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

export const getSensor = (id) => API.get(`/sensor/${id}`);