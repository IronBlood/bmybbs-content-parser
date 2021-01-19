import parser from "../src/index.js"

describe("Attachment Parser Test", () => {
	test("mp4 attach", async () => {
		let content = {
			text: "#attach foo.mp4",
			attaches: [{
				name: "foo.mp4",
				link: "http://example.com",
				signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D],
			}]
		}, result = [
			"<article>",
			"<video controls src=\"http://example.com\" />",
			"</article>",
		].join("");

		expect(await parser(content)).toBe(result);
	});

	test("no attach", async () => {
		let content = {
			text: "#attach foo.mp4",
			attaches: []
		}, result = [
			"<article>",
			"#attach foo.mp4",
			"</article>",
		].join("");

		expect(await parser(content)).toBe(result);
	});
});

