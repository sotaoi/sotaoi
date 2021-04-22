abstract class Job {
  abstract async handle(): Promise<void>;
}

export { Job };
