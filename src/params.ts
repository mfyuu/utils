/**
 * Next.js App Router の searchParams の値の型
 * string: 単一の値
 * string[]: 同名パラメータが複数ある場合
 * undefined: パラメータが存在しない場合
 */
type SearchParamValue = string | string[] | undefined;

/**
 * parseAsStr のオプション
 */
interface ParseAsStrOptions {
	/**
	 * 必須パラメータかどうか
	 * true の場合、値が取得できない時に Error をスローする
	 * @default false
	 */
	required?: boolean;

	/**
	 * required が true の時に投げるエラーメッセージ
	 * @default "Missing required query parameter"
	 */
	message?: string;
}

/**
 * required: true が指定された ParseAsStrOptions
 */
interface ParseAsStrOptionsRequired extends ParseAsStrOptions {
	required: true;
}

/**
 * クエリパラメータから文字列値を取得する
 *
 * @param value - SearchParamValue (string | string[] | undefined)
 * @returns 取得できた文字列、または null
 *
 * @example
 * ```ts
 * const name = parseAsStr(searchParams.name); // string | null
 * ```
 */
export function parseAsStr(value: SearchParamValue): string | null;

/**
 * クエリパラメータから文字列値を取得する（必須）
 *
 * @param value - SearchParamValue (string | string[] | undefined)
 * @param options - ParseAsStrOptionsRequired (required: true)
 * @returns 取得できた文字列（必ず string）
 * @throws {Error} 値が取得できない場合
 *
 * @example
 * ```ts
 * const id = parseAsStr(searchParams.id, { required: true }); // string
 * const name = parseAsStr(searchParams.name, {
 *   required: true,
 *   message: "Name is required"
 * }); // string
 * ```
 */
export function parseAsStr(
	value: SearchParamValue,
	options: ParseAsStrOptionsRequired,
): string;

// 実装
export function parseAsStr(
	value: SearchParamValue,
	options?: ParseAsStrOptions,
): string | null {
	// 値の正規化
	let resolved: string | null = null;

	if (Array.isArray(value)) {
		// 配列の場合: 最初の要素を取得
		const firstElement = value[0];
		if (firstElement) {
			// 空配列(undefined)や空文字列でなければ採用
			resolved = firstElement;
		}
	} else if (value) {
		// 文字列の場合: 空文字列でなければ採用
		resolved = value;
	}
	// undefined/null/空配列/空文字列の場合: resolved は null のまま

	if (options?.required && resolved === null) {
		throw new Error(options.message ?? "Missing required query parameter");
	}

	// `options?.required` が false or undefined の場合、resolved は string | null
	// required が true の場合、上で throw しているので resolved は string 確定
	return resolved;
}

/**
 * parseAsArr のオプション
 */
export interface ParseAsArrOptions {
	/**
	 * 最初の split に使用する区切り文字
	 * @default ","
	 */
	delimiter?: string | RegExp;

	/**
	 * 各要素をさらに分割し flatten するかどうか
	 * @default false
	 */
	flat?: boolean;

	/**
	 * flat 時の分割区切り文字
	 * @default delimiter と同じ
	 */
	flatDelimiter?: string | RegExp;
}

/**
 * クエリパラメータから配列値を取得する
 *
 * @param value - SearchParamValue (string | string[] | undefined)
 * @param options - ParseAsArrOptions
 * @returns 文字列の配列
 *
 * @example
 * ```ts
 * // デフォルト（カンマ区切り）
 * const tags = parseAsArr(searchParams.tags); // string[]
 * // "a,b,c" → ["a", "b", "c"]
 *
 * // カスタム区切り文字
 * const ids = parseAsArr(searchParams.ids, { delimiter: "|" });
 * // "1|2|3" → ["1", "2", "3"]
 *
 * // flat オプションで入れ子配列を平坦化
 * const items = parseAsArr(searchParams.items, { flat: true });
 * // ["a,b", "c"] → ["a", "b", "c"]
 * ```
 */
export const parseAsArr = (
	value: SearchParamValue,
	options?: ParseAsArrOptions,
): string[] => {
	const delimiter = options?.delimiter ?? ",";
	const flat = options?.flat ?? false;
	const flatDelimiter = options?.flatDelimiter ?? delimiter;

	// falsy値なら空配列
	if (!value) return [];

	// string[] or string → string[]
	const rawArray = Array.isArray(value) ? value : value.split(delimiter);

	// 各要素をtrim + 空文字除外
	const base = rawArray.map((s) => s.trim()).filter(Boolean);

	// flat指定があれば要素ごとに再split
	if (flat) {
		return base.flatMap((v) =>
			v
				.split(flatDelimiter)
				.map((s) => s.trim())
				.filter(Boolean),
		);
	}

	return base;
};

/**
 * クエリパラメータから真偽値を取得する
 *
 * 文字列 "true" の場合のみ true を返し、それ以外は false を返す
 * "false", "1", "0", undefined なども全て false として扱う
 *
 * @param value - SearchParamValue (string | string[] | undefined)
 * @returns true または false
 *
 * @example
 * ```ts
 * const enabled = parseAsBool(searchParams.enabled);
 * // "true" → true
 * // "false" → false
 * // "1" → false
 * // undefined → false
 *
 * // 配列の場合は最初の要素を評価
 * // ["true", "false"] → true
 * // ["false", "true"] → false
 * ```
 */
export const parseAsBool = (value: SearchParamValue): boolean => {
	// falsy値（undefined、空文字列）の場合はfalse
	if (!value) return false;

	// 配列の場合は最初の要素を取得
	const resolved = Array.isArray(value) ? value[0] : value;

	// 厳密に "true" の場合のみ true を返す
	return resolved === "true";
};
