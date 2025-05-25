
import { z } from "zod";

export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Notificação Extrajudicial", "Acordo Extrajudicial"]),
  brand: z.string(),
  recognizedFields: z.array(z.string()),
  docxUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Template = z.infer<typeof TemplateSchema>;
