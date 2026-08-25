declare namespace _default {
    let type: "cmnt";
    let sub: ({
        type: "err";
        match: RegExp;
    } | {
        type: "class";
        match: RegExp;
    } | {
        type: "insert";
        match: RegExp;
    } | {
        type: "oper";
        match: RegExp;
    } | {
        type: "kwd";
        match: RegExp;
    } | {
        type: "type";
        match: RegExp;
    } | {
        type: "var";
        match: RegExp;
    })[];
}
export default _default;
//# sourceMappingURL=jsdoc.d.ts.map