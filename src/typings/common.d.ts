type PageProps = {
    params: { lang: string };
};

type IconSvgProps = React.SVGProps<SVGSVGElement> & {
    size?: number;
};

type TableColumnType = {
    name: string;
    uid: string;
    sortable?: boolean;
};
