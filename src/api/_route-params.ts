import type { UserId, PostId, CommentId, TodoId } from "@/types";

interface RouteParams {
  postId: PostId;
  commentId: CommentId;
  todoId: TodoId;
  userId: UserId;
}

export type ExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}{${infer Param}}/${infer Rest}`
  ? { [K in Param | keyof ExtractRouteParams<Rest>]: K extends keyof RouteParams ? RouteParams[K] : string }
  : T extends `${string}{${infer Param}}`
  ? { [K in Param]: K extends keyof RouteParams ? RouteParams[K] : string }
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {};
