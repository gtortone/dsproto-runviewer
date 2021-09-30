import http from "../http-common";

class RunDataService {
  getAll() {
    return http.get("/runset");
  }

  get(id) {
    return http.get(`/runset/${id}`);
  }
}

export default new RunDataService();
