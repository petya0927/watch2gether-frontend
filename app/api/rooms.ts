import axios from "axios";

axios.defaults.baseURL = "http://localhost:8081";

export const createRoom = async ({
  videoUrl,
  owner,
}: {
  videoUrl: string;
  owner: string;
}) => {
  const res = await axios.post("/room/new", { videoUrl, owner });
  return res.data;
};

export const getRoom = async (roomId: string) => {
  const res = await axios.get(`/room/${roomId}`);
  return res.data;
};
