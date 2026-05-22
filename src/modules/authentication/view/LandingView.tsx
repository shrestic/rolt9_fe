import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { LoginButton } from "@/modules/authentication/components/LoginButton";

const MotionBox = motion(Box);

export function LandingView(): ReactElement {
	return (
		<Box
			alignItems="center"
			bg="white"
			display="flex"
			justifyContent="center"
			minH="100vh"
			overflow="hidden"
			position="relative"
		>
			{/* Background gradient blobs */}
			<Box
				background="radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.08) 60%, transparent 80%)"
				borderRadius="full"
				h="500px"
				left="-10%"
				pointerEvents="none"
				position="absolute"
				top="-20%"
				w="500px"
			/>
			<Box
				background="radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 60%, transparent 80%)"
				borderRadius="full"
				bottom="-20%"
				h="600px"
				pointerEvents="none"
				position="absolute"
				right="-10%"
				w="600px"
			/>

			<Center position="relative" zIndex={1}>
				<VStack spacing={7}>
					{/* Animated bot emoji */}
					<MotionBox
						animate={{ y: [0, -8, 0] }}
						fontSize="5xl"
						transition={{
							duration: 2.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						🤖
					</MotionBox>

					{/* Gradient heading */}
					<Heading
						as="h1"
						bgClip="text"
						bgGradient="linear(to-r, pink.500, purple.500, blurple.500)"
						fontSize={["4xl", "5xl", "6xl"]}
						fontWeight="extrabold"
						letterSpacing="tight"
					>
						rolt9
					</Heading>

					<Text
						color="gray.600"
						fontSize={["md", "lg"]}
						lineHeight="tall"
						maxW="360px"
						textAlign="center"
					>
						Spin up your own Discord bot in seconds.{" "}
						<Text as="span" color="gray.800" fontWeight="medium">
							No code. No hassle.
						</Text>
					</Text>

					<LoginButton />
				</VStack>
			</Center>
		</Box>
	);
}
