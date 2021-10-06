import axios from "axios";

class RunDataService {

  constructor() {
    this.baseurl = process.env.REACT_APP_BASEURL;
  }

  getAll() {
    return axios.get(this.baseurl + "/api/runset");
  }

  get(id) {
    return axios.get(`${this.baseurl}/api/runset/${id}`);
  }
}

export default new RunDataService();
