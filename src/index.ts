import express from "express";
import { serve } from "inngest/express.js";
import { Inngest } from "inngest";

const app = express();
const inngest = new Inngest({ name: "Test app" });

app.use(express.json());

app.use(async (req, _res, next) => {
  console.log(req.method);
  console.log(req.url);
  console.log(req.body);
  next();
});

const helloWorld = inngest.createFunction(
  { name: "Hello World" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("1s");
    // randomly throw an error
    if (Math.random() > 0.5) {
      throw new Error("Random error");
    }
    return { event, body: "Hello, World!" };
  }
);

app.use(
  // Expose the middleware on our recommended path at `/api/inngest`.
  "/api/inngest",
  serve(inngest, [helloWorld])
);

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
