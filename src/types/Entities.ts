import type { CommentId, PostId, TodoId, UserId } from "./Id";

export interface AddressDto {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: number;
    lng: number;
  };
}

export interface CompanyDto {
  name: string;
  catchphrase: string;
  bs: string;
}

export interface UserDto {
  id: UserId;
  name: string;
  username: string;
  email: string;
  address: AddressDto;
  phone: string;
  website: string;
  company: CompanyDto;
}

export interface PostDto {
  userId: UserId;
  id: PostId;
  title: string;
  body: string;
}

export interface CommentDto {
  postId: PostId;
  id: CommentId;
  name: string;
  email: string;
  body: string;
}

export interface TodoDto {
  userId: UserId;
  id: TodoId;
  title: string;
  completed: boolean;
}
