import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from "./generated/prisma/index.js"
import { cors } from 'hono/cors'


const app = new Hono()
export const db = new PrismaClient()

app.use('*', cors());
app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  await next();
});

db.$connect()
	.then(() => {
		console.log("Connected to the database");
	})
	.catch((error) => {
		console.error("Error connecting to the database:", error);
	});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
