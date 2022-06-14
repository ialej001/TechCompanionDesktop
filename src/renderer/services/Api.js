import axios from "axios";

// const SERVER_URL = "http://advancedaccess.dyndns.tv:8080/";
const SERVER_URL = "http://localhost:8080/";

const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000
});

export default () => {
  return instance;
};
