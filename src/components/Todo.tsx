import { Todo } from "@prisma/client";
import { api } from "../utils/api";

export default function TodoComponent({ todo }: { todo: Todo }) {
  const { id, text, done } = todo;

  //Mutations utilizadas para mudar a propriedade "done" e apagar o todo
  const trpc = api.useContext();

  const { mutate: doneMutation } = api.todo.toggle.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            className="h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            type="checkbox"
            name="done"
            id={id}
            checked={done}
            onChange={(e) => {
              doneMutation({ id, done: e.target.checked });
            }}
          />
          <label
            htmlFor="done"
            className={`cursor-pointer ${done ? "line-through" : ""}`}
          >
            {text}
          </label>
        </div>
        <button
          className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          onClick={() => {
            deleteMutation(id);
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
}
