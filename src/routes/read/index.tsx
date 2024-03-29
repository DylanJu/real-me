import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { drizzle } from "drizzle-orm/d1";
import { journals } from "~/schema";
import { useAuthSession } from '~/routes/plugin@auth';

export const useProductDetails = routeLoader$(async (requestEvent) => {
  if (!requestEvent.platform.env?.DB) throw new Error("No DB");

  const db = drizzle(requestEvent.platform.env.DB);
  const result = await db.select().from(journals).all()
  
  return { success: true, content: JSON.stringify(result) };
});

export default component$(() => {
  const session = useAuthSession();

  const signal = useProductDetails(); 
  return (
    <div>
      <h1>Read</h1>
      <div>{signal.value.content}</div>
      <div>{session.value?.user?.email}</div>
      <div>{session.value?.user?.name}</div>
      <div>{session.value?.user?.image}</div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Read",
};
