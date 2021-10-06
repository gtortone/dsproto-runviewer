import axios from "axios";

class RunDataService {

  constructor() {
    this.baseurl = process.env.REACT_APP_BASEURL;
  }

  getAll_() {
    return axios.get(this.baseurl + "/api/runset");
  }

  getAll(setup) {
    return axios.get(`${this.baseurl}/api/${setup}/runset`);
  }

  get_(id) {
    return axios.get(`${this.baseurl}/api/runset/${id}`);
  }

  get(setup, id) {
    return axios.get(`${this.baseurl}/api/${setup}/runset/${id}`);
  }
}

export default new RunDataService();
