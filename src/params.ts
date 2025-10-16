type SearchParamValue = string | string[] | undefined;

interface ResolveQueryOptions {
	required?: boolean;
	message?: string;
}

interface ResolveQueryOptionsRequired extends ResolveQueryOptions {
	required: true;
}

export function resolveQueryString(value: SearchParamValue): string | null;

export function resolveQueryString(
	value: SearchParamValue,
	options: ResolveQueryOptionsRequired,
): string;

// 実装
export function resolveQueryString(
	value: SearchParamValue,
	options?: ResolveQueryOptions,
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

export interface ResolveArrayOptions {
	/**
	 * 最初の split に使用する区切り文字
	 * デフォルト: ","
	 */
	delimiter?: string | RegExp;

	/**
	 * 各要素をさらに分割し flatten するかどうか
	 * デフォルト: false
	 */
	flat?: boolean;

	/**
	 * flat 時の分割区切り文字
	 * デフォルト: delimiter と同じ
	 */
	flatDelimiter?: string | RegExp;
}

/**
 * resolveQueryArray
 * -----------------
 * string | string[] | undefined → string[]
 */
export function resolveQueryArray(
	value: SearchParamValue,
	options?: ResolveArrayOptions,
): string[] {
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
}
