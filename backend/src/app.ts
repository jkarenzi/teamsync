import "reflect-metadata";
import express, { type Request, type Response } from "express";
import routes from './routes/index'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './docs/config'
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());
app.use("/api", routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

export default app