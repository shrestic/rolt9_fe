import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	Input,
	Select,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiSelect } from "@/components/MultiSelect";
import { PlaceholderHint } from "@/modules/commands/components/PlaceholderHint";
import { PreviewPanel } from "@/modules/commands/components/PreviewPanel";
import { usePreviewCommand } from "@/modules/commands/hooks/useCommands";
import type {
	CommandPreviewInput,
	CustomCommand,
	CustomCommandInput,
} from "@/data/models/command";
import type { Channel, Role } from "@/data/models/guild";

const schema = z
	.object({
		trigger: z
			.string()
			.min(1, "Trigger is required")
			.regex(/^\S+$/, "No spaces allowed"),
		responseType: z.enum(["text", "embed"]),
		responseText: z.string().optional(),
		embedTitle: z.string().optional(),
		embedDescription: z.string().optional(),
		embedColor: z.string().optional(),
		cooldownSeconds: z.number().min(0),
		allowedRoleIds: z.array(z.string()),
		allowedChannelIds: z.array(z.string()),
		enabled: z.boolean(),
	})
	.refine((v) => v.responseType !== "text" || Boolean(v.responseText), {
		message: "Response text is required",
		path: ["responseText"],
	})
	.refine((v) => v.responseType !== "embed" || Boolean(v.embedDescription), {
		message: "Embed description is required",
		path: ["embedDescription"],
	});

type FormValues = z.infer<typeof schema>;

type Props = {
	initial?: CustomCommand;
	roles: Array<Role>;
	channels: Array<Channel>;
	onSubmit: (input: CustomCommandInput) => void;
	onCancel: () => void;
	isSaving?: boolean;
};

// Build the BE preview payload from the current form values. The preview
// endpoint understands the same shape as the create/update endpoint but only
// uses the response_* / embed fields.
const previewInputFrom = (v: FormValues): CommandPreviewInput => ({
	responseType: v.responseType,
	responseText: v.responseType === "text" ? (v.responseText ?? "") : null,
	embed:
		v.responseType === "embed"
			? {
					title: v.embedTitle || null,
					description: v.embedDescription || null,
					color: v.embedColor || null,
					imageUrl: null,
					footer: null,
				}
			: null,
});

export const CommandForm = ({
	initial,
	roles,
	channels,
	onSubmit,
	onCancel,
	isSaving,
}: Props): ReactElement => {
	const { guildId } = useParams({ from: "/dashboard/$guildId/commands" });
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			trigger: initial?.trigger ?? "",
			responseType: initial?.responseType ?? "text",
			responseText: initial?.responseText ?? "",
			embedTitle: initial?.embed?.title ?? "",
			embedDescription: initial?.embed?.description ?? "",
			embedColor: initial?.embed?.color ?? "",
			cooldownSeconds: initial?.cooldownSeconds ?? 0,
			allowedRoleIds: initial?.allowedRoleIds ?? [],
			allowedChannelIds: initial?.allowedChannelIds ?? [],
			enabled: initial?.enabled ?? true,
		},
	});

	// Watch every value the preview cares about — react-hook-form re-renders
	// on each change, the preview hook debounces the network call by 300 ms.
	// We always fire the preview (even for an empty draft) so the BE returns
	// the placeholder list — admins need to see what {tokens} exist BEFORE
	// they start typing, not after.
	const formValues = watch();
	const previewInput = previewInputFrom(formValues);
	const preview = usePreviewCommand(guildId, previewInput, true);
	const placeholders = preview.data?.placeholders ?? [];

	const responseType = formValues.responseType;

	const submit = (v: FormValues): void => {
		onSubmit({
			trigger: v.trigger,
			responseType: v.responseType,
			responseText: v.responseType === "text" ? (v.responseText ?? "") : null,
			embed:
				v.responseType === "embed"
					? {
							title: v.embedTitle || null,
							description: v.embedDescription || null,
							color: v.embedColor || null,
							imageUrl: null,
							footer: null,
						}
					: null,
			allowedRoleIds: v.allowedRoleIds,
			allowedChannelIds: v.allowedChannelIds,
			cooldownSeconds: v.cooldownSeconds,
			enabled: v.enabled,
		});
	};

	return (
		<form onSubmit={handleSubmit(submit)}>
			{/*
			 * Two-column layout when there's space: form on the left, live preview on
			 * the right. Stacks vertically on narrow screens so the form stays usable.
			 */}
			<Grid gap={6} templateColumns={{ base: "1fr", lg: "1fr 1fr" }}>
				<Stack spacing={4}>
					<FormControl isInvalid={Boolean(errors.trigger)}>
						<FormLabel>Trigger (without prefix)</FormLabel>
						<Input placeholder="rules" {...register("trigger")} />
						<FormErrorMessage>{errors.trigger?.message}</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>Response type</FormLabel>
						<Select {...register("responseType")}>
							<option value="text">Plain text</option>
							<option value="embed">Embed</option>
						</Select>
					</FormControl>

					{responseType === "text" ? (
						<FormControl isInvalid={Boolean(errors.responseText)}>
							<FormLabel>Response text</FormLabel>
							<Textarea
								placeholder="Hi {user}, welcome to {server}!"
								{...register("responseText")}
							/>
							<FormErrorMessage>
								{errors.responseText?.message}
							</FormErrorMessage>
							{/* Discoverable list of {tokens} the bot can substitute.
							    Always visible so admins know what's available before typing. */}
							<PlaceholderHint placeholders={placeholders} />
						</FormControl>
					) : (
						<>
							<FormControl>
								<FormLabel>Embed title</FormLabel>
								<Input {...register("embedTitle")} />
							</FormControl>
							<FormControl isInvalid={Boolean(errors.embedDescription)}>
								<FormLabel>Embed description</FormLabel>
								<Textarea {...register("embedDescription")} />
								<FormErrorMessage>
									{errors.embedDescription?.message}
								</FormErrorMessage>
								<PlaceholderHint placeholders={placeholders} />
							</FormControl>
							<FormControl>
								<FormLabel>Embed color (hex)</FormLabel>
								<Input placeholder="#5865F2" {...register("embedColor")} />
							</FormControl>
						</>
					)}

					<FormControl>
						<FormLabel>Cooldown (seconds)</FormLabel>
						<Input
							type="number"
							{...register("cooldownSeconds", { valueAsNumber: true })}
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Allowed roles (empty = everyone)</FormLabel>
						{/* Controller bridges react-hook-form to MultiSelect's value/onChange.
						    Without it, the native register API would only work for inputs/selects. */}
						<Controller
							control={control}
							name="allowedRoleIds"
							render={({ field }) => (
								<MultiSelect
									emptyLabel="Everyone"
									options={roles.map((r) => ({ value: r.id, label: r.name }))}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Allowed channels (empty = all)</FormLabel>
						<Controller
							control={control}
							name="allowedChannelIds"
							render={({ field }) => (
								<MultiSelect
									emptyLabel="All channels"
									value={field.value}
									options={channels.map((c) => ({
										value: c.id,
										label: `#${c.name}`,
									}))}
									onChange={field.onChange}
								/>
							)}
						/>
					</FormControl>

					<Checkbox defaultChecked {...register("enabled")}>
						Enabled
					</Checkbox>

					<Stack direction="row">
						<Button colorScheme="purple" isLoading={isSaving} type="submit">
							Save
						</Button>
						<Button variant="ghost" onClick={onCancel}>
							Cancel
						</Button>
					</Stack>
				</Stack>

				<Box>
					<PreviewPanel
						isError={preview.isError}
						isLoading={preview.isFetching && !preview.data}
						preview={preview.data}
					/>
				</Box>
			</Grid>
		</form>
	);
};
