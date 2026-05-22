/* eslint-disable unicorn/custom-error-definition */
export class AppException extends Error {
	public constructor(
		message: string,
		public readonly cause?: unknown
	) {
		super(message);
		this.name = "AppException";
	}
}
