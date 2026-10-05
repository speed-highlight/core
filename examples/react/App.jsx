import Code from './Code.jsx';

const code = `const tag = '<b>' + "&";\nconsole.log(tag);`;

export default function App() {
	return <>
		<Code lang='js' code={code} showLineNumbers />
		<Code lang='js' code='const a = 1;' block={false} />
	</>;
}
