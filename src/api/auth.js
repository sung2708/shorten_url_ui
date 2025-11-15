import api from "./axios";

const auth = {
  loginUser: function (email, password) {
    return api.post("/auth/login", { email, password });
  },
  registerUser: function (data) {
    return api.post("/auth/register", data);
    },
    verifyAccount: function (email, code) {
      return api.post("/auth/verify-code", { email, code });
    },
};

export default auth;
