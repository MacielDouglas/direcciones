export interface User {
  id: string; // _id do MongoDB como string
  name: string;
  group: string;
  profilePicture?: string;
  isAdmin: boolean;
  isSS: boolean;
  isSCards: boolean;
  codUser: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo reduzido caso você precise apenas de alguns dados
export interface UserBasic {
  id: string;
  name: string;
  profilePicture?: string;
  group: string;
  isAdmin: boolean;
}
