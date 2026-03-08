import { z } from "zod";

export const parcelSchema = z.object({
  cadastral_code: z
    .string()
    .min(1, "საკადასტრო კოდი სავალდებულოა")
    .regex(
      /^\d{2}\.\d{2}\.\d{2}\.\d{3}(\.\d{3})?$/,
      "ფორმატი: 01.10.01.001 ან 01.10.01.001.001"
    ),
  address: z
    .string()
    .min(5, "მისამართი მინ. 5 სიმბოლო")
    .max(300, "მისამართი მაქს. 300 სიმბოლო"),
  area_sqm: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) > 0),
      "ფართობი დადებითი რიცხვი უნდა იყოს"
    ),
  region: z.string().max(100, "მაქს. 100 სიმბოლო").optional(),
  municipality: z.string().max(100, "მაქს. 100 სიმბოლო").optional(),
  notes: z.string().max(1000, "შენიშვნა მაქს. 1000 სიმბოლო").optional(),
});

export type ParcelFormValues = z.infer<typeof parcelSchema>;
