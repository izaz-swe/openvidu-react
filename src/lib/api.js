import axios from "axios";

export async function getToken({ room, name }) {
  try {
    const body = {
      roomName: room,
      participantName: name,
    };

    const response = await axios.post("http://localhost:6080/token", body);

    // Axios puts the parsed JSON in response.data
    const { token } = response.data;

    if (!token) {
      throw new Error("Token not found in response");
    }

    return token;
  } catch (error) {
    console.error("Error fetching token:", error.message);
    throw error;
  }
}
