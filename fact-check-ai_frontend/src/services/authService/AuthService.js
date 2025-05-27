import { api } from "../api/client";

// Utility function for authenticated requests
const makeAuthenticatedRequest = async (token, method, url, data = null) => {
  try {
    const config = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...(data && { data }),
    };
    const response = await api(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.detail || `${error.response.status}: Request failed`
      );
    }
    throw new Error("Network error or server unavailable");
  }
};

// Register a new user
const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", {
      email: userData.email,
      password: userData.password,
      firebase_uid: userData.firebase_uid,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verifyUser = async (email) => {
  try {
    const response = await api.get(`/verified?email=${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.detail || "Registration failed");
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    const response = await api.post("/token", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.detail || "Login failed");
  }
};

// Update topic selection
const updateTopicSelection = async (email, topics) => {
  try {
    const response = await api.put("/topic_selection", {
      email: email,
      topics: topics,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update country selection (adjusted to POST for form data)
const updateCountrySelection = async (email, countries) => {
  try {
    const formData = new FormData();
    formData.append("countries", countries);
    formData.append("email", email);
    const response = await api.put("/country_selection", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.detail || "Contry selection failed");
  }
};

// Update user profile
const updateProfile = async (email, displayName) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("display_name", displayName);
  try {
    const response = await api.put("/update_profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.detail || "Profile update failed");
  }
};

const getSecretKey = async (key) => {
  try {
    const response = await api.get(`/get-secret-key?key=${key}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.detail || "Registration failed");
  }
};


export {
  registerUser,
  verifyUser,
  loginUser,
  updateTopicSelection,
  updateCountrySelection,
  updateProfile,
  getSecretKey,
};
