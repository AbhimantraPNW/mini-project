import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  static as static_,
} from "express";
import cors from "cors";
import { PORT } from "./config";
import { SampleRouter } from "./routers/sample.router";
import { AuthRouter } from "./routers/auth.router";
import { EventRouter } from "./routers/event.router";
import { TransactionRouter } from "./routers/transaction.router";
import { ReviewRouter } from "./routers/review.router";
import { join } from "path";

export default class App {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use("/api/assets", static_(join(__dirname, "../public")));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes("/api/")) {
        // 404
        res.status(500).send("Not found !");
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes("/api/")) {
          // console.error('Error : ', err.stack);
          res.status(500).send(err.message);
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const sampleRouter = new SampleRouter();
    const authRouter = new AuthRouter();
    const eventRouter = new EventRouter();
    const transactionRouter = new TransactionRouter();
    const reviewRouter = new ReviewRouter();

    this.app.get("/api", (req: Request, res: Response) => {
      res.send(`Hello, Welcome to Blog API !`);
    });

    this.app.use("/api/samples", sampleRouter.getRouter());
    this.app.use("/api/auth", authRouter.getRouter());
    this.app.use("/api/events", eventRouter.getRouter());
    this.app.use("/api/transactions", transactionRouter.getRouter());
    this.app.use("/api/reviews", reviewRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
