import {
	Box,
	Button,
	Heading,
	HStack,
	IconButton,
	Input,
	Text,
	Textarea,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useState, type ChangeEvent, type ReactElement } from "react";
import {
	useCreateKbEntry,
	useDeleteKbEntry,
	useKbEntries,
} from "@/modules/ai/hooks/useAi";

type Props = {
	guildId: string;
};

// Admin CRUD for the /ask knowledge base — list, add (title + content), delete.
export function KbManager({ guildId }: Props): ReactElement {
	const entries = useKbEntries(guildId);
	const create = useCreateKbEntry(guildId);
	const remove = useDeleteKbEntry(guildId);
	const toast = useToast();

	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");

	const add = (): void => {
		if (!title.trim() || !content.trim()) return;
		create.mutate(
			{ title, content },
			{
				onSuccess: () => {
					setTitle("");
					setContent("");
					toast({ status: "success", title: "Đã thêm" });
				},
			}
		);
	};

	return (
		<VStack align="stretch" spacing={4}>
			<Heading size="sm">Kho tri thức (cho /ask)</Heading>

			<VStack align="stretch" spacing={3}>
				{(entries.data ?? []).map((entry) => (
					<HStack
						key={entry.id}
						align="start"
						bg="bg.muted"
						borderRadius="lg"
						justify="space-between"
						p={3}
					>
						<Box>
							<Text fontWeight="semibold">{entry.title}</Text>
							<Text color="fg.muted" fontSize="sm">
								{entry.content}
							</Text>
						</Box>
						<IconButton
							aria-label="Xóa"
							size="sm"
							variant="ghost"
							onClick={() => {
								remove.mutate(entry.id);
							}}
						>
							✕
						</IconButton>
					</HStack>
				))}
				{(entries.data ?? []).length === 0 && (
					<Text color="fg.muted" fontSize="sm">
						Chưa có mục nào.
					</Text>
				)}
			</VStack>

			<VStack align="stretch" bg="bg.muted" borderRadius="lg" p={4} spacing={3}>
				<Input
					placeholder="Tiêu đề (vd: Giờ mở cửa)"
					value={title}
					onChange={(event_: ChangeEvent<HTMLInputElement>) => {
						setTitle(event_.target.value);
					}}
				/>
				<Textarea
					placeholder="Nội dung…"
					rows={3}
					value={content}
					onChange={(event_: ChangeEvent<HTMLTextAreaElement>) => {
						setContent(event_.target.value);
					}}
				/>
				<Button
					alignSelf="flex-start"
					isLoading={create.isPending}
					onClick={add}
				>
					Thêm mục
				</Button>
			</VStack>
		</VStack>
	);
}
