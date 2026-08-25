declare const _default: ({
    match: RegExp;
    type: "cmnt";
    sub: string;
    expand?: undefined;
} | {
    expand: "str";
    match?: undefined;
    type?: undefined;
    sub?: undefined;
} | {
    type: "var";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "kwd";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "func";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "num";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "num";
    match: RegExp;
    sub: {
        type: "var";
        match: RegExp;
    }[];
    expand?: undefined;
} | {
    match: RegExp;
    sub: ({
        type: "func";
        match: RegExp;
    } | {
        type: "str";
        match: RegExp;
    })[];
    type?: undefined;
    expand?: undefined;
})[];
export default _default;
//# sourceMappingURL=css.d.ts.map