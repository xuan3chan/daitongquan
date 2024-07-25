
export interface Post {
    _id: string;
    userId: string;
    content: string;
    commentCount: number;
    reactionCount: number;
    status: string;
    isShow: boolean;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
    postImage: string;
    userReaction: string;
    $assertPopulated: string;
    $clone: string;
  }
  