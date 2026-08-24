declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    githubId?: string;
  }
}

export type LoginData = {
  email: string;
  password?: string;
};

export type RegisterData = {
  email: string;
  password?: string;
  name?: string;
  image?: string;
};
