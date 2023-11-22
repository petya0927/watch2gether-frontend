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

export const isUsernameAvailableHandler = async ({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}): Promise<boolean | undefined> => {
  const roomExists = await isRoomExistsHandler(roomId);
  if (!roomExists) {
    return;
  }

  const response = await isUsernameAvailable({
    roomId,
    username: username,
  });

  return response.isAvailable;
};

export const isRoomExistsHandler = async (roomId: string): Promise<boolean> => {
  try {
    const response = await getRoom(roomId);
    return !!response;
  } catch (error) {
    console.error(error);
    return false;
  }
};
