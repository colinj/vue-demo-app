import { useHttp } from "./_http";
import type { CommentDto, PostDto, PostId, UserDto, UserId } from "@/types";

interface UserIdParams {
  userId: UserId;
}

interface PostIdParams {
  postId: PostId;
}

const byUserId = ({ userId }: UserIdParams) => ({ params: { userId } });
const byPostId = ({ postId }: PostIdParams) => ({ params: { postId } });

const { GET } = useHttp();

export default {
  getUsers: GET("users")<UserDto[]>,
  getUser: GET("users/{userId}")<UserDto>,

  getPosts: GET("posts", byUserId)<PostDto[]>,
  getPost: GET("posts/{postId}")<PostDto>,

  getComments: GET("comments", byPostId)<CommentDto[]>,
};
