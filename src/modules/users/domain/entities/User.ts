export default interface User {
    id?: number;
    fullname: string;
    email: string;
    password: string;
    joinedDate: Date;
    accountStatus: "active" | "inactive" | "suspended";
    birthDate: Date;
    address: string;
    phoneNumber: string;
    lastLogin?: Date | null;
}
