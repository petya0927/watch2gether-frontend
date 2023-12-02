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

export const isUsernameTaken = async ({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}): Promise<boolean | undefined> => {
  if (!username || !roomId) return;

  const roomExists = await isRoomExists(roomId);
  if (!roomExists) {
    return;
  }

  try {
    const res = await axios.get(
      `room/${roomId}/isUsernameTaken?username=${username}`
    );
    return res.data.isTaken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const handleIsUsernameTaken = async ({
  form,
  roomId,
  username,
}: {
  form: any;
  roomId: string;
  username: string;
}) => {
  const isTaken = await isUsernameTaken({ roomId, username });
  if (isTaken) {
    form.setFieldError('username', 'Username is already taken in this room');
  } else {
    form.setFieldError('username', '');
  }

  return isTaken;
};

export const isRoomExists = async (roomId: string): Promise<boolean> => {
  try {
    const response = await getRoom(roomId);
    return !!response;
  } catch (error) {
    console.error(error);
    return false;
  }
};
