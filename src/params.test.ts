import { describe, expect, it } from "vitest";
import {
	resolveQueryArray,
	resolveQueryBoolean,
	resolveQueryString,
} from "./params";

/**
 * 完全なURLからNext.js v15のsearchParams形式に変換するヘルパー
 * 実際のURL文字列（https://example.com/?name=john）からテストデータを生成
 */
const parseSearchParams = (
	url: string,
): Record<string, string | string[] | undefined> => {
	const urlObj = new URL(url);
	const params = urlObj.searchParams;
	const result: Record<string, string | string[] | undefined> = {};

	for (const key of params.keys()) {
		const values = params.getAll(key);
		if (values.length === 0) {
			result[key] = undefined;
		} else if (values.length === 1) {
			result[key] = values[0];
		} else {
			result[key] = values;
		}
	}

	return result;
};

describe("resolveQueryString", () => {
	describe("requireなし", () => {
		it("undefinedの場合にnullを返す", () => {
			const params = parseSearchParams("https://example.com");
			const result = resolveQueryString(params.name);
			expect(result).toBeNull();
		});

		it("空文字列の場合にnullを返す", () => {
			const params = parseSearchParams("https://example.com/?name=");
			const result = resolveQueryString(params.name);
			expect(result).toBeNull();
		});

		it("単一の文字列値をそのまま返す", () => {
			const params = parseSearchParams("https://example.com/?name=hello");
			const result = resolveQueryString(params.name);
			expect(result).toBe("hello");
		});

		it("数値形式の文字列も文字列として返す", () => {
			const params = parseSearchParams("https://example.com/?id=123");
			const result = resolveQueryString(params.id);
			expect(result).toBe("123");
		});

		it("URLエンコードされた特殊文字をデコードして返す", () => {
			const params = parseSearchParams(
				"https://example.com/?email=hello%40example.com",
			);
			const result = resolveQueryString(params.email);
			expect(result).toBe("hello@example.com");
		});

		it("配列の場合は最初の要素のみを返す", () => {
			const params = parseSearchParams(
				"https://example.com/?tag=first&tag=second",
			);
			const result = resolveQueryString(params.tag);
			expect(result).toBe("first");
		});

		it("URLエンコードされた日本語をデコードして返す", () => {
			const params = parseSearchParams(
				"https://example.com/?name=%E3%81%82%E3%81%84%E3%81%86",
			);
			const result = resolveQueryString(params.name);
			expect(result).toBe("あいう");
		});
	});

	describe("requireあり", () => {
		describe("デフォルトメッセージ", () => {
			it("undefinedの場合にデフォルトエラーメッセージを投げる", () => {
				const params = parseSearchParams("https://example.com");
				expect(() =>
					resolveQueryString(params.name, { required: true }),
				).toThrow("Missing required query parameter");
			});

			it("空文字列の場合にデフォルトエラーメッセージを投げる", () => {
				const params = parseSearchParams("https://example.com/?name=");
				expect(() =>
					resolveQueryString(params.name, { required: true }),
				).toThrow("Missing required query parameter");
			});

			it("必須指定時に文字列値を正常に返す", () => {
				const params = parseSearchParams("https://example.com/?name=hello");
				expect(resolveQueryString(params.name, { required: true })).toBe(
					"hello",
				);
			});

			it("必須指定時に数値形式の文字列を返す", () => {
				const params = parseSearchParams("https://example.com/?id=123");
				expect(resolveQueryString(params.id, { required: true })).toBe("123");
			});

			it("必須指定時にURLエンコードされた特殊文字をデコードして返す", () => {
				const params = parseSearchParams(
					"https://example.com/?email=hello%40example.com",
				);
				expect(resolveQueryString(params.email, { required: true })).toBe(
					"hello@example.com",
				);
			});

			it("必須指定時に配列の最初の要素を返す", () => {
				const params = parseSearchParams(
					"https://example.com/?tag=first&tag=second",
				);
				expect(resolveQueryString(params.tag, { required: true })).toBe(
					"first",
				);
			});

			it("必須指定時にURLエンコードされた日本語をデコードして返す", () => {
				const params = parseSearchParams(
					"https://example.com/?name=%E3%81%82%E3%81%84%E3%81%86",
				);
				expect(resolveQueryString(params.name, { required: true })).toBe(
					"あいう",
				);
			});
		});

		describe("カスタムメッセージ", () => {
			it("undefinedの場合にカスタムエラーメッセージを投げる", () => {
				const params = parseSearchParams("https://example.com");
				expect(() =>
					resolveQueryString(params.name, {
						required: true,
						message: "Name is required",
					}),
				).toThrow("Name is required");
			});

			it("空文字列の場合にカスタムエラーメッセージを投げる", () => {
				const params = parseSearchParams("https://example.com/?name=");
				expect(() =>
					resolveQueryString(params.name, {
						required: true,
						message: "Name is required",
					}),
				).toThrow("Name is required");
			});

			it("カスタムメッセージ指定時に値を正常に返す", () => {
				const params = parseSearchParams("https://example.com/?id=123");
				expect(
					resolveQueryString(params.id, {
						required: true,
						message: "ID is required",
					}),
				).toBe("123");
			});

			it("カスタムメッセージ指定時に配列の最初の要素を返す", () => {
				const params = parseSearchParams(
					"https://example.com/?tag=first&tag=second",
				);
				expect(
					resolveQueryString(params.tag, {
						required: true,
						message: "Tag is required",
					}),
				).toBe("first");
			});
		});
	});
});

describe("resolveQueryArray", () => {
	describe("flatなし", () => {
		describe("デフォルトdelimiter (`,`)", () => {
			it("undefinedの場合に空配列を返す", () => {
				const params = parseSearchParams("https://example.com");
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual([]);
			});

			it("空文字列の場合に空配列を返す", () => {
				const params = parseSearchParams("https://example.com/?tags=");
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual([]);
			});

			it("カンマ区切りの文字列を配列に分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a,b,c");
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual(["a", "b", "c"]);
			});

			it("区切り文字がない場合は単一要素の配列を返す", () => {
				const params = parseSearchParams("https://example.com/?tag=hello");
				const result = resolveQueryArray(params.tag);
				expect(result).toEqual(["hello"]);
			});

			it("連続するカンマで生じる空要素を除外する", () => {
				const params = parseSearchParams("https://example.com/?tags=a,,b");
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual(["a", "b"]);
			});

			it("末尾のカンマで生じる空要素を除外する", () => {
				const params = parseSearchParams("https://example.com/?tags=a,b,");
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual(["a", "b"]);
			});

			it("先頭のカンマで生じる空要素を除外する", () => {
				const params = parseSearchParams("https://example.com/?tags=,a,b");
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual(["a", "b"]);
			});

			it("同名パラメータが複数ある場合は配列にまとめる", () => {
				const params = parseSearchParams("https://example.com/?tag=a&tag=b");
				const result = resolveQueryArray(params.tag);
				expect(result).toEqual(["a", "b"]);
			});

			it("配列に含まれる空文字列をフィルタリングする", () => {
				const params = parseSearchParams(
					"https://example.com/?tag=a&tag=&tag=b",
				);
				const result = resolveQueryArray(params.tag);
				expect(result).toEqual(["a", "b"]);
			});

			it("URLエンコードされた日本語のカンマ区切り文字列を配列に分割する", () => {
				const params = parseSearchParams(
					"https://example.com/?tags=%E3%81%82%E3%81%84%E3%81%86,%E3%81%8B%E3%81%8D%E3%81%8F",
				);
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual(["あいう", "かきく"]);
			});

			it("カンマもエンコードされた日本語文字列を正しく分割する", () => {
				const params = parseSearchParams(
					"https://example.com/?tags=%E3%81%82%E3%81%84%E3%81%86%2C%E3%81%8B%E3%81%8D%E3%81%8F",
				);
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual(["あいう", "かきく"]);
			});

			it("日本語の同名パラメータを配列にまとめる", () => {
				const params = parseSearchParams(
					"https://example.com/?tags=%E3%81%82%E3%81%84%E3%81%86&tags=%E3%81%8B%E3%81%8D%E3%81%8F",
				);
				const result = resolveQueryArray(params.tags);
				expect(result).toEqual(["あいう", "かきく"]);
			});
		});

		describe("カスタムdelimiter", () => {
			it("パイプ区切りの文字列を配列に分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a|b|c");
				const result = resolveQueryArray(params.tags, { delimiter: "|" });
				expect(result).toEqual(["a", "b", "c"]);
			});

			it("URLエンコードされたパイプ区切り文字列を配列に分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a%7Cb%7Cc");
				const result = resolveQueryArray(params.tags, { delimiter: "|" });
				expect(result).toEqual(["a", "b", "c"]);
			});

			it("セミコロン区切りの文字列を配列に分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a;b;c");
				const result = resolveQueryArray(params.tags, { delimiter: ";" });
				expect(result).toEqual(["a", "b", "c"]);
			});

			it("URLエンコードされたセミコロン区切り文字列を配列に分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a%3Bb%3Bc");
				const result = resolveQueryArray(params.tags, { delimiter: ";" });
				expect(result).toEqual(["a", "b", "c"]);
			});

			it("正規表現で複数の区切り文字に対応（カンマとセミコロン）", () => {
				const params = parseSearchParams("https://example.com/?tags=a,b;c");
				const result = resolveQueryArray(params.tags, { delimiter: /[,;]/ });
				expect(result).toEqual(["a", "b", "c"]);
			});

			it("正規表現で連続する空白を1つの区切りとして扱う", () => {
				const params = parseSearchParams(
					"https://example.com/?tags=a%20%20b%20c",
				);
				const result = resolveQueryArray(params.tags, { delimiter: /\s+/ });
				expect(result).toEqual(["a", "b", "c"]);
			});
		});
	});

	describe("flatあり", () => {
		describe("flat指定時の基本動作", () => {
			it("カンマ区切り文字列を配列に分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a,b,c");
				expect(resolveQueryArray(params.tags, { flat: true })).toEqual([
					"a",
					"b",
					"c",
				]);
			});

			it("同名パラメータの各要素をカンマで再分割してフラット化する", () => {
				const params = parseSearchParams(
					"https://example.com/?items=a,b&items=c",
				);
				expect(resolveQueryArray(params.items, { flat: true })).toEqual([
					"a",
					"b",
					"c",
				]);
			});

			it("区切り文字がない同名パラメータはそのまま配列にする", () => {
				const params = parseSearchParams("https://example.com/?tag=a&tag=b");
				expect(resolveQueryArray(params.tag, { flat: true })).toEqual([
					"a",
					"b",
				]);
			});

			it("複数の同名パラメータをすべて分割してフラット化する", () => {
				const params = parseSearchParams(
					"https://example.com/?items=a,b,c&items=d,e",
				);
				expect(resolveQueryArray(params.items, { flat: true })).toEqual([
					"a",
					"b",
					"c",
					"d",
					"e",
				]);
			});

			it("undefinedの場合に空配列を返す", () => {
				const params = parseSearchParams("https://example.com/");
				expect(resolveQueryArray(params.items, { flat: true })).toEqual([]);
			});

			it("空文字列の場合に空配列を返す", () => {
				const params = parseSearchParams("https://example.com/?tags=");
				expect(resolveQueryArray(params.tags, { flat: true })).toEqual([]);
			});

			it("連続するカンマで生じる空要素を除外する", () => {
				const params = parseSearchParams("https://example.com/?tags=a,,b");
				expect(resolveQueryArray(params.tags, { flat: true })).toEqual([
					"a",
					"b",
				]);
			});

			it("末尾のカンマで生じる空要素を除外する", () => {
				const params = parseSearchParams("https://example.com/?tags=a,b,");
				expect(resolveQueryArray(params.tags, { flat: true })).toEqual([
					"a",
					"b",
				]);
			});

			it("先頭のカンマで生じる空要素を除外する", () => {
				const params = parseSearchParams("https://example.com/?tags=,a,b");
				expect(resolveQueryArray(params.tags, { flat: true })).toEqual([
					"a",
					"b",
				]);
			});

			it("配列に含まれる空文字列をフィルタリングする", () => {
				const params = parseSearchParams(
					"https://example.com/?tag=a&tag=&tag=b",
				);
				expect(resolveQueryArray(params.tag, { flat: true })).toEqual([
					"a",
					"b",
				]);
			});

			it("カスタムdelimiterとflat指定でパイプ区切り文字列を分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a|b|c");
				expect(
					resolveQueryArray(params.tags, { delimiter: "|", flat: true }),
				).toEqual(["a", "b", "c"]);
			});

			it("カスタムdelimiterとflat指定でセミコロン区切り文字列を分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a;b;c");
				expect(
					resolveQueryArray(params.tags, { delimiter: ";", flat: true }),
				).toEqual(["a", "b", "c"]);
			});

			it("日本語のカンマ区切り文字列をフラット化する", () => {
				const params = parseSearchParams(
					"https://example.com/?tags=%E3%81%82%E3%81%84%E3%81%86,%E3%81%8B%E3%81%8D%E3%81%8F",
				);
				expect(resolveQueryArray(params.tags, { flat: true })).toEqual([
					"あいう",
					"かきく",
				]);
			});
		});

		describe("flatDelimiterでの再分割", () => {
			it("flatDelimiterにパイプを指定して再分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a|b");
				expect(
					resolveQueryArray(params.tags, {
						delimiter: ",",
						flat: true,
						flatDelimiter: "|",
					}),
				).toEqual(["a", "b"]);
			});

			it("同名パラメータをflatDelimiterで指定した区切り文字で再分割する", () => {
				const params = parseSearchParams(
					"https://example.com/?items=a|b&items=c|d",
				);
				expect(
					resolveQueryArray(params.items, {
						delimiter: ",",
						flat: true,
						flatDelimiter: "|",
					}),
				).toEqual(["a", "b", "c", "d"]);
			});

			it("flatDelimiterにセミコロンを指定して再分割する", () => {
				const params = parseSearchParams("https://example.com/?tags=a;b;c");
				expect(
					resolveQueryArray(params.tags, {
						delimiter: ",",
						flat: true,
						flatDelimiter: ";",
					}),
				).toEqual(["a", "b", "c"]);
			});

			it("フラット化後も空要素を除外する", () => {
				const params = parseSearchParams(
					"https://example.com/?items=a,b&items=&items=c",
				);
				expect(resolveQueryArray(params.items, { flat: true })).toEqual([
					"a",
					"b",
					"c",
				]);
			});

			it("flatDelimiterに正規表現を指定して再分割（カンマとセミコロン）", () => {
				const params = parseSearchParams("https://example.com/?tags=a,b;c");
				expect(
					resolveQueryArray(params.tags, {
						delimiter: "&",
						flat: true,
						flatDelimiter: /[,;]/,
					}),
				).toEqual(["a", "b", "c"]);
			});

			it("delimiterとflatDelimiterの両方に正規表現を使用", () => {
				const params = parseSearchParams(
					"https://example.com/?items=a%20b&items=c%20d",
				);
				expect(
					resolveQueryArray(params.items, {
						delimiter: /&/,
						flat: true,
						flatDelimiter: /\s+/,
					}),
				).toEqual(["a", "b", "c", "d"]);
			});
		});
	});
});

describe("resolveQueryBoolean", () => {
	it("undefinedの場合にfalseを返す", () => {
		const params = parseSearchParams("https://example.com");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it("空文字列の場合にfalseを返す", () => {
		const params = parseSearchParams("https://example.com/?enabled=");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it('"true"の場合にtrueを返す', () => {
		const params = parseSearchParams("https://example.com/?enabled=true");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(true);
	});

	it('"false"の場合にfalseを返す', () => {
		const params = parseSearchParams("https://example.com/?enabled=false");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it('"1"の場合にfalseを返す', () => {
		const params = parseSearchParams("https://example.com/?enabled=1");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it('"0"の場合にfalseを返す', () => {
		const params = parseSearchParams("https://example.com/?enabled=0");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it("その他の文字列の場合にfalseを返す", () => {
		const params = parseSearchParams("https://example.com/?enabled=yes");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it('配列["true"]の場合にtrueを返す', () => {
		const params = parseSearchParams(
			"https://example.com/?enabled=true&enabled=false",
		);
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(true);
	});

	it('配列["false"]の場合にfalseを返す', () => {
		const params = parseSearchParams(
			"https://example.com/?enabled=false&enabled=true",
		);
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it("配列の最初の要素が空文字列の場合にfalseを返す", () => {
		const params = parseSearchParams(
			"https://example.com/?enabled=&enabled=true",
		);
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it("大文字の場合にfalseを返す（厳密な比較）", () => {
		const params = parseSearchParams("https://example.com/?enabled=True");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it("大文字の場合にfalseを返す（すべて大文字）", () => {
		const params = parseSearchParams("https://example.com/?enabled=TRUE");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(false);
	});

	it("URLエンコードされたtrueをデコードしてtrueを返す", () => {
		const params = parseSearchParams("https://example.com/?enabled=true");
		const result = resolveQueryBoolean(params.enabled);
		expect(result).toBe(true);
	});
});
