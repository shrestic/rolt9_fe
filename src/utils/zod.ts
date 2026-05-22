import { z } from "zod";
import { objectToCamel } from "ts-case-convert";

/** A z.object whose input is deep-camelCased before validation. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const camelObject = <T extends z.ZodRawShape>(shape: T) =>
	z.preprocess((v) => objectToCamel(v as object), z.object(shape));
