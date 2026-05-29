import {
	Box,
	Button,
	Checkbox,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tag,
	TagCloseButton,
	TagLabel,
	Text,
} from "@chakra-ui/react";
import type { ReactElement } from "react";

export type MultiSelectOption = {
	value: string;
	label: string;
};

type Props = {
	options: Array<MultiSelectOption>;
	value: Array<string>;
	onChange: (next: Array<string>) => void;
	placeholder?: string;
	// Text shown in the button when nothing is selected (e.g. "everyone" or "all channels")
	// — overrides the generic placeholder so the meaning of "empty" is clear per field.
	emptyLabel?: string;
};

// Dropdown multi-select with checkboxes. Replaces native <Select multiple>,
// which renders as a confusing scrollable list that needs Cmd+click to toggle.
//
// Click the button → menu opens with one checkbox per option. Selected items
// are shown as removable tags in the button. Empty selection shows
// `emptyLabel` so admins know what "nothing selected" means in context.
export const MultiSelect = ({
	options,
	value,
	onChange,
	placeholder = "Select…",
	emptyLabel,
}: Props): ReactElement => {
	const selected = options.filter((o) => value.includes(o.value));

	const toggle = (next: string): void => {
		onChange(
			value.includes(next) ? value.filter((v) => v !== next) : [...value, next]
		);
	};

	const remove = (next: string): void => {
		onChange(value.filter((v) => v !== next));
	};

	return (
		// closeOnSelect=false keeps the menu open while the user toggles multiple
		// boxes; matchWidth makes the dropdown the same width as the button so
		// long labels don't overflow.
		<Menu matchWidth closeOnSelect={false}>
			<MenuButton
				as={Button}
				h="auto"
				justifyContent="flex-start"
				minH="40px"
				textAlign="left"
				variant="outline"
				w="100%"
				whiteSpace="normal"
			>
				{selected.length === 0 ? (
					<Text color="text.subtle" fontWeight="normal">
						{emptyLabel ?? placeholder}
					</Text>
				) : (
					<HStack flexWrap="wrap" spacing={1}>
						{selected.map((opt) => (
							<Tag key={opt.value} colorScheme="purple" size="md">
								<TagLabel>{opt.label}</TagLabel>
								{/* Remove tag without opening the menu (stopPropagation). */}
								<TagCloseButton
									onClick={(event) => {
										event.stopPropagation();
										remove(opt.value);
									}}
								/>
							</Tag>
						))}
					</HStack>
				)}
			</MenuButton>
			<MenuList maxH="300px" overflowY="auto">
				{options.length === 0 ? (
					<Box color="text.subtle" fontSize="sm" px={3} py={2}>
						No options available
					</Box>
				) : (
					options.map((opt) => (
						<MenuItem
							key={opt.value}
							onClick={() => {
								toggle(opt.value);
							}}
						>
							{/* pointerEvents=none so the click goes to MenuItem (which we
							     own) instead of toggling the checkbox in a separate handler. */}
							<Checkbox
								isChecked={value.includes(opt.value)}
								mr={2}
								pointerEvents="none"
							>
								{opt.label}
							</Checkbox>
						</MenuItem>
					))
				)}
			</MenuList>
		</Menu>
	);
};
