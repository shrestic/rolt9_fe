import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";

export const theme = extendTheme({
	colors,
	components: {
		Button: {
			variants: {
				gradient: {
					bgGradient: "linear(to-r, pink.500, purple.500)",
					color: "white",
					_hover: {
						bgGradient: "linear(to-r, pink.600, purple.600)",
						boxShadow: "lg",
						transform: "translateY(-1px)",
					},
					_active: {
						bgGradient: "linear(to-r, pink.700, purple.700)",
					},
					transition: "all 0.2s",
				},
			},
		},
	},
	styles: {
		global: {
			body: {
				bg: "white",
				color: "gray.800",
			},
		},
	},
});
