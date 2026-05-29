import { createFileRoute } from "@tanstack/react-router";
import { CurrencyView } from "@/modules/currency/view/CurrencyView";

export const Route = createFileRoute("/dashboard/$guildId/currency")({
	component: CurrencyView,
});
