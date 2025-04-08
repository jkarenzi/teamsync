import app from './app'
import { AppDataSource } from './dbConfig'
import dotenv from "dotenv";
import cron from 'node-cron'
import { checkForDueAssignments } from './utils/checkForDueAssignments';
import { checkForDueTasks } from './utils/checkForDueTasks';
import logoutInactiveUsers from './utils/logoutInactiveUsers';
dotenv.config();


const { PORT = 4000 } = process.env;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on " + PORT);
      cron.schedule('*/5 * * * *', checkForDueAssignments)
      cron.schedule('*/5 * * * *', checkForDueTasks)
      cron.schedule('0 */4 * * *', () => logoutInactiveUsers())
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));