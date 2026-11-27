declare const _default: ({
    match: RegExp;
    type: "cmnt";
    sub: string;
    expand?: undefined;
} | {
    type: "str";
    match: RegExp;
    sub: ({
        type: "str";
        match: RegExp;
        sub?: undefined;
    } | {
        type: "var";
        match: RegExp;
        sub: {
            match: RegExp;
            sub: string;
        }[];
    })[];
    expand?: undefined;
} | {
    expand: "str";
    match?: undefined;
    type?: undefined;
    sub?: undefined;
} | {
    type: "kwd";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "bool";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    expand: "num";
    match?: undefined;
    type?: undefined;
    sub?: undefined;
} | {
    type: "func";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "oper";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "class";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
})[];
export default _default;
//# sourceMappingURL=py.d.ts.map