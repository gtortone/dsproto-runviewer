import axios from "axios";

class RunDataService {

  constructor() {
    this.baseurl = process.env.REACT_APP_BASEURL;
  }

  getAll(setup) {
    return axios.get(`${this.baseurl}/api/${setup}/runset`);
  }

  get(setup, id) {
    return axios.get(`${this.baseurl}/api/${setup}/runset/${id}`);
  }
}

export default new RunDataService();
