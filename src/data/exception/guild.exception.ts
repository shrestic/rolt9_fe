import { AppException } from "./app.exception";

export class ForbiddenException extends AppException {
	public constructor(cause?: unknown) {
		super("You don't have permission to configure this server.", cause);
		this.name = "ForbiddenException";
	}
}
