import axios from "axios";

class RunDataService {
  getAll() {
    return axios.get("/api/runset");
  }

  get(id) {
    return axios.get(`/api/runset/${id}`);
  }
}

export default new RunDataService();
