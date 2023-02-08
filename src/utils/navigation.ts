export const navigateToPage =
    (page: string, navigate: any, checkAndRefreshToken: any) =>
        checkAndRefreshToken(() => navigate(page));
