export async function getInputCodes(): Promise<string[]> {
    const sessionCookie = process.env.SESSION_COOKIE
    const url = `https://adventofcode.com/2025/day/1/input`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Cookie": `session=${sessionCookie}`,
            "User-Agent":
                "github.com/CallumClarke65-ts",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`);
    }

    const rawText = await res.text()
    return rawText.trimEnd().split('\n')
}