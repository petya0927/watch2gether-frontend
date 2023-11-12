import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081';

export const createRoom = async ({
  videoUrl,
  owner,
}: {
  videoUrl: string;
  owner: string;
}) => {
  try {
    const res = await axios.post('room/new', { videoUrl, owner });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRoom = async (roomId: string) => {
  try {
    const res = await axios.get(`room/${roomId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const isUsernameAvailable = async ({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) => {
  if (!username || !roomId) return;

  try {
    const res = await axios.get(
      `room/${roomId}/isUsernameAvailable?username=${username}`,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
