export const PER_PAGE = 30;

export type BlogContent = {
    slug: string;
    frontmatter: {
        title: string;
        date: string;
        datetime: number;
        updated: string;
        updatedtime: number;
        tags: string[];
        thumbnail: string | null;
    };
    content: string;
};
