import api from "./axios";

const url = {
  getShortcode: function (url) {
    return api.post("/shorten", { url: url });
  },
};

export default url;
