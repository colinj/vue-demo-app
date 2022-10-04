export type Id<T> = number & { __type?: T };

export type UserId = Id<"user">;
export type PostId = Id<"post">;
export type CommentId = Id<"comment">;
export type TodoId = Id<"todo">;
export type LoginUserId = Id<"loginUser">;
