import parser from "../src/index"

describe("Attachment Parser Test", () => {
	test("mp4 attach", () => {
		const content = {
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

		expect(parser(content)).toBe(result);
	});

	test("no attach", () => {
		const content = {
			text: "#attach foo.mp4",
			attaches: []
		}, result = [
			"<article>",
			"<p>",
			"#attach foo.mp4",
			"</p>",
			"</article>",
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("img attach", () => {
		// jpg
		const content = {
			text: "#attach foo.jpg",
			attaches: [{
				name: "foo.jpg",
				link: "http://example.com",
				signature: [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01],
			}]
		},
		result = [
			"<article>",
			"<img src=\"http://example.com\">",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);

		// bmp
		content.attaches[0].signature = [0x42, 0x4d, 0x3a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x36, 0x00, 0x00, 0x00, 0x28, 0x00];
		expect(parser(content)).toBe(result);
		// gif
		content.attaches[0].signature = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0xf7, 0x00, 0x00, 0x00, 0x00, 0x00];
		expect(parser(content)).toBe(result);
		// png
		content.attaches[0].signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52];
		expect(parser(content)).toBe(result);
		// webp
		content.attaches[0].signature = [0x52, 0x49, 0x46, 0x46, 0x1a, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x4c];
		expect(parser(content)).toBe(result);
	});
});

