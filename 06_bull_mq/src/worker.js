import { Worker } from "bullmq";
import { connection } from "./queue.js";

// consume the email jobs from the queue and process them
const workerConsumer = async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    // Simulate email sending process
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay of 2 seconds
    console.log(`Job ${job.id} completed successfully.`);
}



const emailWorker = new Worker(
    "send-mails-worker",
    workerConsumer,
    { connection }
)


emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} has been completed.`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`Job ${job.id} has failed with error:`, err);
});