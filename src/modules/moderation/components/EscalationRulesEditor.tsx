import { Box, Button, HStack, Input, Select, VStack } from "@chakra-ui/react";
import type { ChangeEvent, ReactElement } from "react";
import type { EscalationRule } from "@/data/models/moderation";

type Props = {
	rules: Array<EscalationRule>;
	onChange: (rules: Array<EscalationRule>) => void;
};

export const EscalationRulesEditor = ({ rules, onChange }: Props): ReactElement => {
	const update = (index: number, patch: Partial<EscalationRule>): void => {
		onChange(rules.map((r, index_) => (index_ === index ? { ...r, ...patch } : r)));
	};
	const add = (): void => {
		onChange([...rules, { threshold: rules.length + 1, action: "mute", durationSeconds: 3600 }]);
	};
	const remove = (index: number): void => {
		onChange(rules.filter((_, index_) => index_ !== index));
	};

	return (
		<VStack align="stretch" spacing={2}>
			{rules.map((rule, index) => (
				<HStack key={index}>
					<Input
						aria-label="threshold"
						type="number"
						value={rule.threshold}
						w="80px"
						onChange={(event_: ChangeEvent<HTMLInputElement>) => {
							update(index, { threshold: Number(event_.target.value) });
						}}
					/>
					<Select
						aria-label="action"
						value={rule.action}
						onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
							update(index, { action: event_.target.value as "mute" | "ban" });
						}}
					>
						<option value="mute">mute</option>
						<option value="ban">ban</option>
					</Select>
					{rule.action === "mute" && (
						<Input
							aria-label="duration seconds"
							placeholder="seconds"
							type="number"
							value={rule.durationSeconds ?? 3600}
							w="120px"
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								update(index, { durationSeconds: Number(event_.target.value) });
							}}
						/>
					)}
					<Button
						aria-label="remove rule"
						size="sm"
						onClick={() => {
							remove(index);
						}}
					>
						Remove
					</Button>
				</HStack>
			))}
			<Box>
				<Button
					size="sm"
					variant="outline"
					onClick={() => {
						add();
					}}
				>
					Add rule
				</Button>
			</Box>
		</VStack>
	);
};
