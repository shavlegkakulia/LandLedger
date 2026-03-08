import { z } from "zod";

const phoneRegex = /^(\+995|0)?[5-9]\d{8}$/;

export const profileSchema = z.object({
  first_name: z.string().min(2, "სახელი მინ. 2 სიმბოლო").max(50, "სახელი მაქს. 50 სიმბოლო"),
  last_name: z.string().min(2, "გვარი მინ. 2 სიმბოლო").max(50, "გვარი მაქს. 50 სიმბოლო"),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  birth_date: z
    .string().optional().nullable()
    .refine((v) => {
      if (!v) return true;
      const d = new Date(v);
      const age = new Date().getFullYear() - d.getFullYear();
      return d <= new Date() && age <= 120;
    }, "არასწორი დაბადების თარიღი"),
  phone: z
    .string().optional().nullable()
    .refine((v) => !v || phoneRegex.test(v.replace(/\s/g, "")), "ფორმატი: +995 5XX XXX XXX"),
  address: z.string().max(300, "მაქს. 300 სიმბოლო").optional().nullable(),
  email: z.string().email("არასწორი ელ-ფოსტა").optional().nullable().or(z.literal("")),
  show_phone: z.boolean(),
  show_address: z.boolean(),
  show_gender: z.boolean(),
  show_birth_date: z.boolean(),
  show_email: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
