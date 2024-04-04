// To parse this data:
//
//   import { Convert, TransType } from "./file";
//
//   const transType = Convert.toTransType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TransType {
    users:    Users;
    clients:  Clients;
    products: Clients;
    shared:   Shared;
}

export interface Clients {
    meta: Meta;
}

export interface Meta {
    title:       string;
    description: string;
}

export interface Shared {
    header:             Header;
    footer:             Footer;
    under_construction: UnderConstruction;
    actions:            Actions;
    status:             Status;
    labels:             Labels;
}

export interface Actions {
    view:    string;
    edit:    string;
    delete:  string;
    actions: string;
    new:     string;
    save:    string;
    hide:    string;
    show:    string;
    close:   string;
    cancel:  string;
}

export interface Footer {
    copyright: string;
}

export interface Header {
    nav:           Nav;
    user_dropdown: UserDropdown;
}

export interface Nav {
    users:    string;
    clients:  string;
    products: string;
}

export interface UserDropdown {
    login_as: string;
    profile:  string;
    settings: string;
    help:     string;
    logout:   string;
}

export interface Labels {
    columns:            string;
    status:             string;
    rows_per_page:      string;
    total:              string;
    search:             string;
    all_items_selected: string;
    selected:           string;
    not_found:          string;
    are_you_sure:       string;
    confirm_delete:     string;
}

export interface Status {
    active:    string;
    inactive:  string;
    suspended: string;
}

export interface UnderConstruction {
    title:    string;
    subtitle: string;
}

export interface Users {
    meta:    Meta;
    columns: Columns;
    form:    Form;
}

export interface Columns {
    id:             string;
    fullname:       string;
    address:        string;
    phone_number:   string;
    joined_date:    string;
    last_login:     string;
    birthdate:      string;
    email:          string;
    account_status: string;
    actions:        string;
}

export interface Form {
    title:          Title;
    fullname:       Email;
    email:          Email;
    password:       Password;
    account_status: AccountStatus;
    birthdate:      Address;
    address:        Address;
    phone_number:   Email;
}

export interface AccountStatus {
    label: string;
}

export interface Address {
    label:       string;
    placeholder: string;
}

export interface Email {
    label:       string;
    placeholder: string;
    required:    string;
    invalid?:    string;
}

export interface Password {
    label:       string;
    help:        string;
    placeholder: string;
    required:    string;
    min:         string;
    numeric:     string;
    lower:       string;
    upper:       string;
    symbol:      string;
    space:       string;
}

export interface Title {
    new:  string;
    edit: string;
    view: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTransType(json: string): TransType {
        return cast(JSON.parse(json), r("TransType"));
    }

    public static transTypeToJson(value: TransType): string {
        return JSON.stringify(uncast(value, r("TransType")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "TransType": o([
        { json: "users", js: "users", typ: r("Users") },
        { json: "clients", js: "clients", typ: r("Clients") },
        { json: "products", js: "products", typ: r("Clients") },
        { json: "shared", js: "shared", typ: r("Shared") },
    ], false),
    "Clients": o([
        { json: "meta", js: "meta", typ: r("Meta") },
    ], false),
    "Meta": o([
        { json: "title", js: "title", typ: "" },
        { json: "description", js: "description", typ: "" },
    ], false),
    "Shared": o([
        { json: "header", js: "header", typ: r("Header") },
        { json: "footer", js: "footer", typ: r("Footer") },
        { json: "under_construction", js: "under_construction", typ: r("UnderConstruction") },
        { json: "actions", js: "actions", typ: r("Actions") },
        { json: "status", js: "status", typ: r("Status") },
        { json: "labels", js: "labels", typ: r("Labels") },
    ], false),
    "Actions": o([
        { json: "view", js: "view", typ: "" },
        { json: "edit", js: "edit", typ: "" },
        { json: "delete", js: "delete", typ: "" },
        { json: "actions", js: "actions", typ: "" },
        { json: "new", js: "new", typ: "" },
        { json: "save", js: "save", typ: "" },
        { json: "hide", js: "hide", typ: "" },
        { json: "show", js: "show", typ: "" },
        { json: "close", js: "close", typ: "" },
        { json: "cancel", js: "cancel", typ: "" },
    ], false),
    "Footer": o([
        { json: "copyright", js: "copyright", typ: "" },
    ], false),
    "Header": o([
        { json: "nav", js: "nav", typ: r("Nav") },
        { json: "user_dropdown", js: "user_dropdown", typ: r("UserDropdown") },
    ], false),
    "Nav": o([
        { json: "users", js: "users", typ: "" },
        { json: "clients", js: "clients", typ: "" },
        { json: "products", js: "products", typ: "" },
    ], false),
    "UserDropdown": o([
        { json: "login_as", js: "login_as", typ: "" },
        { json: "profile", js: "profile", typ: "" },
        { json: "settings", js: "settings", typ: "" },
        { json: "help", js: "help", typ: "" },
        { json: "logout", js: "logout", typ: "" },
    ], false),
    "Labels": o([
        { json: "columns", js: "columns", typ: "" },
        { json: "status", js: "status", typ: "" },
        { json: "rows_per_page", js: "rows_per_page", typ: "" },
        { json: "total", js: "total", typ: "" },
        { json: "search", js: "search", typ: "" },
        { json: "all_items_selected", js: "all_items_selected", typ: "" },
        { json: "selected", js: "selected", typ: "" },
        { json: "not_found", js: "not_found", typ: "" },
        { json: "are_you_sure", js: "are_you_sure", typ: "" },
        { json: "confirm_delete", js: "confirm_delete", typ: "" },
    ], false),
    "Status": o([
        { json: "active", js: "active", typ: "" },
        { json: "inactive", js: "inactive", typ: "" },
        { json: "suspended", js: "suspended", typ: "" },
    ], false),
    "UnderConstruction": o([
        { json: "title", js: "title", typ: "" },
        { json: "subtitle", js: "subtitle", typ: "" },
    ], false),
    "Users": o([
        { json: "meta", js: "meta", typ: r("Meta") },
        { json: "columns", js: "columns", typ: r("Columns") },
        { json: "form", js: "form", typ: r("Form") },
    ], false),
    "Columns": o([
        { json: "id", js: "id", typ: "" },
        { json: "fullname", js: "fullname", typ: "" },
        { json: "address", js: "address", typ: "" },
        { json: "phone_number", js: "phone_number", typ: "" },
        { json: "joined_date", js: "joined_date", typ: "" },
        { json: "last_login", js: "last_login", typ: "" },
        { json: "birthdate", js: "birthdate", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "account_status", js: "account_status", typ: "" },
        { json: "actions", js: "actions", typ: "" },
    ], false),
    "Form": o([
        { json: "title", js: "title", typ: r("Title") },
        { json: "fullname", js: "fullname", typ: r("Email") },
        { json: "email", js: "email", typ: r("Email") },
        { json: "password", js: "password", typ: r("Password") },
        { json: "account_status", js: "account_status", typ: r("AccountStatus") },
        { json: "birthdate", js: "birthdate", typ: r("Address") },
        { json: "address", js: "address", typ: r("Address") },
        { json: "phone_number", js: "phone_number", typ: r("Email") },
    ], false),
    "AccountStatus": o([
        { json: "label", js: "label", typ: "" },
    ], false),
    "Address": o([
        { json: "label", js: "label", typ: "" },
        { json: "placeholder", js: "placeholder", typ: "" },
    ], false),
    "Email": o([
        { json: "label", js: "label", typ: "" },
        { json: "placeholder", js: "placeholder", typ: "" },
        { json: "required", js: "required", typ: "" },
        { json: "invalid", js: "invalid", typ: u(undefined, "") },
    ], false),
    "Password": o([
        { json: "label", js: "label", typ: "" },
        { json: "help", js: "help", typ: "" },
        { json: "placeholder", js: "placeholder", typ: "" },
        { json: "required", js: "required", typ: "" },
        { json: "min", js: "min", typ: "" },
        { json: "numeric", js: "numeric", typ: "" },
        { json: "lower", js: "lower", typ: "" },
        { json: "upper", js: "upper", typ: "" },
        { json: "symbol", js: "symbol", typ: "" },
        { json: "space", js: "space", typ: "" },
    ], false),
    "Title": o([
        { json: "new", js: "new", typ: "" },
        { json: "edit", js: "edit", typ: "" },
        { json: "view", js: "view", typ: "" },
    ], false),
};
