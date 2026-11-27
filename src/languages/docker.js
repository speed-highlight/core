/**
 * @name Dockerfile
 * @alias dockerfile
 */

import bash from "./bash.js";

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		type: 'kwd',
		match: /^(FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b/gmi
	},
	...bash
]);
