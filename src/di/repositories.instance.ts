import { createRepositories } from "./repositories";
import type { Repositories } from "./types";

let instance: Repositories | null = null;

export const getRepositories = (): Repositories =>
	(instance ??= createRepositories());
