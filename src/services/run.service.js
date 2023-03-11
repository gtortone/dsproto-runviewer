import axios from "axios";

class RunDataService {

  constructor() {
    this.baseurl = process.env.REACT_APP_BASEURL;
  }

  getAll(setup) {
    return axios.get(`${this.baseurl}/api/${setup}/summary`);
  }

  getPage(setup, page, size) {
    return axios.get(`${this.baseurl}/api/${setup}/summary?page=${page}&limit=${size}`);
  }

  getRunByNumber(setup, run, position='') {
    return axios.get(`${this.baseurl}/api/${setup}/run/${run}?pos=${position}`);
  }

  getRunById(setup, id) {
    return axios.get(`${this.baseurl}/api/${setup}/id/${id}`);
  }
}

const ds = new RunDataService()

export default ds;
