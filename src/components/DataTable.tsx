"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Moment from "react-moment";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    useDisclosure,
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";
import { useLocale } from "@react-aria/i18n";
import { useTranslations } from "@/lib/translations";
import { parseDate, parseDateTime } from "@/utils/date";
import { capitalize } from "@/utils/string";
import {
    SearchIcon,
    PlusIcon,
    ChevronDownIcon,
    VerticalDotsIcon,
    EditIcon,
    EyeIcon,
    DeleteIcon,
} from "@/components/Icons";
import Typography from "@/components/Typography";
import { User as UserType } from "@/modules/users/domain/entities";
import ErrorIcon from "@/assets/svg/error.svg";

type AllUserType = Omit<UserType, "joinedDate" | "birthDate"> & {
    joinedDate: string;
    birthDate: string;
};

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    inactive: "danger",
    suspended: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "fullname",
    "accountStatus",
    "address",
    "phoneNumber",
    "birthDate",
    "joinedDate",
    "lastLogin",
    "actions",
];

async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

async function removeData(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "DELETE",
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to remove data");
    }

    return res.json();
}

const DataTable: React.FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslations();
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [listUsers, setListUsers] = React.useState<UserType[]>([]); // Initialize state for users

    const fetchData = async () => {
        const { users } = await getData();

        setListUsers(
            users.map((user: AllUserType) => {
                const modifiedUser = { ...user };

                modifiedUser.birthDate = parseDate(modifiedUser.birthDate);
                modifiedUser.joinedDate = parseDateTime(
                    modifiedUser.joinedDate,
                );

                return modifiedUser;
            }),
        );
    };

    React.useEffect(() => {
        void fetchData().then(() => {});
    }, []);

    const columns: TableColumnType[] = [
        { name: t?.users.columns.id as string, uid: "id", sortable: true },
        {
            name: t?.users.columns.fullname as string,
            uid: "fullname",
            sortable: true,
        },
        {
            name: t?.users.columns.address as string,
            uid: "address",
            sortable: true,
        },
        {
            name: t?.users.columns.phone_number as string,
            uid: "phoneNumber",
            sortable: true,
        },
        {
            name: t?.users.columns.birthdate as string,
            uid: "birthDate",
            sortable: true,
        },
        {
            name: t?.users.columns.joined_date as string,
            uid: "joinedDate",
            sortable: true,
        },
        {
            name: t?.users.columns.last_login as string,
            uid: "lastLogin",
            sortable: true,
        },
        { name: t?.users.columns.email as string, uid: "email" },
        {
            name: t?.users.columns.account_status as string,
            uid: "accountStatus",
            sortable: true,
        },
        { name: t?.users.columns.actions as string, uid: "actions" },
    ];

    const statusOptions = [
        { name: t?.shared.status.active, uid: "active" },
        { name: t?.shared.status.inactive, uid: "inactive" },
        { name: t?.shared.status.suspended, uid: "suspended" },
    ];

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
        new Set([]),
    );
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS),
    );
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "joinedDate",
        direction: "ascending",
    });

    const addToSelection = (value: number) => {
        const newSelectedKeys = new Set(selectedKeys);
        newSelectedKeys.add(value);
        setSelectedKeys(newSelectedKeys);
    };

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid),
        );
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...listUsers];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.fullname.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== statusOptions.length
        ) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.accountStatus),
            );
        }

        return filteredUsers;
    }, [listUsers, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: UserType, b: UserType) => {
            const first = a[sortDescriptor.column as keyof UserType] as number;
            const second = b[sortDescriptor.column as keyof UserType] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const removeUser = async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await removeData(selectedKeys?.values().next().value.toString());
        await fetchData();
    };

    const renderCell = React.useCallback(
        (user: UserType, columnKey: React.Key) => {
            const cellValue = user[columnKey as keyof UserType];

            const option = statusOptions.find((opt) => opt.uid === cellValue);

            switch (columnKey) {
                case "fullname":
                    return (
                        <User
                            avatarProps={{
                                radius: "lg",
                                src: user.avatar,
                                classNames: {
                                    base: "bg-white",
                                },
                            }}
                            description={user.email}
                            name={cellValue as string}
                        >
                            {user.email}
                        </User>
                    );
                case "birthDate":
                    return user?.birthDate;
                case "joinedDate":
                    return user?.joinedDate;
                case "lastLogin":
                    return (
                        <>
                            <Moment fromNow>{user?.lastLogin as Date}</Moment>
                        </>
                    );
                case "accountStatus":
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[user.accountStatus]}
                            size="sm"
                            variant="flat"
                        >
                            {option ? option.name : ""}
                        </Chip>
                    );
                case "actions":
                    return (
                        <div className="relative flex justify-end items-center gap-2">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                    >
                                        <VerticalDotsIcon className="text-default-300" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Actions">
                                    <DropdownItem
                                        onPress={() => {
                                            router.push(
                                                `/${locale}/admin/users/${user.id}/view`,
                                            );
                                        }}
                                    >
                                        <span className="flex items-center">
                                            <EyeIcon className="mr-2" />
                                            {t?.shared.actions.view}
                                        </span>
                                    </DropdownItem>
                                    <DropdownItem
                                        onPress={() => {
                                            router.push(
                                                `/${locale}/admin/users/${user.id}/edit`,
                                            );
                                        }}
                                    >
                                        <span className="flex items-center">
                                            <EditIcon className="mr-2" />
                                            {t?.shared.actions.edit}
                                        </span>
                                    </DropdownItem>
                                    <DropdownItem
                                        onPress={() => {
                                            addToSelection(user?.id as number);
                                            onOpen();
                                        }}
                                    >
                                        <span className="flex items-center">
                                            <DeleteIcon className="mr-2 *:stroke-red-700" />
                                            {t?.shared.actions.delete}
                                        </span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [],
    );

    const onRowsPerPageChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        },
        [],
    );

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder={t?.shared.labels.search}
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                >
                                    {t?.shared.labels.status}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize"
                                    >
                                        {capitalize(status?.name as string)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                >
                                    {t?.shared.labels.columns}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            color="primary"
                            endContent={<PlusIcon />}
                            onPress={() => {
                                router.push(`/${locale}/admin/users/new`);
                            }}
                        >
                            {t?.shared.actions.new}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t?.shared.labels.total.replace(
                            "{{count}}",
                            listUsers.length.toString(),
                        )}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        {t?.shared.labels.rows_per_page}
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        listUsers.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex flex-col md:flex-row justify-between items-center">
                <span className="w-full md:w-[30%] py-4 md:py-0 mb-10 md:mt-0 text-small text-default-400 order-2 md:order-1">
                    {selectedKeys === "all"
                        ? t?.shared.labels.all_items_selected
                        : t?.shared.labels.selected
                              .replace(
                                  "{{selected}}",
                                  selectedKeys.size.toString(),
                              )
                              .replace(
                                  "{{total}}",
                                  filteredItems.length.toString(),
                              )}
                </span>
                {pages && (
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={setPage}
                        className="order-1 md:order-2"
                    />
                )}
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <>
            <Table
                aria-label="Table"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="single"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "actions" ? "center" : "start"
                            }
                            allowsSorting={column.sortable}
                        >
                            {column.name.toUpperCase()}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={t?.shared.labels.not_found}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey) as ReactNode}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="pt-12 pb-5 px-12 flex flex-col items-center justify-center">
                                <ErrorIcon className="w-[120px] *:fill-red-700" />
                                <Typography
                                    variant="h2"
                                    className="text-black font-semibold !text-[24px] md:!text-[38px] text-center mt-2"
                                >
                                    {t?.shared.labels.are_you_sure}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="text-black font-semibold !text-[18px] text-center mt-2"
                                >
                                    {t?.shared.labels.confirm_delete}
                                </Typography>
                            </ModalBody>
                            <ModalFooter className="flex justify-between">
                                <Button
                                    color="primary"
                                    onPress={onClose}
                                    className="text-white text-[16px] font-medium px-8 h-[40px] rounded-full shadow-xl"
                                >
                                    {t?.shared.actions.cancel}
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        void removeUser().then(() => {});
                                        onClose()
                                    }}
                                    className="text-white text-[16px] font-medium px-8 h-[40px] rounded-full shadow-xl"
                                >
                                    {t?.shared.actions.delete}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default DataTable;
