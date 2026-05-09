import cron from "node-cron";
import Subscription from "../models/Subscription.model.js";

// runs every hour
cron.schedule("0 * * * *", async () => {
  console.log("Checking expired subscriptions...");

  const now = new Date();

  const result = await Subscription.updateMany(
    {
      status: "active",
      endDate: { $lt: now },
    },
    {
      $set: { status: "expired" },
    }
  );

  console.log(`Expired ${result.modifiedCount} subscriptions`);
});