import { z } from "zod";

export const signupInput = z.object({
  username: z.string(),
  password: z.string()
})

export type signupparams = z.infer<typeof signupInput>;

