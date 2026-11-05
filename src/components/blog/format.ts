const dateFmt = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" });

export const formatPostDate = (iso: string | null): string => (iso ? dateFmt.format(new Date(iso)) : "");
