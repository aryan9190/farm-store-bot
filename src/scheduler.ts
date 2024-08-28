import cron from 'node-cron';
import { updatePrices } from './updatePrices';
import fs from 'fs';
import path from 'path';

// Class representing a scheduled job
class Job {
  constructor(
    public name: string,
    public schedule: string,
    public task: () => Promise<void>,
    public active: boolean = true
  ) {}

  start() {
    if (this.active) {
      cron.schedule(this.schedule, this.task, {
        scheduled: true,
        timezone: 'America/New_York'
      });
      console.log(`Job ${this.name} started.`);
    }
  }
}

// Scheduler class to manage jobs
class Scheduler {
  private jobs: Job[] = [];
  private jobFilePath: string = path.join(__dirname, 'jobs.json');

  constructor() {
    this.loadJobsFromFile();
  }

  addJob(name: string, schedule: string, task: () => Promise<void>, active: boolean = true) {
    const job = new Job(name, schedule, task, active);
    job.start();
    this.jobs.push(job);
    this.saveJobsToFile();
  }

  // Loads jobs from a file
  loadJobsFromFile() {
    if (fs.existsSync(this.jobFilePath)) {
      const jobsData = JSON.parse(fs.readFileSync(this.jobFilePath, 'utf-8'));
      jobsData.forEach((jobData: any) => {
        this.addJob(jobData.name, jobData.schedule, jobData.task, jobData.active);
      });
    }
  }

  // Saves jobs to a file
  saveJobsToFile() {
    const jobsData = this.jobs.map(job => ({
      name: job.name,
      schedule: job.schedule,
      active: job.active
    }));
    fs.writeFileSync(this.jobFilePath, JSON.stringify(jobsData, null, 2));
  }
}

// Instantiate Scheduler
const scheduler = new Scheduler();

// Add a daily job to update prices at 7:00 AM EST
scheduler.addJob(
  'DailyPriceUpdate',
  '0 7 * * *',
  async () => {
    await updatePrices();
    console.log('Daily price update completed.');
  },
  true
);

export { scheduler };
