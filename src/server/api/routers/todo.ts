import { z } from "zod";
import { todoInput } from "~/types";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Input } from "postcss";

export const todoRouter = createTRPCRouter({
  //  GetAll ToDos
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return todos.map(({ id, text, done }) => ({ id, text, done }));
  }),

  //  Criar um ToDo
  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  //  Apagar ToDo
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  //  TOGGLE/UPDATE ToDo (O SEU ESTADO DE 'DONE')
  toggle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input: { id, done } }) => {
      return ctx.prisma.todo.update({
        where: {
          id,
        },
        data: {
          done,
        },
      });
    }),
});
