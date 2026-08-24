declare const _default: ({
    type: "cmnt";
    match: RegExp;
    sub?: undefined;
} | {
    type: "section";
    match: RegExp;
    sub?: undefined;
} | {
    type: "class";
    match: RegExp;
    sub?: undefined;
} | {
    match: RegExp;
    sub: (code: string) => {
        type: "kwd";
        sub: {
            match: RegExp;
            sub: string;
        }[];
    };
    type?: undefined;
} | {
    type: "str";
    match: RegExp;
    sub?: undefined;
} | {
    type: "var";
    match: RegExp;
    sub?: undefined;
} | {
    type: "kwd";
    match: RegExp;
    sub?: undefined;
} | {
    type: "func";
    match: RegExp;
    sub: {
        type: "oper";
        match: RegExp;
    }[];
} | {
    type: "insert";
    match: RegExp;
    sub: ({
        type: "insert";
        match: RegExp;
        sub?: undefined;
    } | {
        match: RegExp;
        sub: typeof detectLanguage;
        type?: undefined;
    })[];
} | {
    type: "deleted";
    match: RegExp;
    sub: ({
        type: "deleted";
        match: RegExp;
        sub?: undefined;
    } | {
        match: RegExp;
        sub: typeof detectLanguage;
        type?: undefined;
    })[];
})[];
export default _default;
import { detectLanguage } from '../detect.js';
//# sourceMappingURL=leanpub-md.d.ts.map