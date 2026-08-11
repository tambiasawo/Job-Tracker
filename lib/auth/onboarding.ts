export const NEW_USER_QUERY_PARAM = "type";
export const NEW_USER_QUERY_VALUE = "new_user";

export function isNewUserSignup(searchParams: URLSearchParams): boolean {
  return searchParams.get(NEW_USER_QUERY_PARAM) === NEW_USER_QUERY_VALUE;
}

export function newUserDashboardUrl(): string {
  return `/?${NEW_USER_QUERY_PARAM}=${NEW_USER_QUERY_VALUE}`;
}
