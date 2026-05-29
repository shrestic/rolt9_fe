import { Box } from "@chakra-ui/react";
import type { CSSProperties, ReactElement } from "react";
import type { RankCardTheme } from "@/data/models/leveling";

type Props = {
	theme: RankCardTheme;
	username?: string;
	rank?: number;
	level?: number;
	totalXp?: number;
	xpIntoLevel?: number;
	xpForNextLevel?: number;
};

// Approximates the BE Pillow render (CARD_WIDTH=800, CARD_HEIGHT=240).
// Pixel-perfect parity isn't the goal — we only need a faithful color/layout
// preview so admins can iterate on the theme without round-tripping the API.
function backgroundStyle(theme: RankCardTheme): CSSProperties {
	if (theme.bgType === "image" && theme.bgImageUrl) {
		return {
			backgroundImage: `url(${theme.bgImageUrl})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
		};
	}
	if (theme.bgType === "gradient") {
		return {
			background: `linear-gradient(90deg, ${theme.bgColor1}, ${theme.bgColor2})`,
		};
	}
	return { backgroundColor: theme.bgColor1 };
}

export function RankCardPreview({
	theme,
	username = "preview-user",
	rank = 1,
	level = 5,
	totalXp = 600,
	xpIntoLevel = 100,
	xpForNextLevel = 255,
}: Props): ReactElement {
	const safeDenominator = xpForNextLevel > 0 ? xpForNextLevel : 1;
	const rawPercent = (xpIntoLevel / safeDenominator) * 100;
	const fillPercent = Math.max(0, Math.min(100, rawPercent));

	const cardStyle: CSSProperties = {
		width: "100%",
		maxWidth: "560px",
		aspectRatio: "800 / 240",
		borderRadius: "16px",
		padding: "24px 28px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		color: theme.textColor,
		boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
		overflow: "hidden",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		...backgroundStyle(theme),
	};

	const topRowStyle: CSSProperties = {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "baseline",
		gap: "12px",
	};

	const usernameStyle: CSSProperties = {
		fontSize: "clamp(18px, 3.2vw, 28px)",
		fontWeight: 700,
		letterSpacing: "0.5px",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	};

	const rankStyle: CSSProperties = {
		fontSize: "clamp(14px, 2.2vw, 18px)",
		fontWeight: 600,
		opacity: 0.9,
		whiteSpace: "nowrap",
	};

	const midRowStyle: CSSProperties = {
		display: "flex",
		gap: "24px",
		fontSize: "clamp(13px, 2vw, 16px)",
		fontWeight: 500,
		opacity: 0.95,
	};

	const barTrackStyle: CSSProperties = {
		height: "24px",
		borderRadius: "12px",
		backgroundColor: "rgba(0,0,0,0.35)",
		overflow: "hidden",
	};

	const barFillStyle: CSSProperties = {
		width: `${fillPercent}%`,
		height: "100%",
		backgroundColor: theme.accentColor,
		transition: "width 120ms ease-out",
	};

	const footerStyle: CSSProperties = {
		marginTop: "6px",
		fontSize: "clamp(11px, 1.6vw, 13px)",
		opacity: 0.85,
		textAlign: "right",
	};

	return (
		<Box display="flex" justifyContent="center" width="100%">
			<div style={cardStyle}>
				<div style={topRowStyle}>
					<div style={usernameStyle}>{username}</div>
					<div style={rankStyle}>RANK #{rank}</div>
				</div>

				<div style={midRowStyle}>
					<div>LEVEL {level}</div>
					<div>XP {totalXp.toLocaleString()}</div>
				</div>

				<div>
					<div style={barTrackStyle}>
						<div style={barFillStyle} />
					</div>
					<div style={footerStyle}>
						{xpIntoLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
					</div>
				</div>
			</div>
		</Box>
	);
}
