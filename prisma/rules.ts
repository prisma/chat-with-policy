import { z } from "zod";

import { PrismaClient } from "@prisma/client";
import { defineRules } from "@prisma/security-rules";

export default defineRules({
  prisma: new PrismaClient(),
  rules: {
    room: {
      create: true,
      update: true,
    },
    message: {
      read: true,
      create: true,
    },
    $allModels: false,
  },
  contextSchema: z.object({}),
})
