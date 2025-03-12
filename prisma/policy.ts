import { z } from "zod";

import { PrismaClient } from "@prisma/client";
import { withPolicy } from "@prisma/extension-policy";

export const prisma = new PrismaClient().$extends(
  withPolicy({
    rules: {
      room: {
        create: true,
        update: true,
      },
      message: {
        create: true,
        read: true,
      },
      $allModels: false,
    },
    contextSchema: z.object({}),
  })
);
