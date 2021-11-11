import axios from "axios";

class RunDataService {

  constructor() {
    this.baseurl = process.env.REACT_APP_BASEURL;
  }

  getAll(setup) {
    return axios.get(`${this.baseurl}/api/${setup}/summary`);
  }

  get(setup, run) {
    return axios.get(`${this.baseurl}/api/${setup}/${run}`);
  }
}

export default new RunDataService();
