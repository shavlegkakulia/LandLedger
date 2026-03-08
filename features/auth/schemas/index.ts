import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს")
  .regex(/[A-Z]/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს")
  .regex(/[a-z]/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ პატარა ასოს")
  .regex(/[^A-Za-z0-9]/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ სპეციალურ სიმბოლოს");

export const loginSchema = z.object({
  email: z.string().email("არასწორი ელ-ფოსტა"),
  password: z.string().min(1, "პაროლი სავალდებულოა"),
});

export const registerSchema = z.object({
  email: z.string().email("არასწორი ელ-ფოსტა"),
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
