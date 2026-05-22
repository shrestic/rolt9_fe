import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, type ReactElement, type ReactNode } from "react";
import { RepositoriesProvider } from "@/di/RepositoriesProvider";
import { theme } from "@/theme";

const queryClient = new QueryClient();

export const AppProviders = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => (
	<ChakraProvider theme={theme}>
		<QueryClientProvider client={queryClient}>
			<RepositoriesProvider>
				<Suspense
					fallback={
						<Center minH="100vh">
							<Spinner color="purple.500" size="xl" thickness="4px" />
						</Center>
					}
				>
					{children}
				</Suspense>
			</RepositoriesProvider>
		</QueryClientProvider>
	</ChakraProvider>
);
