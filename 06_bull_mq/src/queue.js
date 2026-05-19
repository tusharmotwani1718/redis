import {Queue} from 'bullmq';


const connection = {
  host: 'localhost',
  port: 6379,
};

// this is the queue that will be used to store the email jobs
const emailQueue = new Queue('email', {connection});

export {
    emailQueue,
    connection
}