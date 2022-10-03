import type { CommentDto, PostDto, PostId, UserDto, UserId } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api";

export const useUserStore = defineStore("user", () => {
  const user = ref<Partial<UserDto>>({});
  const users = ref<UserDto[]>([]);
  const posts = ref<PostDto[]>([]);
  const comments = ref<CommentDto[]>([]);

  const getUsers = async () => {
    try {
      const response = await api.getUsers();
      users.value = response.status === 200 ? response.data : [];
    } catch (err) {
      console.error(err);
    }
  };

  const getUser = async (userId: UserId) => {
    try {
      const response = await api.getUser({ userId });
      user.value = response.status === 200 ? response.data : {};
    } catch (err) {
      console.error(err);
    }
  };

  const getPosts = async (userId: UserId) => {
    try {
      const response = await api.getPosts({ userId });
      posts.value = response.status === 200 ? response.data : [];
    } catch (err) {
      console.error(err);
    }
  };

  const getComments = async (postId: PostId) => {
    try {
      const response = await api.getComments({ postId });
      comments.value = response.status === 200 ? response.data : [];
    } catch (err) {
      console.error(err);
    }
  };

  return {
    user,
    users,
    posts,
    comments,
    getUser,
    getUsers,
    getPosts,
    getComments,
  };
});
