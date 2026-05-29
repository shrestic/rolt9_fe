import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { gradients } from "./tokens";

export const theme = extendTheme({
	colors,
	semanticTokens: {
		colors: {
			"bg.canvas": "white",
			"bg.surface": "white",
			"bg.muted": "gray.50",
			"text.default": "gray.800",
			"text.muted": "gray.600",
			"text.subtle": "gray.500",
			"text.inverted": "white",
			"text.danger": "red.500",
			"border.default": "gray.200",
			"border.subtle": "gray.100",
			"accent.primary": "purple.500",
			"accent.primaryActive": "purple.700",
		},
	},
	components: {
		Button: {
			variants: {
				gradient: {
					bgGradient: gradients.brand,
					color: "text.inverted",
					_hover: {
						bgGradient: gradients.brandHover,
						boxShadow: "lg",
						transform: "translateY(-1px)",
					},
					_active: {
						bgGradient: gradients.brandActive,
					},
					transition: "all 0.2s",
				},
			},
		},
	},
	styles: {
		global: {
			body: {
				bg: "bg.canvas",
				color: "text.default",
			},
			"*": {
				transition: "all 0.2s ease-in-out",
			},
			"::-webkit-scrollbar": {
				width: "8px",
			},
			"::-webkit-scrollbar-track": {
				background: "rgba(0, 0, 0, 0.05)",
				borderRadius: "4px",
			},
			"::-webkit-scrollbar-thumb": {
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				borderRadius: "4px",
			},
			"::-webkit-scrollbar-thumb:hover": {
				background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
			},
		},
	},
});
