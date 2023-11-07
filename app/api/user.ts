export const saveUsername = (username: string): string => {
  localStorage.setItem("username", username);
  return username;
};

export const getUsername = (): string | null => {
  return localStorage.getItem("username");
};
