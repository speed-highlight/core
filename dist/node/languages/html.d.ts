declare const _default: ({
    match: RegExp;
    sub: import("../index.js").ShjGrammar;
} | {
    match: RegExp;
    type: "cmnt";
    sub: string;
} | {
    type: "class";
    match: RegExp;
    sub?: undefined;
} | {
    type: "str";
    match: RegExp;
    sub: ({
        type: "var";
        match: RegExp;
        sub: {
            type: "oper";
            match: RegExp;
        }[];
    } | {
        type: "oper";
        match: RegExp;
        sub?: undefined;
    })[];
} | {
    type: "var";
    match: RegExp;
    sub?: undefined;
} | {
    type: "class";
    match: RegExp;
    sub: ({
        type: "str";
        match: RegExp;
    } | {
        type: "oper";
        match: RegExp;
    } | {
        type: "var";
        match: RegExp;
    })[];
} | {
    match: RegExp;
    sub: ({
        sub: import("../tokenize.js").ShjRule[];
        match: RegExp;
    } | {
        match: RegExp;
        sub: string;
    })[];
    type?: undefined;
})[];
export default _default;
//# sourceMappingURL=html.d.ts.map