// Hermes btoa/atob only handle strings — use chunked String.fromCharCode to
// convert binary data, then encode. This is the standard JS fallback pattern.
export function uint8ToLatin1(bytes: Uint8Array, chunk = 8192): string {
  const parts: string[] = [];

  for (let i = 0; i < bytes.length; i += chunk) {
    parts.push(
      String.fromCharCode.apply(
        null,
        bytes.subarray(
          i,
          Math.min(i + chunk, bytes.length)
        ) as unknown as number[]
      )
    );
  }

  return parts.join('');
}

export function latin1ToUint8(latin1: string): Uint8Array {
  const result = new Uint8Array(latin1.length);

  for (let index = 0; index < latin1.length; index++) {
    result[index] = latin1.charCodeAt(index);
  }

  return result;
}

export function b64ToUrl(base64: string): string {
  return base64.replace(/[+/=]/g, (char) =>
    char === '+' ? '-' : char === '/' ? '_' : ''
  );
}

export function urlToB64(base64Url: string): string {
  const paddingLength = base64Url.length % 4;

  return (
    base64Url.replace(/[-_]/g, (char) => (char === '-' ? '+' : '/')) +
    (paddingLength === 2 ? '==' : paddingLength === 3 ? '=' : '')
  );
}
