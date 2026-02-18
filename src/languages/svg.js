import html, { htmlElement } from './html.js';
import { name, properties } from './xml.js';

const svgElement = {
    match: RegExp(`<[\/!?]?${name}${properties}[\/!?]?>`, 'g'),
    sub: [
        {
            type: 'var',
            match: RegExp(`^<[\/!?]?${name}`, 'g'),
            sub: [
                {
                    type: 'oper',
                    match: /^<[\/!?]?/g
                }
            ]
        },
        {
            match: /d\s*=\s*('[^']*'|"[^"]*")/gi,
            sub: [
                {
                    match: /^d\s*=\s*/gi,
                    sub: [
                        {
                            type: 'class',
                            match: /^d/gi
                        },
                        {
                            type: 'oper',
                            match: /=/g
                        }
                    ]
                },
                {
                    match: /('[^']*'|"[^"]*")/g,
                    sub: [
                        {
                            type: 'str', // quotes
                            match: /^['"]|['"]$/g
                        },
                        {
                            type: 'kwd', // commands
                            match: /[MmZzLlHhVvCcSsQqTtAa]/g
                        },
                        {
                            type: 'num', // coordinates
                            match: /-?\d*\.?\d+(?:e[+-]?\d+)?/gi
                        },
                        {
                            type: 'oper', // separators
                            match: /[,]/g
                        }
                    ]
                }
            ]
        },
        {
            match: /viewBox\s*=\s*('[^']*'|"[^"]*")/gi,
            sub: [
                {
                    match: /^viewBox\s*=\s*/gi,
                    sub: [
                        {
                            type: 'class',
                            match: /^viewBox/gi
                        },
                        {
                            type: 'oper',
                            match: /=/g
                        }
                    ]
                },
                {
                    match: /('[^']*'|"[^"]*")/g,
                    sub: [
                        {
                            type: 'str', // quotes
                            match: /^['"]|['"]$/g
                        },
                        {
                            type: 'num', // coordinates
                            match: /-?\d*\.?\d+/g
                        }
                    ]
                }
            ]
        },
        ...htmlElement.sub
    ]
};

export default html.map(rule => rule === htmlElement ? svgElement : rule);
