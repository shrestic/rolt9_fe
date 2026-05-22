import { AppException } from "./app.exception";

export class UnauthorizedException extends AppException {
	public constructor(cause?: unknown) {
		super("Not authenticated", cause);
		this.name = "UnauthorizedException";
	}
}
