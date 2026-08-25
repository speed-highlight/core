declare const _default: ({
    match: RegExp;
    type?: undefined;
    sub?: undefined;
    expand?: undefined;
} | {
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
    match: RegExp;
    type: "str";
    sub: {
        match: {
            exec(str: any): {
                index: number;
                0: any;
            };
            lastIndex: any;
        };
        sub: ({
            type: "kwd";
            match: RegExp;
            sub?: undefined;
        } | {
            match: RegExp;
            sub: string;
            type?: undefined;
        })[];
    }[];
    expand?: undefined;
} | {
    type: "kwd";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    match: RegExp;
    type: "oper";
    sub: string;
    expand?: undefined;
} | {
    expand: "num";
    match?: undefined;
    type?: undefined;
    sub?: undefined;
} | {
    type: "num";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "bool";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "var";
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
} | {
    type: "func";
    match: RegExp;
    sub?: undefined;
    expand?: undefined;
} | {
    type: "type";
    match: RegExp;
})[];
export default _default;
//# sourceMappingURL=ts.d.ts.map